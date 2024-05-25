#!/bin/bash

# Define the variables
LOCAL_REPO_DIR="/home/carbform/carbform.github.io"  # Path to your local clone of the GitHub repository
IMAGE_DIR="assets/images/noaa_temp/images"
TARGET_DIR="assets/images/noaa"  # Adjust as needed
MIN_FILESIZE_KB=1000  # Minimum file size in kilobytes
URL_FILE="image_urls.txt"

# Change directory to the local repository
cd "$LOCAL_REPO_DIR" || exit

# Pull any changes from the remote repository (if needed)
# git pull origin "$BRANCH"

# Remove existing files in the target directory
rm -rf "$TARGET_DIR"/*

# Copy files based on size directly to the target directory
for image_file in "$IMAGE_DIR"/*; do
  if [ -f "$image_file" ]; then  # Check if it's a regular file (not a subfolder)
    file_size_kb=$(du -k "$image_file" | cut -f1)
    if [ "$file_size_kb" -ge "$MIN_FILESIZE_KB" ]; then
      cp -n "$image_file" "$TARGET_DIR"
    fi
  fi
done

# Remove existing URL files (if needed)
rm -f "$URL_FILE"

# Generate a list of image URLs
find "$TARGET_DIR" -type f -exec echo "https://carbform.github.io/{}" \; > "$URL_FILE"

# Uncomment 
rm -rf "$IMAGE_DIR"/*

git add "$TARGET_DIR" "$URL_FILE" "$HTML_FILE"
git commit -m "Add new images from /srv/images and update HTML"
git push origin "$BRANCH"

echo "Images copied successfully to GitHub!"
