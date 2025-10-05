#!/usr/bin/env node

import fs from 'fs'
import { Script } from 'vm'
import util from 'util'
import os from 'os'
import { createRequire } from 'module'
let my_require = createRequire(import.meta.url)
import path from 'path'
import meta from './package.json' with { type: 'json' }

import jsdom from 'jsdom'
let {JSDOM} = jsdom

function read(file) {
    let stream = file ? fs.createReadStream(file) : process.stdin
    let data = []
    return new Promise( (resolve, reject) => {
        stream.on('error', reject)
        stream.on('data', chunk => data.push(chunk))
        stream.on('end', () => resolve(data.join``))
    })
}

async function version() {
    let v = name => import(`${name}/package.json`, { with: {type: 'json'} })
        .then( p => p.default.version)
    return util.format('%s/s (%s %s) mathjax/%s domjs/%s nodejs/%s',
                       meta.name, meta.version, os.type(), os.machine(),
                       await v('mathjax'), await v('jsdom'), process.version)
}

function log(...args) { if (process.env.V) console.error(...args) }

let loader = await read(`${import.meta.dirname}/loader.js`)

function cleanup(document) {
    let s = Array.from(document.querySelectorAll(`script[src*="mathjax"]`))
    let pandoc = document.querySelector('script[src*="https://cdn.jsdelivr.net/npm/mathjax"]')
    if (pandoc) s.push(pandoc)
    s.forEach( node => { node?.parentNode?.removeChild(node) })
}

// reject all external http(s) resources
class MyResourceLoader extends jsdom.ResourceLoader {
    fetch(url, opt) {
        log(`<${opt.element.localName}>: ${url}`)
        let u; try {
            u = new URL(url)
        } catch(e) {
            return Promise.reject(e)
        }
        if (u.protocol === "http:" || u.protocol === "https:")
            return Promise.reject()
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
    mathjax_conf = JSON.parse(await read(params.values.config))
} catch (e) {
    console.error(e.message)
    process.exit(1)
}

if (params.values.version) {
    console.log(await version())
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

let html = await read()
let base = path.dirname(path.dirname(my_require.resolve('mathjax')))
log('base:', base)
let dom = new JSDOM(html, {
    url: `file://${base}/`,
    runScripts: 'dangerously',
    resources: new MyResourceLoader(),
    virtualConsole
})

dom.window.my_exit = function() {
    log('Cleanup & serialize')
    cleanup(dom.window.document)
    console.log(dom.serialize())
}

dom.window.my_mathjax_conf = mathjax_conf

let script = new Script(loader)
let vmContext = dom.getInternalVMContext()
script.runInContext(vmContext)
