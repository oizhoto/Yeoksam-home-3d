# PROJECT_STATE — Yeoksam-home-3d

## Current project version
- Project version: **V7.7 — MATERIAL STAGE 2**
- Baseline version: **V7.5 BASELINE LOCKED**
- Important: project version and baseline version are separate. Interior/material updates increase the project version without changing the locked baseline.

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


## VERSION MANAGEMENT — ChatGPT / Astra 공통 영구 규칙

모든 후속 작업은 아래 규칙을 반드시 따른다.

1. **작업 시작 전 버전 확인**
   - GitHub `main`의 최신 `PROJECT_STATE.md`를 먼저 읽고 현재 **Project version**을 확인한다.
   - 이미 사용한 버전 번호를 임의로 재사용하지 않는다.
   - 새 코드/디자인/재질/UI 변경이 생기면 다음 project version으로 올린다.
   - 구조 baseline이 수정되지 않는 한 **Baseline version은 V7.5 BASELINE LOCKED로 유지**한다.

2. **앱 화면에 버전 표시**
   - 현재 project version을 사용자가 실행 화면에서 항상 확인할 수 있게 표시한다.
   - 최소한 3D 화면 host에는 `Vx.x` 버전 배지를 유지한다.
   - 내부적으로도 `data-app-version` 또는 동등한 metadata에 현재 버전을 기록한다.

3. **PROJECT_STATE.md 기록**
   - 문서 상단의 `Current project version`을 새 버전으로 갱신한다.
   - 해당 버전에서 실제 변경한 범위와 검증 상태를 progress 섹션에 기록한다.
   - baseline lock 내용은 사용자의 명시적 구조 변경 요청이 없는 한 수정하지 않는다.

4. **Git commit 규칙**
   - commit message는 반드시 버전 번호로 시작한다.
   - 형식 예: `V7.7: refine confirmed finish materials`
   - 한 버전의 변경은 가능한 한 하나의 목적에 한정한다.

5. **패치 ZIP 규칙**
   - 파일명은 반드시 소문자 `yeoksam`으로 시작한다.
   - 형식: `yeoksam-vX.X-작업명-patch.zip`
   - 예: `yeoksam-v7.7-material-stage2-patch.zip`
   - 대문자 `Yeoksam`, 다른 prefix, 임의 파일명은 사용하지 않는다.
   - ZIP 내부 경로는 **Git 저장소 root 기준 상대경로**를 유지한다.
   - 프로젝트 전체를 다시 포장하지 말고 원칙적으로 **변경된 파일만** 포함한다.
   - 기존 동일 경로 파일은 updater가 덮어쓰고 Git이 modified로 추적하도록 한다.

6. **작업 종료 검증**
   - 코드 syntax / 실행 여부를 확인한다.
   - baseline geometry, 확장, 문, 중문, 터닝도어가 변경되지 않았는지 diff/check script로 확인한다.
   - 화면에 표시되는 버전, `PROJECT_STATE.md`, commit message, ZIP 파일명의 버전이 서로 동일해야 한다.

이 규칙은 Astra와 ChatGPT 어느 쪽에서 작업하더라도 동일하게 적용한다.

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

## Editable layer progress — material stage 2
- 확정 마감재의 texture scale / bump / roughness만 조정. Baseline은 V7.5 그대로 유지.
- 바닥 810×325mm 물리 스케일 및 벽/문 면별 반복 적용.
- 304ac57 대비 구조·고정 요소·가구·천장·조명·카메라 보호 검사: tools/check-material-stage2.mjs.
- 실행 확인은 Canvas3D 환경. WebGL 질감/광택 시각 검증은 미완료.
- 적용 및 자료/가정: docs/MATERIAL_STAGE2.md.
