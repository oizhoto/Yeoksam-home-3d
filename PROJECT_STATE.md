# PROJECT_STATE — Yeoksam-home-3d

## Current project version
- Project version: **V8.24 — MATERIAL VISUAL REFINEMENT (REVIEW CANDIDATE)**
- Last updated: **2026-09-11 06:15 KST**
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
   - 문서 가장 상단의 `Current project version`을 새 버전으로 갱신한다.
   - 같은 위치에 **최종 업데이트 시간(KST)** 을 기록한다.
   - `VERSION HISTORY`에 버전별 실제 변경사항을 누적 기록한다. 기존 히스토리를 삭제/덮어쓰지 않는다.
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
   - 화면 최상단에는 항상 **현재 Project version + 최종 업데이트 시간(KST)** 이 보여야 한다.
   - 화면에 표시되는 버전, `PROJECT_STATE.md`, commit message, ZIP 파일명의 버전이 서로 동일해야 한다.
   - 레이어 고유 버전이나 baseline 버전을 현재 project version처럼 단독 표시하지 않는다.

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

## VERSION HISTORY

### V8.24 — Material Visual Refinement — 2026-09-11 06:15 KST
- V8.23 main c57742bed8efeb90008fade715fceb4f6a3ae80c 기준의 별도 검토 패치. GitHub/main 배포는 사용자가 Sol 검토 후 처리.
- 바닥 810×325mm 판재를 2×2 atlas로 표현. 물리 폭의 이음선/미세 bevel height, 서로 대응하는 석재 color/height/roughness map 적용.
- 벽지 PR002-13은 seamless 다중 스케일 회벽 얼룩/미세 요철, 필름 PX454-2는 별도 미세 표면과 낮은 roughness. 색상 기준은 기존 마감재 유지, 가짜 대리석 vein 추가 없음.
- 구조/확장/문/중문/터닝도어, DESIGN, 가구, 욕실·주방 상세, 카메라·조명 및 UV geometry 변경 없음.
- WebGL 비활성 환경: 실제 GPU 3D의 동일 카메라 전후 시각 검증은 미완료. 시각 개선 완료로 간주하지 말고 WebGL 환경에서 검토 필요.
- 검사 및 병합 안내: docs/MATERIAL_VISUAL_REFINEMENT_V824.md, tools/check-material-refinement.mjs.

### V8.23 — Kitchen Detail / Half-Wall View — 2026-09-11 00:13 KST
- 욕실2 수건걸이와 수건을 **변기 정면 맞은편 남측 벽, 변기 x축에 맞춰** 재배치.
- 주방 싱크는 단순히 아래로 내린 박스가 아니라 **상판 자체를 네 조각으로 분할하여 실제 타공부를 생성**하고, 스테인리스 볼은 그 구멍 아래에 배치.
- 하부장의 기존 민자 통박스 렌더링을 제거하고 `150 + 600 + 600 식세기 + 600 + 600` 전면 모듈을 실제로 렌더링.
- 식기세척기는 LG DIOS 빌트인 계열의 전면 특징을 참고하여 **약 600mm 모듈, 밝은 전면, 상단 어두운 컨트롤 스트립/표시부, 손잡이 디테일**로 구현. citeturn206657search13turn206657search15
- 상부장은 동일한 전체 폭 2550mm에서 637.5mm × 4칸으로 렌더링.
- 3D 화면에 **`벽 1/2 보기` 버튼** 추가. 누르면 구조 좌표를 바꾸지 않고 렌더링 높이만 절반으로 낮춰 내부를 쉽게 검토할 수 있고, 다시 누르면 원래 높이로 복귀.
- V7.5 baseline 좌표 데이터는 수정하지 않음.


### V8.22 — Bath2 / Kitchen Cabinet Fix — 2026-09-11 00:06 KST
- 욕실2 변기를 V8.21 상태에서 **180° 회전**.
- 전체뷰 기준 욕실2 **우측/동측 벽면에 휴지걸이** 추가.
- 변기 맞은편 벽에 **수건걸이 + 수건 1장** 추가.
- 주방 싱크볼을 상판 위로 돌출된 박스 표현에서 **상판에 매립된 recessed sink** 표현으로 수정. 림은 상판 높이에 맞추고 볼은 아래로 내려가도록 구현.
- 주방 하부장 전면 모듈을 `얇은 칼수납 150 + 600 + 식기세척기 600 + 600 + 600`으로 구성.
- 칼수납장을 제외한 모든 하부 모듈은 식기세척기와 동일한 **600mm 폭**으로 통일.
- 상부장은 전체 길이를 하부장과 동일한 **2550mm**로 맞추고, **637.5mm × 4칸 등간격**으로 구성.
- 상/하부 **양 끝선은 정확히 일치**. 얇은 칼수납 때문에 내부 세로 구분선까지 모두 일치시키지는 않고, 전체 외곽 정렬을 우선.
- V7.5 baseline geometry는 수정하지 않음.


### V8.21 — Bathroom Clearance Fix — 2026-09-10 23:59 KST
- 욕실1 세면대/세면볼/수전 세트를 젠다이에서 **방 안쪽으로 분리 이동**해 서로 겹치지 않도록 수정.
- 욕실2 세면대/세면볼/수전도 동일하게 **젠다이 앞쪽으로 분리 이동**해 수전이 젠다이를 뚫고 나오는 현상 수정.
- 두 욕실 모두 수전은 세면대의 평평한 상판 위에 남도록 상대 위치 유지.
- 욕실2 변기는 V8.2 기준에서 **시계방향 90° 추가 회전**하고, 위쪽/젠다이 벽 쪽으로 붙여 배치.
- V8.2의 욕조, 샤워부스, 수납장 4칸, 수건/휴지걸이 구성은 유지.
- V7.5 baseline geometry는 수정하지 않음.


