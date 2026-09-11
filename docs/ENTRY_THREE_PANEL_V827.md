# V8.27 — Entry 3-panel linked sliding door

- Base: GitHub main V8.26.
- Entry middle-door locked envelope remains exactly `center [6500,0,5320]`, `size [50,2200,1000]`.
- The single visual screen-door object is split into three adjacent screen-door panel objects inside the same envelope.
- This makes the existing 2D and 3D renderers show three distinct slim-frame translucent panels without changing `shared-3d.js` or any baseline geometry.
- Panel depths: 333.333 / 333.334 / 333.333 mm; combined total = 1000 mm.
- No wall, room, expansion, door calibration, WashTower turning door, material, bathroom, kitchen, lighting, or walkthrough code changed.
