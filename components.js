/**
 * Shared Components - Navbar & Footer
 * Injects consistent navbar and footer across all pages.
 * Single source of truth — edit here, updates everywhere.
 */

function getNavbarHTML() {
  return `
    <nav class="navbar navbar-fixed-top navbar-default">
      <div class="container">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
          data-target="#navbar-collapse" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbar-collapse">
          <ul class="nav navbar-nav">
            <li><a href="./index.html">Home</a></li>
            <li><a href="./about.html">About</a></li>
            <li><a href="./droughts.html">Research</a></li>
            <li><a href="./works.html">Projects</a></li>
            <li><a href="./downloads.html">Resources</a></li>
            <li><a href="./music.html">The SkyVerse Music</a></li>
            <li><a href="https://carbform.medium.com/" title="">Blog</a></li>
            <li class="photo-link-easter-egg"><a href="./photos.html"><i class="fa-solid"></i></a></li>
            <li>
              <a href="contact.html" class="btn badge btn-default nav-contact-btn">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `;
}

function getThemeToggleHTML() {
  return `
    <div class="theme-toggle-container">
      <button class="theme-toggle-btn" onclick="toggleTheme()">
        <div class="toggle-switch">
          <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <div class="toggle-slider"></div>
          <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 A7 7 0 0 0 21 12.79z"></path>
          </svg>
        </div>
      </button>
    </div>
  `;
}

function getFooterHTML(customText) {
  const text = customText || '© SARAT CHANDRA, 2025 | ALL IMAGES ARE IP';
  return `
    <footer class="footer-container text-center">
      <div class="container">
        <div class="row">
          <div class="col-xs-12">
            <p style="font-family: var(--font-mono); font-size: 14px; font-weight: 600; text-transform: uppercase;">${text}</p>
          </div>
        </div>
      </div>
    </footer>
  `;
}

/**
 * Initialize shared components.
 * Call this on DOMContentLoaded, or place the script at the end of <body>.
 *
 * Usage: Pages with <header id="shared-header"></header> and
 *        <div id="shared-footer"></div> will be auto-populated.
 *        Theme toggle with <div id="shared-theme-toggle"></div>.
 */
function initSharedComponents() {
  const headerEl = document.getElementById('shared-header');
  if (headerEl) {
    headerEl.innerHTML = getNavbarHTML();
  }

  const toggleEl = document.getElementById('shared-theme-toggle');
  if (toggleEl) {
    toggleEl.innerHTML = getThemeToggleHTML();
  }

  const footerEl = document.getElementById('shared-footer');
  if (footerEl) {
    const customText = footerEl.getAttribute('data-text');
    footerEl.innerHTML = getFooterHTML(customText);
  }
}

function initTypingEffect() {
  const titles = document.querySelectorAll('.retro-cursor, h1[style*="font-family: dotfont"], h1[style*="font-family: Lettera"]');
  titles.forEach(title => {
    // Only apply if we haven't already applied the typing effect
    if (!title.hasAttribute('data-typed')) {
      const text = title.textContent.trim();
      
      // Skip if empty or contains child elements (except our own typed text)
      if (!text || title.querySelector('*')) return;
      
      title.setAttribute('data-typed', 'true');
      title.textContent = ''; // clear text
      
      let i = 0;
      function typeChar() {
        if (i < text.length) {
          title.textContent += text.charAt(i);
          i++;
          // Slower typing speed to match Typed.js (approx 70-150ms per char)
          setTimeout(typeChar, Math.random() * 80 + 70);
        }
      }
      
      // Start typing after a short delay
      setTimeout(typeChar, 500);
    }
  });
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initSharedComponents();
    initTypingEffect();
  });
} else {
  initSharedComponents();
  initTypingEffect();
}
