# Furniture persistence/export V4 patch

Scope is intentionally limited to furniture layout persistence and export UI.

- Does not modify apartment geometry, expansion geometry, walls, doors, windows, camera presets, materials, furniture definitions, or arrow/rotation behavior.
- Auto-saves furniture position/rotation to localStorage after move/rotate.
- Restores saved position/rotation by furniture ID while preserving newly added furniture from source defaults.
- Reset is the only UI action that removes the saved furniture layout, and asks for confirmation.
- Adds mobile-friendly “가구 좌표 내보내기” dialog and “JSON 복사”.
- Export includes IDs, names/types, width/depth/height, x/y/z, rotationDeg, internal rotationY, and raw source arrays.
