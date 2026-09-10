# MATERIAL_V1 update

This package changes only the Three.js rendering/material layer.

Changed/added files:
- `dist/materials.js` — procedural PBR approximation of the selected wallpaper/floor/film
- `dist/shared-3d.js` — applies selected materials + improved neutral lighting/tone mapping
- `dist/svg-expansion.html` — shows selected finish information
- `dist/MATERIAL_V1.json` — selected product metadata and rendering parameters

Geometry JSON files were not modified.

Selected finishes:
- LX Z:IN Diamant 회벽/블랑 그레이 PR002-13
- Dongwha Natus Jin Grande Emotion Blanc
- Younglim Luca White PX454-2

Notes:
- General-room floors use Emotion Blanc approximation.
- Bathrooms, entrance and retained balcony keep neutral placeholder flooring for now.
- Door leaves use Luca White approximation; cabinetry/trim can be assigned later when those meshes exist.
- Wallpaper uses a matte, no-pearl, low-contrast plaster texture approximation.
