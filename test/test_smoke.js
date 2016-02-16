'use strict';

let assert = require('assert')
let fs = require('fs')
let spawnSync = require('child_process').spawnSync

let cheerio = require('cheerio')

suite('smoke', function() {
    setup(function() {
	this.cmd = './mathjax-embed'
    })

    test('empty', function () {
	let r = spawnSync(this.cmd,  [], {input: ''})
	assert.equal('<html><head><style type="text/css">',
		     r.stdout.toString().slice(0, 35))
	assert.equal('</style></head><body></body></html>',
		     r.stdout.toString().slice(-35))
    })

    test('y=sin(x)', function () {
	let r = spawnSync(this.cmd,  [], {input: '$y = \sin(x)$'})
	let $ = cheerio.load(r.stdout.toString())
	assert(1, $('svg').length)
    })

    test('example01.html', function () {
	let r = spawnSync(this.cmd,  [], {
	    input: fs.readFileSync('test/data/example01.html').toString()
	})
	let $ = cheerio.load(r.stdout.toString())
	assert(9, $('svg').length)
    })
})
