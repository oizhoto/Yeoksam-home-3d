# V8.26 Mobile Walkthrough

## Goal
Make the existing first-person walkthrough usable on phone, tablet and desktop without changing the apartment model.

## Interaction model
- Mobile / tablet:
  - left virtual joystick: forward / back / strafe
  - drag on right side of 3D viewport: look left/right/up/down
  - both pointers may be active at the same time
- Desktop:
  - WASD movement
  - mouse drag for look
  - click canvas for Pointer Lock when supported
- Eye height: 1600 mm
- Walkthrough FOV: 78 degrees
- Camera Y is re-applied every walk frame to avoid vertical drift.
- Collision: existing `blocked(config, compiled, point)` is retained.

## Review conveniences
- Walk: normal movement speed
- Inspect: 35% speed for cabinetry/bathroom detail checking
- Presets: 현관 / 거실 / 주방 / 안방
- Fullscreen button
- Full wall height and ceiling are forced in walkthrough.

## Protected scope
This patch does not include or modify:
- BASE_GEOMETRY_V1.json
- INTERIOR_V2_SVG_EXPANSION.json
- apartment.config.json
- FIXED_INTERIOR_V1.json
- BATHROOM_KITCHEN_V1.json
- bathroom-kitchen-layer.js
- DESIGN_V1.json
- materials.js

Therefore V8.25 built-ins/bathroom work and V7.5 locked geometry stay outside the walkthrough patch.
