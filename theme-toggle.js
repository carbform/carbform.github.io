/* Tile Layer URLs defined inline in HTML files where map is used 
// Define Tile Layer URLs globally (or ensure they are accessible)
const lightTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const lightAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const darkAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
*/

function updateIcon(isDark) {
    const sunIcon = document.querySelector('.theme-toggle-btn .sun-icon');
    const moonIcon = document.querySelector('.theme-toggle-btn .moon-icon');
    
    if (sunIcon && moonIcon) {
        if (isDark) {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Update Leaflet Tile Layer if a map and tileLayer exist
    // Assumes tileLayer is a global variable and map instance can be found
    if (typeof tileLayer !== 'undefined' && tileLayer && typeof L !== 'undefined') {
        const newUrl = isDark ? darkTileUrl : lightTileUrl;
        const newAttribution = isDark ? darkAttribution : lightAttribution;
        tileLayer.setUrl(newUrl);
        
        // Update attribution control if it exists
        const mapElement = document.querySelector('.folium-map');
        // Access the map instance stored by Folium (usually on the div element)
        const mapInstance = mapElement ? mapElement._leaflet_map : null; 

        if (mapInstance && mapInstance.attributionControl) {
             // Remove the old attribution text
             // This is tricky, Leaflet doesn't have a direct way to remove *only* the tile layer attribution
             // We'll remove all attributions and re-add the current one. This might remove other attributions if present.
             mapInstance.attributionControl.setPrefix(false); // Clear potential prefix
             // Find existing attributions, remove them
             const attributionContainer = mapInstance.attributionControl._container;
             if (attributionContainer) {
                 attributionContainer.innerHTML = ''; // Clear existing
             }
             mapInstance.attributionControl.addAttribution(newAttribution); // Add the new one
        } else {
             console.warn("Could not find map instance or attribution control to update attribution.");
        }
    }

    // CSS handles icon switching now, no JS needed for that part
}

// Apply the saved theme on page load listener
// This logic is now handled by an inline script in the <head> of HTML pages.
// Re-adding listener for robustness across all pages, including those potentially without the inline script.
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const htmlElement = document.documentElement;
    const body = document.body;
    let isDark = false; // Default to light

    // Check system preference if no theme is saved
    if (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        isDark = true;
    } else if (savedTheme === 'dark') {
        isDark = true;
    }

    if (isDark) {
        htmlElement.classList.add('dark-theme');
        body.classList.add('dark-theme');
    } else {
        htmlElement.classList.remove('dark-theme');
        body.classList.remove('dark-theme');
    }
    // Update icon based on the determined theme
    updateIcon(isDark); 
});

// Add listener for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const isSystemDark = event.matches;
    // Only change if no theme is explicitly saved by the user
    if (!localStorage.getItem('theme')) {
        const htmlElement = document.documentElement;
        const body = document.body;
        if (isSystemDark) {
            htmlElement.classList.add('dark-theme');
            body.classList.add('dark-theme');
        } else {
            htmlElement.classList.remove('dark-theme');
            body.classList.remove('dark-theme');
        }
        updateIcon(isSystemDark);
    }
});