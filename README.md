A quick hack to "embed" MathJax into an html file as SVGs. Actually,
it doesn't embed anything, but renders the page in phantomjs & prints
the result to stdout. For mathjax configs w/o menu this means the
resulting file **doesn't require JavaScript** to render itself.

**2025 update**: the majorify of code was written in 2016, but it's
still a viable option if you target device doesn't support MathML.

## Installation

1. Install phantomjs:

   - Get a precompiled binary from https://phantomjs.org/download.html
   - Create a shell script:

     ~~~
     cat ~/bin/phantomjs
     #!/bin/sh
     export OPENSSL_CONF=/etc/ssl
     /path/to/phantomjs-2.1.1-linux-x86_64/bin/phantomjs "$@"
     ~~~

   - Make sure the script doesn't spit errors:

     ~~~
     $ phantomjs --version
     2.1.1
     ~~~

2. Clone the repo, run `npm i` to fetch the deps. Afterwards,
   *mathjax-embed* doesn't require node to run.

3. Symlink `wrapper.sh` as `mathjax-embed` somewhere in PATH & check
   it:

   ~~~
   $ mathjax-embed -V
   mathjax-embed/1.0.0 (linux; 64bit) phantomjs/2.1.1
   ~~~

## Usage

Convert an html chunk to a standalone html file:

    echo '<p>Function $y = \sin(x)$.</p>' | mathjax-embed > 1.html

A markdown file with TeX formulas:

    $ pandoc -s test/data/example02.md -t html --mathjax | mathjax-embed > 2.html

In the default pandoc (3.8.1) configuration, the math delimiters are
`$$...$$` for displayed mathematics, and `$...$` for in-line. To use
`\\[...\\]` and `\\(...\\)` instead, give `-f
markdown-tex_math_dollars+tex_math_double_backslash` option to pandoc.

The default mathjax config (use `-c` CLO to provide your own):

~~~
window.MathJax = {
	showMathMenu: false,
	extensions: ["tex2jax.js"],
	tex2jax: { inlineMath: [["$","$"], ["\\(","\\)"]] },
	jax: ["input/TeX", "output/SVG"]
}
~~~

## Bugs

* Depends on abandoned phantomjs.
* Uses an ancient (2016-02-08) MathJax version.
* Tested only on Fedora 42.

## License

MIT.
