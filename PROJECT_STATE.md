# PROJECT_STATE — Yeoksam-home-3d

## Current project version
- Project version: **V8.26 — MOBILE WALKTHROUGH / FIRST-PERSON REVIEW**
- Last updated: **2026-09-11 12:37 KST**
- Baseline version: **V7.5 BASELINE LOCKED**
- Important: project version and baseline version are separate. Interior/material updates increase the project version without changing the locked baseline.

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
- 현관 중문: 위치/구조 고정
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

## V8.25 reference design rule
- Primary reference: `https://contents.ohou.se/projects/191168`
- 가져오는 것: 밝은 베이지 현관장, 미니멀 면분할, 한샘 무드베이지 계열 주방 가구 언어, 크리미한 욕실 타일/젠다이/세면대 분위기, 평판형 붙박이장 디테일.
- 가져오지 않는 것: 레퍼런스의 ㄱ자형 주방 레이아웃, 레퍼런스 조명, 구조변경/확장.
- 주방은 현재 **일자형** 유지.
- V8.25는 벽/문/확장 geometry가 아니라 **고정가구 구조와 표면 디테일**을 발전시키는 버전.

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

### V8.26 — Mobile Walkthrough / First-Person Review — 2026-09-11 12:37 KST
- Twinmotion 계열의 Walk/Presentation 운용방식을 참고해 1인칭 검토 조작을 정리.
- 워크스루 눈높이 **1600mm 고정**, 전용 FOV **78°**, 전체 벽/천장 표시.
- 모바일: 좌하단 가상 조이스틱으로 전/후/좌/우, 화면 오른쪽 드래그로 시선 회전, 동시 멀티터치 지원.
- PC: WASD 이동, 드래그 시선 회전, 클릭 시 Pointer Lock 지원.
- 기존 `blocked()` 기반 벽 충돌 유지. 이동은 40mm 이하 스텝으로 분할해 관통 가능성을 낮춤.
- `Walk / Inspect` 2단계 속도, 현관/거실/주방/안방 빠른 위치 버튼, 전체화면 버튼 추가.
- 워크스루 진입 시 `벽 1/2 보기`를 강제로 해제하고 전체 벽 높이로 검토.
- V8.25 주방/욕실/현관/붙박이장, 마감재, 조명 및 V7.5 baseline geometry는 수정하지 않음.

### V8.25 — Reference Built-ins / Bath Detail — 2026-09-11 11:17 KST
- 오늘의집 역삼푸르지오 24평 레퍼런스 191168을 고정가구/욕실 스타일 기준으로 적용.
- **주방은 기존 일자형 구조 그대로 유지**하고, 무드베이지 계열 상·하부장 전면을 실제 문짝/홈/서랍 분할/걸레받이 형태로 상세화.
- 냉장고장은 기존 위치·폭을 유지하며 3개 세로 모듈과 상부 수납의 평판형 면분할을 강화.
- 안방 붙박이장은 기존 envelope를 유지하며 5짝 평판도어, 미세 줄눈, 하부 걸레받이, 상부 필러를 별도 detail overlay로 구현.
- 현관장은 기존 위치/크기를 유지하며 웜베이지 평판 도어와 오픈 니치 표현을 강화.
- 욕실은 기존 fixture 배치를 유지하며 변기 형태를 둥글고 단정한 형태로, 세면대 하부장을 플로팅 무드베이지 스타일로, 젠다이/거울장을 크리미 톤으로 상세화.
- 레퍼런스의 ㄱ자 주방과 조명은 반영하지 않음.
- V7.5 baseline 구조/문/확장/현관중문/터닝도어 및 DESIGN 조명 데이터 수정 없음.
- 레퍼런스 공개 텍스트가 보증하는 것은 밝은 베이지 현관, 오픈 수납, 한샘 무드베이지 주방, 크리미 욕실 타일이며 세부 비례는 사진 기반 근사 모델임.

### V8.24 — Material Visual Refinement — 2026-09-11 06:15 KST
- 바닥 810×325mm 판재 2×2 atlas, color/height/roughness 대응.
- 벽지 PR002-13 다중 스케일 회벽 질감, PX454-2 미세 표면/roughness 개선.
- 구조/확장/문/중문/터닝도어, DESIGN, 가구, 욕실·주방 상세, 카메라·조명 변경 없음.

### V8.23 — Kitchen Detail / Half-Wall View — 2026-09-11 00:13 KST
- 욕실2 수건걸이/수건 위치 보정.
- 실제 싱크 타공부/하부장 모듈/식세기/상부장 4칸 상세.
- 3D `벽 1/2 보기` 추가.
- baseline 미변경.

### V8.22 — Bath2 / Kitchen Cabinet Fix
- 욕실2 변기 회전, 휴지걸이/수건걸이 추가.
- recessed sink, 하부장 150+600+600+600+600, 상부장 637.5×4.
- baseline 미변경.

### V8.21 — Bathroom Clearance Fix
- 욕실1·2 세면대/세면볼/수전 clearance 수정.
- 욕실2 변기 위치/회전 보정.
- baseline 미변경.

### V8.2 — Bathroom Detail Correction
- 욕실1·2 젠다이, 매립형 세면볼, 데크형 수전, 4칸 수납장.
- 욕실2 샤워부스 고정유리/유리문 동선 구현.
- baseline 미변경.

### V8.1 — Bathroom / Fridge Layout Correction
- 냉장고장 조리대 반대편 x=2700 벽, 창가측 배치.
- 욕실1·2 fixture 관계 정리.
- baseline 미변경.

### V8.0 — Bathroom / Kitchen Detail
- 욕실 fixture, 600×600 warm-greige 타일 계획값.
- 일자형 주방 싱크/수전/인덕션 및 원도어 3대 대응 냉장고장.
- baseline 미변경.

### V7.8 — Version / History UI
- 화면/PROJECT_STATE/commit/ZIP 버전 관리 규칙 정립.
- geometry 변경 없음.

### V7.7 — Material Stage 2
- 디아망 PR002-13, 나투스진 그란데 이모션블랑, 루카화이트 PX454-2 material 구현.
- geometry 변경 없음.

### V7.6 — Interior Stage 1
- DESIGN layer: 실링팬, 시스템에어컨, 다운라이트, 간접조명, 커튼박스.
- baseline geometry 변경 없음.

### V7.5 — BASELINE LOCKED
- overlay 검토 기준 구조 baseline 확정.
- 확장, 문 위치/방향, 현관 중문, WashTower 터닝도어 고정.
