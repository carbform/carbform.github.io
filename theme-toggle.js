/* Tile Layer URLs defined inline in HTML files where map is used 
// Define Tile Layer URLs globally (or ensure they are accessible)
const lightTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const lightAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const darkAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
*/

function toggleTheme() {
  const body = document.body;
  const htmlElement = document.documentElement; // Target <html> element as well
  const wasDark = htmlElement.classList.contains('dark-theme'); // Check <html>
  
  // Toggle on both body and html
  body.classList.toggle('dark-theme');
  htmlElement.classList.toggle('dark-theme');

  const isDark = htmlElement.classList.contains('dark-theme'); // Read final state from <html>

  // Save the current theme to local storage
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  // Update map tiles if the map exists on the page
  if (typeof map !== 'undefined' && map && typeof tileLayer !== 'undefined' && tileLayer) {
    const newUrl = isDark ? darkTileUrl : lightTileUrl;
    const newAttribution = isDark ? darkAttribution : lightAttribution;
    tileLayer.setUrl(newUrl);
    // Update attribution control if necessary
    map.attributionControl.setPrefix(false).addAttribution(newAttribution);
  }
}

// Apply the saved theme on page load listener REMOVED
// This logic is now handled by an inline script in the <head> of HTML pages. 