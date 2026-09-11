import fs from 'node:fs';
const shared=fs.readFileSync('dist/shared-3d.js','utf8');
const index=fs.readFileSync('dist/index.html','utf8');
const interior=fs.readFileSync('dist/interior.js','utf8');
const state=fs.readFileSync('PROJECT_STATE.md','utf8');
const required=[
 ["shared version",shared.includes("APP_VERSION='V8.26'")],
 ["1600 eye",shared.includes("const WALK_EYE_MM=1600")],
 ["mobile joystick",shared.includes("data-walkthrough-ui")||shared.includes("walkthroughUi")],
 ["touch look",shared.includes("lookPointer")],
 ["WASD",shared.includes("['KeyW','KeyA','KeyS','KeyD']")],
 ["collision",shared.includes("blocked(config,compiled")],
 ["inspect speed",shared.includes("walkSpeedMode==='inspect'?.35:1")],
 ["screen version",index.includes("V8.26")],
 ["interior version",interior.includes("PROJECT_VERSION='V8.26'")],
 ["state version",state.includes("V8.26 — MOBILE WALKTHROUGH / FIRST-PERSON REVIEW")]
];
const bad=required.filter(x=>!x[1]).map(x=>x[0]);
if(bad.length){console.error("FAIL:",bad.join(", "));process.exit(1);}
console.log("PASS V8.26 walkthrough checks");
