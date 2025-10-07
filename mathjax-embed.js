#!/usr/bin/env node

import fs from 'fs'
import { Script } from 'vm'
import util from 'util'
import os from 'os'
import { createRequire } from 'module'
import path from 'path'

import jsdom from 'jsdom'
let {JSDOM} = jsdom

import meta from './package.json' with { type: 'json' }
let my_require = createRequire(import.meta.url)
let base = path.dirname(path.dirname(my_require.resolve('mathjax')))

function read(file) { return fs.readFileSync(file).toString() }

function read_async(file) {
    let stream = file ? fs.createReadStream(file) : process.stdin
    let data = []
    return new Promise( (resolve, reject) => {
        stream.on('error', reject)
        stream.on('data', chunk => data.push(chunk))
        stream.on('end', () => resolve(data.join``))
    })
}

function version() {
    let v = n => JSON.parse(read(path.join(base, n, 'package.json'))).version
    return util.format('%s/%s (%s %s) mathjax/%s domjs/%s nodejs/%s',
                       meta.name, meta.version, os.type(), os.machine(),
                       v('mathjax'), v('jsdom'), process.version)
}

function log(...args) { if (process.env.V) console.error(...args) }

function cleanup(document) {
    document.querySelectorAll(`script[src*="mathjax"]`)
        .forEach( node => { node.remove() })
}

// reject all external http(s) resources
class MyResourceLoader extends jsdom.ResourceLoader {
    fetch(url, opt) {
        log(`<${opt.element.localName}>: ${url}`)
        if (url.match(/^https?:/)) return Promise.reject()
        return super.fetch(url, opt)
    }
}

let options = {
    config: {
        short: 'c', type: 'string',
        default: `${import.meta.dirname}/mathjax.conf.json`
    },
    version: { short: 'V', type: 'boolean' },
    'config-print': { type: 'boolean' }
}

let params, mathjax_conf
try {
    params = util.parseArgs({options})
    mathjax_conf = JSON.parse(read(params.values.config))
} catch (e) {
    console.error(e.message)
    console.error(`Usage: ${meta.name} [-c config.json] [--config-print] [-V] < file.html`)
    process.exit(1)
}

if (params.values.version) {
    console.log(version())
    process.exit(0)
}

if (params.values['config-print']) {
    console.log(JSON.stringify(mathjax_conf, null, 4))
    process.exit(0)
}

let virtualConsole = new jsdom.VirtualConsole()
virtualConsole.on("log", e => log('[console.log]', e))
virtualConsole.on("error", e => log('[console.error]', e))
virtualConsole.on("jsdomError", e => log('[JSDOM]', e.message))

let html = await read_async(/* stdin */)
log('base:', base)
let dom = new JSDOM(html, {
    url: `file://${base}/`,
    runScripts: /* very */ 'dangerously',
    resources: new MyResourceLoader(),
    virtualConsole
})

dom.window.my_exit = function() {
    log('Cleanup & serialize')
    cleanup(dom.window.document)
    console.log(dom.serialize())
}

dom.window.my_mathjax_conf = mathjax_conf

let script = new Script(read(`${import.meta.dirname}/loader.js`))
let vmContext = dom.getInternalVMContext()
script.runInContext(vmContext)
