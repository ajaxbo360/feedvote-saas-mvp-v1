#!/bin/bash

# Build the widget
npm run build:widget

# Create widget directory in public if it doesn't exist
mkdir -p public/widget

# Copy the built widget to public directory
cp dist/widget/feedvote.js public/widget/

echo "Widget built and copied to public/widget/" 