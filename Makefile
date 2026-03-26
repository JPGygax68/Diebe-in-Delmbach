# Files
SRC = cards_3x3_a4.html style.scss
STATIC = cards-static.html style.css
PDF = cards_final.pdf

# Default target
all: $(PDF)

# Step 1: Convert SCSS → CSS
style.css:  style.scss
	sass style.scss style.css

# Step 2: Expand Web Components → static HTML
cards-static.html: cards_3x3_a4.html style.css render.mjs
	node render.mjs cards_3x3_a4.html cards-static.html

# Step 3: Convert static HTML → PDF
$(PDF): cards-static.html
	weasyprint cards-static.html cards_final.pdf

# Clean
clean:
	rm -f $(STATIC) $(PDF)


