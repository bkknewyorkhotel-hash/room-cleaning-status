const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Minimal 1x1 PNG pixel expanded or pure PNG header builder
// We can construct a valid minimal PNG file or SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="100" fill="#0F172A"/>
  <circle cx="256" cy="256" r="180" fill="#16A34A" fill-opacity="0.2" stroke="#22C55E" stroke-width="24"/>
  <path d="M160 260L220 320L352 188" stroke="#22C55E" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent, 'utf8');
console.log('SVG icon generated successfully!');
