import fs from 'node:fs';
import {mirrorConfig,validate} from '../dist/plan-core.js';
const file='dist/apartment.config.json',before=JSON.parse(fs.readFileSync(file));
if(before.geometryRevision==='BASE_GEOMETRY_V1')throw Error('Baseline already created; do not overwrite.');
fs.writeFileSync('archive/pre-calibration-shared-v3.json',JSON.stringify(before,null,2));
const c=mirrorConfig(before),changes=[];
const remap=z=>z===4800?4820:z===9550?9555:z;
for(const w of c.walls){w.a[1]=remap(w.a[1]);w.b[1]=remap(w.b[1]);}
for(const r of [...c.rooms,...c.floorPolygons,...c.balconies]){
 if(r.polygon)r.polygon.forEach(p=>p[1]=remap(p[1]));
 if(r.rect){r.rect[1]=remap(r.rect[1]);r.rect[3]=remap(r.rect[3]);}
 if(r.local)r.local.origin[1]=remap(r.local.origin[1]);
}
changes.push({id:'left-dimension-chain',status:'PRINTED_DERIVED',before:[4800,9550],after:[4820,9555],basis:'1785 + 3035 = 4820; 4820 + 4735 = 9555. Printed dimensions take priority over pixel residuals.'});
function editWall(id,fn,basis){const w=c.walls.find(w=>w.id===id),old=structuredClone(w);fn(w);changes.push({id,before:old,after:structuredClone(w),status:'ASSUMED',basis});}
editWall('north-bed3',w=>{w.a[1]=300;w.b[1]=300;},'Visible top balcony boundary near source y=73 px; (73-65)*38.1≈305 mm. No new opening inferred.');
editWall('west',w=>{w.a[1]=300;const o=w.openings.find(o=>o.id==='entry');o.start=4950;o.width=1000;},'Keep door top z=5250; visible source doorway y≈203–229 px, width≈991mm rounded to1000. North wall endpoint follows visible boundary.');
for(const list of [c.rooms,c.floorPolygons,c.balconies])for(const r of list){if((r.roomId??r.id)==='bal3'){r.polygon.forEach(p=>{if(p[1]===500)p[1]=300;});if(r.rect&&r.rect[1]===500)r.rect[1]=300;if(r.local&&r.local.origin[1]===500)r.local.origin[1]=300;}}
function editOpening(id,start,width,pixels,basis){let w=c.walls.find(w=>w.openings.some(o=>o.id===id));let o=w.openings.find(o=>o.id===id);changes.push({id,status:'ASSUMED',before:{start:o.start,width:o.width},after:{start,width},sourcePixelRange:pixels,basis});Object.assign(o,{start,width,sourcePixelRange:pixels});}
editOpening('door-bath2',2820,650,[[338,241],[355,241]],'Visible quarter-circle at x338–355, hinge at x338; previous opening followed adjacent white fixture instead. Position and hinge corrected together; exact mm remains ASSUMED.');
{const o=c.walls.find(w=>w.id==='bed1-north').openings.find(o=>o.id==='door-bath2');o.hinge='start';o.swing=-90;}
editOpening('glaze-bed1',500,2440,[[277,328],[341,328]],'Visible glazing between solid wall returns; old opening overlapped solid end walls. X starts at 4150+500 mm; pixel-derived width rounded to10mm. Printed wall location z=9955 retained.');
editOpening('w-kitchen-out',1350,1750,[[244,65],[290,65]],'Top glazing break visible in the source. Pixel-derived horizontal range; not a new opening.');
editOpening('w-bed1-out',4300,2900,[[268,358],[344,358]],'Existing lower outer glazing fitted between visible posts. Straight reference retained; no new curved contour.');
for(const w of c.walls){w.positionStatus=w.evidence==='dimension-constrained'?'PRINTED_CONSTRAINED':'ASSUMED';w.thicknessStatus='ASSUMED';if(['north-bed3','west'].includes(w.id))w.positionStatus='ASSUMED';for(const o of w.openings){o.status='ASSUMED';o.evidence='image-estimated';o.note+=' / ASSUMED: mm 폭·이격거리 미표기, 원본 이미지 기호 기준.';}}
for(const r of [...c.rooms,...c.floorPolygons,...c.balconies])r.status='ASSUMED';
c.geometryRevision='BASE_GEOMETRY_V1';c.baseGeometryId='BASE_GEOMETRY_V1';c.name='역삼푸르지오 24평 · 2호 라인 · BASE_GEOMETRY_V1';c.geometryStatus='calibrated-to-source-not-surveyed';
c.sourceDimensions.leftSegments=[1785,3035,4735,1650];
c.dimensionEvidence.push({id:'D05',kind:'printed-chain',value:[1785,3035,4735,1650],formula:'1785 + 3035 = 4820; + 4735 = 9555; + 1650 = 11205',meaning:'왼쪽 세로 치수 체인',status:'원본 표기 / 실측 아님'});
c.calibration={baselineId:'BASE_GEOMETRY_V1',date:'2026-09-07',method:'Visual comparison against reflected original; printed dimensions preserved; existing openings adjusted only.',sourceImage:'floorplan.png',sourcePixelOriginLine1:[155,65],mmPerPixel:38.1,rotation:0,pixelReadingUncertainty:2,approximateMmReadingUncertainty:76.2,changes,unresolved:['Wall dimension reference face/center is not specified.','Wall thickness, all opening widths/offsets and glazing type/height remain ASSUMED.','Lower curved balcony outline and unclear upper boundary remain unresolved; no new spaces/openings added.','Printed-constrained lines may differ from image by a few pixels; no nonuniform image distortion applied.'],futurePolicy:'Keep BASE_GEOMETRY_V1.json immutable. Derive interior working copies with baseGeometryId; do not overwrite the baseline.'};
const final=mirrorConfig(c);validate(final);fs.writeFileSync(file,JSON.stringify(final,null,2));fs.writeFileSync('dist/BASE_GEOMETRY_V1.json',JSON.stringify(final,null,2));fs.writeFileSync('dist/calibration-report.json',JSON.stringify(final.calibration,null,2));
