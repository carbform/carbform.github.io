#!/bin/bash

# Get the image file to resize
image_file=$(zenity --file-selection --title="Select Image File")

# Check if the image file is selected
if [ -z "$image_file" ]; then
  exit 1
fi

# Get the required image width and height
width=$(zenity --entry --title="Enter Required Image Width")
height=$(zenity --entry --title="Enter Required Image Height")

# Check if the width and height are provided
if [ -z "$width" ] || [ -z "$height" ]; then
  exit 1
fi

# Resize the image
convert "$image_file" -resize "$width"x"$height" -aspect ratio "$image_file.resized"

# Display a message to the user
zenity --info --title="Image Resized" --text="The image has been resized successfully."
