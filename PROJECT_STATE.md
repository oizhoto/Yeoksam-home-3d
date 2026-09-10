# PROJECT_STATE — Yeoksam-home-3d

## Current baseline
- Baseline version: **V7.5 BASELINE LOCKED**
- Units: **mm**
- Apartment: 역삼푸르지오 24평, 2호 라인
- Absolute orientation rule: **현관에서 집 안을 볼 때 거실이 왼쪽**
- `main` 브랜치의 이 문서를 모든 작업 시작 전에 먼저 읽는다.

## HARD LOCK — 사용자 명시 지시 없이는 수정 금지
다음 항목은 사용자와 overlay 검토를 거쳐 확정한 baseline이다.

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

이 값은 화면 픽셀이 아니라 **도면/model geometry의 mm 좌표**다.

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
- 터닝도어는 구조체 corner에서 위쪽으로 뻗는 vertical orientation
- 냉장고/WashTower가 터닝도어의 올바른 측에 남도록 유지

## Editable layers
아래는 baseline geometry와 분리하여 자유롭게 발전시킨다.
- 현관 디자인/스타일/마감/수납 디테일
- 주방 가구 디자인 및 마감
- 가구 배치
- 조명 디자인
- 실링팬 / 시스템에어컨 표현
- 벽지 / 바닥 / 필름 / 타일 / 색상 / texture / material
- 커튼 / 장식 / 소품
- 렌더링 품질, 그림자, 카메라 프리셋, UI

이 레이어들을 수정하기 위해 baseline 벽/문/확장 geometry를 옮기면 안 된다.

## Selected finishes
- 벽지: LX Z:IN 디아망 회벽/블랑 그레이 `PR002-13`
- 바닥: 동화자연마루 나투스진 그란데 이모션블랑
- 필름: 영림 루카 화이트 `PX454-2`

## AI handoff protocol — ChatGPT / Astra 공통
작업 시작:
1. GitHub `main` 최신 상태를 읽는다.
2. 이 `PROJECT_STATE.md`를 먼저 읽는다.
3. baseline lock을 존중한다.
4. 요청받은 editable layer만 수정한다.

작업 종료:
1. 변경 파일만 commit한다.
2. baseline을 변경하지 않았는지 diff로 확인한다.
3. 작업 상태가 달라졌다면 이 문서의 editable/project-progress 부분만 갱신한다.
4. baseline 변경은 반드시 사용자가 명시적으로 요청한 경우에만 한다.

## Important source files
- `dist/apartment.config.json` — original/baseline geometry
- `dist/BASE_GEOMETRY_V1.json` — baseline geometry copy used by legacy/review paths
- `dist/INTERIOR_V2_SVG_EXPANSION.json` — confirmed expansion geometry
- `dist/FIXED_INTERIOR_V1.json` — fixed interior elements
- `dist/FURNITURE_V1.json` — editable furniture layer
- `dist/review.js` — baseline inspection/review UI

## Design principle
구조는 잠그고, 인테리어는 레이어에서 발전시킨다.
AI가 더 예쁜 결과를 만들기 위해 구조 geometry를 임의로 '정리', '직선화', '최적화', '재해석'하는 것을 금지한다.
