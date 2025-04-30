document.addEventListener('DOMContentLoaded', () => {
  const thumbnails = document.querySelectorAll('.photo-thumbnail');
  const gameTargetDuration = 1000; // Target visible for 1 second

  thumbnails.forEach(thumbnail => {
    const target = thumbnail.querySelector('.game-target');
    const img = thumbnail.querySelector('img');
    let gameTimer = null;

    // Function to show the target
    const showTarget = () => {
      if (thumbnail.classList.contains('unlocked')) return; // Don't show if already won

      const thumbRect = thumbnail.getBoundingClientRect();
      const targetSize = 30;
      // Calculate random position within the thumbnail bounds
      const maxX = thumbRect.width - targetSize;
      const maxY = thumbRect.height - targetSize;
      const randomX = Math.random() * maxX;
      const randomY = Math.random() * maxY;

      target.style.left = `${randomX}px`;
      target.style.top = `${randomY}px`;
      target.style.display = 'block';

      // Set timer to hide the target
      clearTimeout(gameTimer); // Clear previous timer if any
      gameTimer = setTimeout(() => {
        target.style.display = 'none';
      }, gameTargetDuration);
    };

    // Function to handle winning the game
    const winGame = () => {
      clearTimeout(gameTimer);
      target.style.display = 'none';
      img.classList.add('visible');
      thumbnail.classList.add('unlocked');
      // Ensure parent resizes correctly
      thumbnail.style.minHeight = 'auto';
      // Remove event listeners for this specific target after winning
      target.removeEventListener('click', winGame);
      thumbnail.removeEventListener('mouseenter', showTarget);
      thumbnail.removeEventListener('mouseleave', hideTarget);
    };

     // Function to hide target immediately (e.g., on mouseleave)
     const hideTarget = () => {
         clearTimeout(gameTimer);
         if (!thumbnail.classList.contains('unlocked')) {
             target.style.display = 'none';
         }
     };

    // Add event listeners
    thumbnail.addEventListener('mouseenter', showTarget);
    thumbnail.addEventListener('mouseleave', hideTarget);
    target.addEventListener('click', winGame);

    // Initial setup for min-height (important for layout before interaction)
    if (img) {
        const tempImg = new Image();
        tempImg.onload = () => {
            const aspectRatio = tempImg.naturalHeight / tempImg.naturalWidth;
            const currentWidth = thumbnail.offsetWidth;
            // Set min-height only if not already unlocked (e.g. on page load)
            if (!thumbnail.classList.contains('unlocked')) {
                thumbnail.style.minHeight = aspectRatio ? `${currentWidth * aspectRatio}px` : '150px';
            }
        }
        tempImg.onerror = () => {
             if (!thumbnail.classList.contains('unlocked')) {
                 thumbnail.style.minHeight = '150px'; // Default on error
             }
        }
        tempImg.src = img.src;
    } else {
         if (!thumbnail.classList.contains('unlocked')) {
            thumbnail.style.minHeight = '150px';
         }
    }
  });

  // Adjust min-height on resize for thumbnails that are still locked
  window.addEventListener('resize', () => {
      thumbnails.forEach(thumbnail => {
          if (!thumbnail.classList.contains('unlocked')) {
              const img = thumbnail.querySelector('img');
              if (img && img.naturalWidth) { // Check if image properties are available
                   const aspectRatio = img.naturalHeight / img.naturalWidth;
                   const currentWidth = thumbnail.offsetWidth;
                   thumbnail.style.minHeight = aspectRatio ? `${currentWidth * aspectRatio}px` : '150px';
              } else {
                   thumbnail.style.minHeight = '150px'; // Fallback
              }
          } else {
              thumbnail.style.minHeight = 'auto'; // Ensure unlocked ones fit content
          }
      });
  });

});