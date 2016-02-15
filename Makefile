%.html: %.md
	pandoc -s -f markdown-tex_math_dollars+tex_math_double_backslash -t html5 $< -o $@

test.html := $(patsubst %.md, %.html, $(wildcard test/data/*.md))

.PHONY: test-compile
test-compile: $(test.html)
