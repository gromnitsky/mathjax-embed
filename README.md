A quick hack to "embed" MathJax into an html file as SVGs. Actually,
it doesn't embed anything, but renders the page in *jsdom* & prints
the result to stdout. The resulting file **doesn't require
JavaScript** to render itself.

~~~
$ npm i -g mathjax-embed
$ mathjax-embed -V
mathjax-embed/2.0.3 (Linux x86_64) mathjax/4.0.0 domjs/27.0.0 nodejs/v24.10.0
~~~

## Usage

Convert an html chunk to a standalone html file:

    echo '<p>Function $y = \sin(x)$.</p>' | mathjax-embed > 1.html

A markdown file with TeX formulas:

    $ pandoc -s test/data/example02.md -t html --mathjax | mathjax-embed > 2.html

In the default pandoc (3.8.1) configuration, the math delimiters are
`$$...$$` for displayed mathematics, and `$...$` for in-line.

Run `mathjax-embed --config-print` to print the default mathjax
configuration. Use `-c file.json` option to provide your own.

## Bugs

* Tested only on Fedora 42.

## License

MIT.