### V8.2 — Bathroom Detail Correction — 2026-09-10 23:55 KST
- 욕실1에도 젠다이를 추가하고, 욕실1·2 모두 젠다이/세면대 상판에 **매립형 세면볼 + 데크형 수전**을 명확하게 구현.
- 욕실1 휴지걸이는 **변기에 앉았을 때 왼쪽** 기준의 실제 벽면에 부착되도록 위치 수정. 공중에 뜨는 배치 제거.
- 욕실1 수건걸이에 **수건 1장** 추가.
- 욕실1·2 젠다이 위 긴 수납장을 **4칸**으로 수정: 구분선 2개 → **3개**.
- 욕실2 샤워부스 고정 유리는 **욕실문 90° 오픈 상태와 평행**하게 벽과 벽 사이를 잇는 방향으로 수정.
- 욕실2 샤워부스 출입용 **유리문 추가**. 욕실 출입문 뒤쪽에 배치하고 **샤워부스 안쪽으로 열리도록** 설정.
- 동선 의도: 욕실2 출입문을 닫은 뒤에야 샤워부스 유리문을 열 수 있는 관계로 구성.
- V8.1의 변기/세면대/욕조 기본 배치 및 V7.5 baseline geometry는 유지.


### V8.1 — Bathroom / Fridge Layout Correction — 2026-09-10 23:49 KST
- 냉장고장을 기존 조리대 **반대편 x=2700 벽**으로 이동하고 **창가(z≈0) 쪽에 밀착**. 원도어 3대 병렬 + 상부수납 구성 유지.
- 욕실1: 동측 문에서 서쪽으로 진입하는 기준으로 **우측(북측) 변기 → 더 안쪽 우측 세면대**, 정면(서측)에 욕조의 긴 옆면이 보이도록 재배치.
- 욕실1: 욕조 우측/북측 끝에 샤워기 배치.
- 욕실1: 세면대 반대편 벽에 수건걸이, 변기 왼쪽 측면에 휴지걸이 추가.
- 욕실1: **세면대와 변기 위를 함께 덮는 가로형 긴 상부 수납장** 추가.
- 욕실2: 문에서 들어가면 정면(북측)에 세면대, 우측(동측)에 변기 배치.
- 욕실2: 세면대+변기 뒤로 연속 젠다이, 그 위로 가로형 긴 수납장 추가.
- 욕실2: 좌측/문 뒤쪽 영역을 **유리 샤워부스**로 구성하고 샤워트레이·샤워기·유리 패널 추가.
- V7.5 baseline 벽/문/확장/중문/터닝도어 geometry는 수정하지 않음.


### V8.0 — Bathroom / Kitchen Detail — 2026-09-10 23:38 KST
- 공용욕실은 **욕조 유지**, 유리 파티션은 미설치 상태로 구현. 추후 별도 레이어로 추가 가능.
- 공용욕실: 욕조, 변기, 세면대/하부장, 거울장, 세면 수전, 욕조 수전 추가.
- 안방욕실: 변기, 세면대/하부장, 거울장, 샤워 수전 기본 모델 추가.
- 욕실 600×600 warm-greige 타일 계획값 기록.
- 기존 일자형 주방/상부장은 유지하면서 **싱크볼, 하이아크 수전, 인덕션** 3D fixture 추가.
- 업로드된 주방 사진을 참고해 **원도어 3대 병렬 대응 냉장고장 + 상부 수납장**을 별도 3D detail layer로 추가.
- 냉장고장 계획 envelope: W1950 × D700 × H2300, 3개 모듈 + 상부수납 H430. 실제 제품 선정 시 폭 조정 가능.
- V7.5 baseline 구조/문/확장/중문/터닝도어 geometry는 수정하지 않음.


### V7.8 — Version / History UI — 2026-09-10 23:22 KST
- 화면 최상단의 현재 프로젝트 버전을 **V7.8**로 통일.
- 화면 최상단에 **최종 업데이트 시간(KST)** 표시.
- 인테리어 시안 영역은 `Project V7.8 / Baseline V7.5 LOCKED`로 역할을 구분해 표시.
- `PROJECT_STATE.md`에 버전별 변경내역 누적 규칙 추가.
- 앞으로 화면 버전 / PROJECT_STATE / Git commit / patch ZIP 버전 일치를 필수 규칙으로 적용.
- 구조, 확장, 문, 중문, 터닝도어 및 인테리어 geometry 변경 없음.

### V7.7 — Material Stage 2
- 확정 마감재 3종의 Three.js material 구현/개선.
- LX Z:IN 디아망 PR002-13: procedural color map / bump / roughness 적용.
- 동화자연마루 나투스진 그란데 이모션블랑: 810×325mm 물리 스케일 기반 반복 적용.
- 영림 루카화이트 PX454-2: procedural film texture / roughness 적용.
- 구조·고정 요소·가구·천장·조명·카메라는 변경하지 않도록 보호.
- WebGL에서 실제 체감 질감/광택에 대한 최종 시각 검증은 미완료.

### V7.6 — Interior Stage 1
- 별도 DESIGN layer 추가.
- 실링팬, 시스템에어컨, 다운라이트, 간접조명, 커튼박스 구현.
- 인테리어 시안 ON/OFF 및 디자인 카메라/조명 컨트롤 추가.
- baseline geometry 변경 없음.

### V7.5 — BASELINE LOCKED
- 사용자 overlay 검토를 기준으로 구조 baseline 확정.
- 확장, 문 위치/방향, 현관 중문, WashTower 터닝도어 등 고정.
- 이후 사용자 명시 지시 없이는 baseline 수정 금지.
