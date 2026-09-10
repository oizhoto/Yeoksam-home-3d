import fs from 'node:fs';import {mirrorConfig} from './dist/plan-core.js';
const p='dist/apartment.config.json',line1=mirrorConfig(JSON.parse(fs.readFileSync(p)));
const rect=(a,b,c,d)=>[[a,b],[c,b],[c,d],[a,d]];
const polygons={bed3:rect(0,1785,2650,4800),kitchen:rect(2650,1785,5250,5300),bed2:rect(5250,1325,7950,3630),bath1:rect(5250,3630,7950,5290),bath2:rect(5250,5290,7950,6720),bed1:rect(4150,6720,7950,9955),entry:rect(0,4800,1450,6400),living:[[1450,4800],[2650,4800],[2650,5300],[5250,5300],[5250,6720],[4150,6720],[4150,9550],[0,9550],[0,6400],[1450,6400]],bal3:rect(0,500,2050,1785),bal2:[[2050,0],[7250,0],[7250,275],[7950,275],[7950,1325],[5250,1325],[5250,1785],[3400,1785],[3400,1250],[2050,1250]],bal1:[[0,9550],[4150,9550],[4150,9955],[7950,9955],[7950,11205],[0,11205]]};
for(const r of line1.rooms){r.polygon=polygons[r.id];const b=r.rect;r.labelPosition=[(b[0]+b[2])/2,(b[1]+b[3])/2];r.local={origin:[b[0],b[1]],u:[1,0],v:[0,1]};r.note='벽 경계를 따른 검토용 room polygon. 미실측 추정 구간 포함.';}
line1.floorPolygons=line1.rooms.map(r=>({id:'floor-'+r.id,roomId:r.id,polygon:structuredClone(r.polygon)}));
line1.balconies=line1.rooms.filter(r=>r.id.startsWith('bal')).map(r=>({id:r.id,polygon:structuredClone(r.polygon),floorId:'floor-'+r.id,status:'unexpanded-review'}));
line1.entrance={openingId:'entry',inward:[1,0],outsideDistance:450,approachDepth:1400,approachWidth:1800};line1.settings.labelHeight=1500;line1.settings.floorThickness=90;line1.settings.doorThickness=35;line1.settings.windowFrame=35;line1.settings.verificationFov=90;line1.geometryRevision='shared-geometry-v3';line1.stage='평면·3D 동일 geometry 검증';
// mirrorConfig is extended first; this materializes all geometry, not a camera transform.
const line2=mirrorConfig(line1);fs.writeFileSync(p,JSON.stringify(line2,null,2));
