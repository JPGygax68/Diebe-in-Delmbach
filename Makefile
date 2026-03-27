# Default target
all: dist/sheet1.pdf

# Step 1: Convert SCSS → CSS
dist/style.css:  templates/style.scss
	sass templates/style.scss dist/style.css

dist/sheet1.html: build.mjs data/sheet1.json
	node build.mjs sheet1

# Convert static HTML → PDF
dist/sheet1.pdf: dist/sheet1.html dist/style.css images/*
	weasyprint dist/sheet1.html dist/sheet1.pdf

# Clean
clean:
	rm -f dist/*


