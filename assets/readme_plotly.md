# Embedding Plotly Figures on `carbform.github.io`

This note is for coding agents that need to wire the drought Plotly figures into any page in the website project (`/home/carbform/carbform.github.io`).

## Files

- Interactive HTML exports live in this folder (`./assets`).
- Current filenames:
  - `Fig1_eof.html`
  - `Fig2_aismr_bundelkhand_bars.html`
  - `Fig3_composites.html`
  - `Fig4a_type1_cum.html`
  - `Fig4b_type2_cum.html`
  - `Fig5a_type1_20day.html`
  - `Fig5b_type2_20day.html`

## How to Embed in a Page

1. Open the target HTML page inside `/home/carbform/carbform.github.io` (for layout reference, study `droughts.html`).
2. Within the `<body>` content, wrap the iframe in a container that matches the site style:

   ```html
   <div class="plot-container">
     <div style="width: 100%; max-width: 1200px; margin: 0 auto;">
       <iframe src="./assets/Fig1_eof.html"
               width="1200"
               height="760"
               frameborder="0"
               sandbox="allow-scripts allow-same-origin"
               scrolling="no"
               style="max-width: 100%; border: 0;"></iframe>
     </div>
     <p class="para" style="font-size: smaller;">Caption text here.</p>
   </div>
   ```

   - Use `./assets/<filename>` for the iframe `src`.
   - Keep the `sandbox` attribute to restrict embedded scripts (matches `droughts.html`).
   - Adjust `width`/`height` as needed; `1200x760` fits the existing design.

3. If multiple plots are needed side by side, follow the flexbox pattern used for the paired iframes near lines 136–141 of `droughts.html`. Example:

   ```html
   <div class="plot-container">
     <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
       <iframe src="./assets/Fig2_aismr_bundelkhand_bars.html" width="900" height="420" frameborder="0" scrolling="no" style="max-width: 100%;"></iframe>
       <iframe src="./assets/Fig3_composites.html" width="900" height="420" frameborder="0" scrolling="no" style="max-width: 100%;"></iframe>
     </div>
   </div>
   ```

4. After editing, run the website’s `push_to_github.sh` (if requested) from the repo root to deploy.

## Notes

- The Plotly HTML files are self-contained and load Plotly from a CDN; no additional assets are required.
- If a new Plotly export is generated, overwrite the file in this folder and update any captions accordingly.
- Maintain consistent typography (`plot-container`, `para`, etc.) to preserve styling across pages.

