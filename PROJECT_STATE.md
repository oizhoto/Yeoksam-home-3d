# PROJECT_STATE — Yeoksam-home-3d

## Current project version
- Project version: **V8.28 — REFERENCE REPAIR / BATHROOM-KITCHEN CORRECTION**
- Last updated: **2026-09-11 15:02 KST**
- Baseline version: **V7.5 BASELINE LOCKED**
- Project version and baseline version are separate. Interior/material/UI updates do not change the locked baseline.

## Current baseline
- Baseline version: **V7.5 BASELINE LOCKED**
- Units: **mm**
- Apartment: 역삼푸르지오 24평, 2호 라인
- Absolute orientation rule: **현관에서 집 안을 볼 때 거실이 왼쪽**
- `main` 브랜치의 이 문서를 모든 작업 시작 전에 먼저 읽는다.

## HARD LOCK — 사용자 명시 지시 없이는 수정 금지
1. 구조 geometry / 벽 위치 / 방 경계
2. 확장 geometry 및 확장 경계
3. 현관 중문의 위치/기본 구조
4. 세탁실 WashTower 쪽 터닝도어 위치/기본 구조
5. 확정된 문 위치와 방향
6. 침실3–주방 사이의 구조 돌출/offset wall
7. 안방 발코니 유지
8. 현관 기준 거실 LEFT orientation 및 runtime mirror 기준

### 확정 문 좌표
- `door-bed2`: start **1375**, width **850**, hinge **end**, swing **-90**
- `door-bath1`: start **3195**, width **650**, hinge **end**, swing **-90**
- `door-bath2`: start **2150**, width **650**, hinge **end**, swing **-90**

## Expansion baseline
- 침실2 + 침실2측 확장부 = 하나의 침실2
- 주방 + 주방 확장부 = 하나의 주방
- 침실3 + 침실3측 확장부 = 하나의 침실3
- 중앙 구조체/내력 영역은 확장 공간에 흡수하지 않는다.
- 침실2↔주방 확장 divider 유지
- 주방 확장↔침실3 확장 divider 유지
- 안방 발코니는 확장하지 않는다.
- 거실측 확장 적용
- 침실3–주방 사이 돌출/offset 구조벽 보존

## Fixed architectural/interior baseline
- 현관 중문: 위치/전체 opening 고정, V8.28에서는 같은 opening 안에서 **3연동 슬림프레임 패널**로 표현
- WashTower 구역 터닝도어: **x=4550, z=1250→0**, center `[4550,0,625]`, size `[50,2200,1250]`
- 터닝도어 vertical orientation 유지
- 냉장고/WashTower가 터닝도어의 올바른 측에 남도록 유지

## Editable layers
- 현관 디자인/스타일/마감/수납 디테일
- 주방 가구 디자인 및 마감
- 붙박이장/고정가구 상세
- 가구 배치
- 조명 디자인
- 실링팬 / 시스템에어컨 표현
- 벽지 / 바닥 / 필름 / 타일 / 색상 / texture / material
- 커튼 / 장식 / 소품
- 렌더링 품질, 그림자, 카메라 프리셋, UI

## Selected finishes
- 벽지: LX Z:IN 디아망 회벽/블랑 그레이 `PR002-13`
- 바닥: 동화자연마루 나투스진 그란데 이모션블랑
- 필름: 영림 루카 화이트 `PX454-2`

## Design principle
구조는 잠그고, 인테리어는 레이어에서 발전시킨다.
AI가 더 예쁜 결과를 만들기 위해 구조 geometry를 임의로 정리/직선화/최적화/재해석하지 않는다.

## Reference design rule
- Primary reference: `https://contents.ohou.se/projects/191168`
- 가져오는 것: 밝은 베이지 현관장, 미니멀 면분할, 무드베이지 계열 주방 가구 언어, 크리미하고 밝은 웜베이지 욕실 타일/젠다이/세면대 분위기, 평판형 붙박이장 디테일.
- 가져오지 않는 것: 레퍼런스의 ㄱ자형 주방 레이아웃, 구조변경/확장.
- 주방은 **일자형** 유지.
- 사용자 실제 냉장고/가전장 사진 기준 총 폭 **W1200mm**를 사용.

## V8.28 explicit room/program lock
- **화장실1 = 샤워부스**
- **화장실2 = 욕조**
- 두 욕실 모두 세면대/매립형 세면볼/수전/젠다이/거울 상부장 구성을 유지.
- 두 욕실 모두 밝은 크리미 웜베이지 톤.
- 주방 하부장 총 길이 **2900mm**, 모듈 `[600,200,700,700,700]`.
- 모듈 순서: 인덕션 서랍장 / 좁은장 / 식기세척기 / 싱크장 / 일반장.
- 싱크 중심 z=3650, 인덕션 z=2150.
- 상판 12mm thin porcelain/ceramic slab.
- 상부장 2900mm, 725×4.
- 현관 중문은 기존 opening 내 **3연동**.

