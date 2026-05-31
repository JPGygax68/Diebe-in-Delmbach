DATA_BASES := $(basename $(notdir $(wildcard data/*.json)))
HTMLS := $(patsubst %,dist/%.html,$(DATA_BASES))
PDFS := $(patsubst %,dist/%.pdf,$(DATA_BASES))

# Keep intermediate HTML files
.SECONDARY: $(HTMLS)

# Default target
all: $(PDFS)

# Ensure output directory exists
dist:
	mkdir -p dist

# Step 1: Convert SCSS → CSS
dist/style.css: templates/style.scss | dist
	sass templates/style.scss dist/style.css

# Convert each JSON dataset into HTML using the shared template
dist/%.html: data/%.json data/text/%/*.md build_html.mjs templates/cards_3x3_a4.njk 
	node build_html.mjs cards_3x3_a4 $*

# Convert static HTML → PDF	
dist/%.pdf: dist/%.html dist/style.css data/images/*
	weasyprint $< $@

clean:
	rm -rf dist