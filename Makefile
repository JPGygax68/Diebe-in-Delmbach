DELMBACH := $(basename $(notdir $(wildcard data/delmbach/*.json)))
HTMLS := $(patsubst %,dist/%.html,$(DELMBACH))
PDFS := $(patsubst %,dist/%.pdf,$(DELMBACH))

# Keep intermediate HTML files
.SECONDARY: $(HTMLS)

# Default target
all: $(PDFS) dist

# Ensure output directory exists
dist:
	mkdir -p dist

# Step 1: Convert SCSS → CSS
dist/style.css: templates/style.scss | dist
	sass templates/style.scss dist/style.css

# Convert each JSON dataset into HTML using the shared template
dist/%.html: data/delmbach/%.json data/delmbach/text/*.md build_html.mjs templates/cards_3x3_a4.njk 
	node build_html.mjs cards_3x3_a4 delmbach $*

# Argentinian football team

# Convert static HTML → PDF	
dist/%.pdf: dist/%.html dist/style.css data/*
	weasyprint $< $@

clean:
	rm -rf dist