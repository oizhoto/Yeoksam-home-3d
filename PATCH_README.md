# Expansion renderer cleanup patch

- BASE_GEOMETRY_V1.json: not modified.
- INTERIOR_V2_SVG_EXPANSION.json: copied unchanged from the user-confirmed Astra expansion package.
- UI: removed the unfinished wallpaper/floor stage for now.
- Expansion/Furniture/Final stages now render INTERIOR_V2_SVG_EXPANSION directly.
- Because removed balcony boundary walls are absent from this geometry's `walls` array, Three.js does not create meshes/colliders for them.
- Furniture stage is kept as the next working stage; no furniture has been added in this patch.
- WASD/pointer-lock behavior is intentionally not changed in this patch.
