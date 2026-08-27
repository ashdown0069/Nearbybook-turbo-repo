export const LOCATION_BTN_HTML = `
<button type="button" aria-label="현재 위치로 이동" style="z-index: 1000; display: inline-flex; cursor: pointer; align-items: center; justify-content: center; width: 50px; height: 50px; padding: 0; box-sizing: border-box; overflow: visible; flex-shrink: 0; background-color: oklch(72.3% 0.219 149.579); border-radius: 50%; margin: 0 16px 40px 0; border: none; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); touch-action: manipulation; -webkit-tap-highlight-color: transparent;">
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block; pointer-events: none; flex-shrink: 0;">
    <line x1="2" x2="5" y1="12" y2="12"/>
    <line x1="19" x2="22" y1="12" y2="12"/>
    <line x1="12" x2="12" y1="2" y2="5"/>
    <line x1="12" x2="12" y1="19" y2="22"/>
    <circle cx="12" cy="12" r="7"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
</button>`

export const INDIGO_MARKER_HTML = `
<svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 52C22 52 42 34 42 22C42 10.9543 33.0457 2 22 2C10.9543 2 2 10.9543 2 22C2 34 22 52 22 52Z" fill="#6366F1"/>
  <g transform="translate(10, 10)">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="m9 9.5 2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`

export const GRAY_MARKER_HTML = `
<svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 52C22 52 42 34 42 22C42 10.9543 33.0457 2 22 2C10.9543 2 2 10.9543 2 22C2 34 22 52 22 52Z" fill="#6B7280"/>
  <g transform="translate(10, 10)">
    <path d="m14.5 7-5 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="m9.5 7 5 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`

export const LIBRARY_MARKER_HTML = `
<svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 52C22 52 42 34 42 22C42 10.9543 33.0457 2 22 2C10.9543 2 2 10.9543 2 22C2 34 22 52 22 52Z" fill="oklch(72.3% 0.219 149.579)"/>
  <g transform="translate(10, 10)">
    <path d="m16 6 4 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 6v14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 8v12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 4v16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`

export const MY_LOCATION_MARKER_HTML = `
<div class="relative flex h-6 w-6 items-center justify-center pointer-events-none">
  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60"></span>
  <span class="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-blue-600 shadow-sm"></span>
</div>
`
