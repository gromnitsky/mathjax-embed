import assert from 'assert/strict'
import fs from 'fs'
import {spawnSync} from 'child_process'

import {JSDOM} from 'jsdom'

suite('smoke', function() {
    setup(function() {
        this.cmd = './mathjax-embed.js'
    })

    test('empty', function () {
        let r = spawnSync(this.cmd,  [], {input: ''})
        r = r.stdout.toString()
        assert.equal(r.slice(0, 39), '<html><head><style id="MJX-SVG-styles">')
        assert.equal( r.slice(-36), '</style></head><body></body></html>\n')
    })

    test('y=sin(x)', function () {
        let r = spawnSync(this.cmd,  [], {input: '$y = \\sin(x)$'})
        let dom = new JSDOM(r.stdout.toString())
        let $ = dom.window.document.querySelectorAll.bind(dom.window.document)

        assert.equal($('svg').length, 2)
        let scripts = $('script')
        assert.equal(scripts.length, 0)
    })

    test('example01.html', function () {
        let r = spawnSync(this.cmd,  [], {
            input: fs.readFileSync('test/data/example01.html').toString()
        })
        let dom = new JSDOM(r.stdout.toString())
        let $ = dom.window.document.querySelectorAll.bind(dom.window.document)

        assert.equal(14, $('svg').length)
        assert.equal(0, $('script').length)
    })
})