## VERSION MANAGEMENT — ChatGPT / Astra 공통 영구 규칙
- 작업 시작 전 GitHub `main` 최신 `PROJECT_STATE.md` 확인.
- 새 코드/디자인/재질/UI 변경 시 다음 project version 사용.
- 구조 baseline 변경이 없으면 V7.5 BASELINE LOCKED 유지.
- 화면 버전, PROJECT_STATE, commit message, ZIP 파일명의 버전 일치.
- 패치 ZIP은 `yeoksam-vX.X-...-patch.zip`, 저장소 root 상대경로 유지.
- 작업 종료 시 baseline geometry/확장/문/중문/터닝도어 변경 여부 확인.

## Important source files
- `dist/apartment.config.json`
- `dist/BASE_GEOMETRY_V1.json`
- `dist/INTERIOR_V2_SVG_EXPANSION.json`
- `dist/FIXED_INTERIOR_V1.json`
- `dist/FURNITURE_V1.json`
- `dist/BATHROOM_KITCHEN_V1.json`
- `dist/review.js`

## VERSION HISTORY

### V8.28 — Reference Repair / Bathroom-Kitchen Correction — 2026-09-11 15:02 KST
- V8.27의 중문-only 패치를 폐기하고, GitHub V8.26 기능을 유지한 채 사용자 최종 요구를 다시 반영.
- 현관 중문을 기존 opening 내 3연동 슬림프레임 패널로 표현.
- **화장실1을 샤워부스**, **화장실2를 욕조**로 확정.
- 두 욕실의 vanity / inset basin / deck faucet / ledge / mirror upper cabinet 구성을 복구.
- 욕실 톤을 밝은 크리미 웜베이지로 통일.
- 주방을 일자형 2900mm로 복구하고 `[600,200,700,700,700]` 모듈 구성 적용.
- 사용자 실제 사진 기준 W1200 냉장고/가전장으로 변경.
- V8.24 재질 개선, V8.25 reference detailing, V8.26 모바일 워크스루는 유지.
- V7.5 baseline geometry/문/확장/터닝도어 변경 없음.

### V8.27 — Three-panel Entry Door — superseded by V8.28
- 중문만 수정했던 임시 패치. V8.28이 대체함.

### V8.26 — Mobile Walkthrough / First-Person Review — 2026-09-11 12:37 KST
- 1600mm 눈높이, 모바일 조이스틱/드래그, PC WASD/Pointer Lock, 충돌 유지.
- Walk / Inspect 속도와 빠른 위치 버튼, 전체화면 지원.

### V8.25 — Reference Built-ins / Bath Detail — 2026-09-11 11:17 KST
- 오늘의집 191168을 고정가구/욕실 스타일 기준으로 적용.
- 일자형 주방 구조 유지, 무드베이지 계열 면분할 상세화.
- 안방 붙박이장/현관장/욕실 표면 디테일 강화.

### V8.24 — Material Visual Refinement — 2026-09-11 06:15 KST
- 바닥 810×325mm atlas, 벽지 PR002-13, PX454-2 미세 표면/roughness 개선.

### V8.23 — Kitchen Detail / Half-Wall View — 2026-09-11 00:13 KST
- 욕실2 수건걸이/수건 위치 보정, 싱크 타공/주방 상세, 벽 1/2 보기.

### V8.22 — Bath2 / Kitchen Cabinet Fix
- 욕실2 변기/휴지걸이/수건걸이, recessed sink, 하부장/상부장 정리.

### V8.21 — Bathroom Clearance Fix
- 욕실1·2 세면대/세면볼/수전 clearance 수정.

### V8.2 — Bathroom Detail Correction
- 욕실1·2 젠다이, 매립형 세면볼, 데크형 수전, 4칸 수납장.

### V8.1 — Bathroom / Fridge Layout Correction
- 냉장고장 조리대 반대편 x=2700 벽, 창가측 배치.

### V8.0 — Bathroom / Kitchen Detail
- 욕실 fixture, 일자형 주방 기본 상세.

### V7.8 — Version / History UI
- 화면/PROJECT_STATE/commit/ZIP 버전 관리 규칙 정립.

### V7.7 — Material Stage 2
- 디아망 PR002-13, 나투스진 그란데 이모션블랑, 루카화이트 PX454-2 material 구현.

### V7.6 — Interior Stage 1
- DESIGN layer: 실링팬, 시스템에어컨, 다운라이트, 간접조명, 커튼박스.

### V7.5 — BASELINE LOCKED
- overlay 검토 기준 구조 baseline 확정.
