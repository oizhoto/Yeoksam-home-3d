import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const copies=[
  ['data/geometry/BASE_GEOMETRY_V1_2026-09-07.json','dist/BASE_GEOMETRY_V1.json'],
  ['data/interior/INTERIOR_V1_2026-09-08.json','dist/INTERIOR_V1.json'],
  ['data/working/APARTMENT_WORKING_V1_2026-09-08.json','dist/apartment.config.json'],
  ['data/furniture/FURNITURE_V0_2026-09-08.json','dist/furniture.json'],
  ['data/materials/MATERIALS_V1_2026-09-08.json','dist/materials.json'],
  ['data/assumptions/ASSUMPTIONS_2026-09-08.json','dist/assumptions.json']
];
for(const [src,dst] of copies){
  fs.copyFileSync(path.join(root,src),path.join(root,dst));
  console.log(`SYNC ${src} -> ${dst}`);
}
