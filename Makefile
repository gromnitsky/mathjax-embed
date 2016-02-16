.DELETE_ON_ERROR:

pp-%:
	@echo "$(strip $($*))" | tr ' ' \\n

%.html: %.md
	pandoc -s -f markdown-tex_math_dollars+tex_math_double_backslash -t html5 $< -o $@

%.mathjax.html: %.html
	./mathjax-embed $< > $@

test.html := $(patsubst %.md, %.html, $(wildcard test/data/*.md))
test.mathjax.html := $(patsubst %.html, %.mathjax.html, $(test.html))

.PHONY: test
test: $(test.html) $(test.mathjax.html)
	node_modules/.bin/mocha -u tdd test/test_*.js $(TEST_OPT)

.PHONY: clean
clean:
	rm $(test.mathjax.html) $(test.html)
