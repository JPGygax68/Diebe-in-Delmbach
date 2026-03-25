# Files
SRC = cards_3x3_a4.html
STATIC = output-static.html
PDF = cards_final.pdf

# Default target
all: $(PDF)

# Step 1: Expand Web Components → static HTML
$(STATIC): $(SRC) render.mjs
	node render.js $(SRC) $(STATIC)

# Step 2: Convert static HTML → PDF
$(PDF): $(STATIC)
	weasyprint $(STATIC) $(PDF)

# Clean
clean:
	rm -f $(STATIC) $(PDF)


