html		:= $(patsubst %.md, %.html, $(wildcard test/data/*.md))
mathjax.html	:= $(patsubst %.html, %.mathjax.html, $(html))

%.html: %.md		; pandoc -s $< -o $@ --mathjax
%.mathjax.html: %.html	; ./mathjax-embed.js $< > $@

all: $(html) $(mathjax.html)
clean:; rm $(mathjax.html) $(html)

.PHONY: test
test: all; mocha -u tdd test/test_*.js $(o)

upload:
	rsync -Pa test/data/example01.md test/data/example01.mathjax.html alex@sigwait.org:/home/alex/public_html/demo/misc/mathjax-embed/ $(o)
