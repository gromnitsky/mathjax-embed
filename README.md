# mathjax-embed

A quick hack to "embed" mathjax into a html file. Actually it doesn't
embed anything, but renders the page in phantomjs & prints the result
to stdout. For mathjax configs w/o menu it means that the resulting
file to be displayed correctly **doesn't require JavaScript** at all.

See `test/data/example01.mathjax.html`, for example.

## Requirements

* phantomjs 2.1.1
* nodejs 5.6.0

mathjax-embed doesn't use nodejs, we just need it to pull several pkgs
from npm.

## Installation

1. clone the repo in `$dir`
2. chdir `$dir`
3. run `npm install`
4. **symlink** `$dir/mathjax-embed-wrapper.sh` to a dir in PATH as `mathjax-embed`

## Usage

~~~
$ mathjax-embed
Usage: mathjax-embed [options] file.html

Available options:
  -h, --help           This text
  -V, --version        Print version number
  -c, --conf FILE      Use a custom .js mathjax config
  -d, --dir DIR        Mathjax source directory. Default: /home/alex/lib/\
software/alex/phantomjs/mathjax-embed/node_modules/mathjax
  -f, --filters LIST   A comma-separated list of filters that is applied \
after mathjax rendering. Use empty string "" to disable all. Default:\
 pandoc-rm-br,script-rm-config,mathjax-rm-message
  -v, --verbose        (debug) Increase verbosity level
  -x, --noexit         (debug) Do not exit after rendering
~~~

The default mathjax config (use `-c` CLO to provide your own):

~~~
window.MathJax = {
	showMathMenu: false,
	extensions: ["tex2jax.js"],
	tex2jax: { inlineMath: [["$","$"], ["\\(","\\)"]] },
	jax: ["input/TeX", "output/HTML-CSS"]
}
~~~

## Bugs

* Doesn't work under Windows

## License

MIT.
