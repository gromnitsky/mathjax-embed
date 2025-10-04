let assert = require('assert/strict')
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
        assert.equal(2, $('svg').length)
        let scripts = $('script')
        assert.equal(1, scripts.length)
        assert.equal('MathJax-Element-1', $('script')[0].attribs.id)
        assert(!$('script')[0].attribs.src)
    })

    test('example01.html', function () {
	let r = spawnSync(this.cmd,  [], {
	    input: fs.readFileSync('test/data/example01.html').toString()
	})
	let $ = cheerio.load(r.stdout.toString())
        assert.equal(11, $('svg').length)
        assert.equal(10, $('script').length)
        assert.equal(10, $('script[type*="math/tex"]').length)
    })
})
