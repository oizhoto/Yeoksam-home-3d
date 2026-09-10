# V2 복원 + 첨부 SVG 확장안

기본 화면은 V2이며 `svg-expansion.html`에서 별도 `INTERIOR_V2_SVG_EXPANSION` 모델을 비교합니다. 첨부 SVG를 X=(px−95)/0.074, Y=(py−90)/0.074로 mm 환산했습니다. 중앙 1350×535mm 박스는 BASE와 위치가 같으며 내력 여부는 미확정입니다. 거실/주방/침실2/침실3 확장과 거실에서 베란다 안쪽으로 열리는 문을 반영했습니다. BASE와 V2 데이터는 보존합니다.

재생성·검사: `node create-svg-expansion.mjs`. 기존 V2 검사: `node interior-v2-tests.mjs`. 실제 브라우저 버튼 조작은 이번 수정에서 검증하지 않았습니다.

## 이전 V4 기록

동일 단지 24평 시공 자료에서 확인된 거실 확장·직선형 외창 사례와 BASE를 교차해 만든 보수적 확장 모델이다. 거실·주방·침실2의 확인된 기존 유리 경계만 제거했다. 침실1은 미확장으로 전용 베란다와 분리 경계를 유지한다. 침실3 발코니와 주방-침실3 돌출벽도 BASE를 유지한다.

재생성: `node create-interior-v4.mjs`
검증: `node interior-v4-tests.mjs`

---

# INTERIOR_V3_EXPANSION_CLEANUP

V2를 복제한 모델입니다. BASE_GEOMETRY_V1 JSON은 변경하지 않았습니다.
내부 창호 5개와 미확인 25개 부재는 일반 렌더/충돌/opening 생성 데이터에서 제외하고 boundaryAssessment에만 보존했습니다. north-step의 외곽 0~300mm는 별도 외곽 return으로 보존했습니다. KEEP_STRUCTURE 확정 부재는 0개입니다. 실제 철거 승인 모델이 아닙니다.

바닥은 원래 11개 영역의 정확한 직교 합집합으로 1개 외곽 + 기존 구멍 1개입니다. 바닥 높이 0mm는 ASSUMED입니다. 영역/좌표계와 외곽 창호를 보존합니다.

실행: 프로젝트 루트에서 `python3 -m http.server 8000 --directory dist`, 브라우저에서 http://localhost:8000.
재생성: `node create-interior-v3.mjs`, 검증: `node interior-v3-tests.mjs`.
앱의 5개 화면과 동일 카메라 BEFORE/AFTER 전환, 접이식 segment 표를 사용하세요.
브라우저 검증 환경에서는 WebGL 없이 같은 Three mesh를 Canvas3D로 투영했습니다. 그림자/투명도/가림 처리는 WebGL과 다를 수 있습니다.

---
이전 버전 기록:

# INTERIOR_V2 · 경계 segment 판정

BASE_GEOMETRY_V1과 INTERIOR_V1을 수정하지 않고 INTERIOR_V2를 작성했습니다. 10개 경계의 30개 부재를 검토해 창호5개 REMOVE_FOR_EXPANSION, 나머지25개 STRUCTURE_UNCONFIRMED로 분류했습니다. KEEP_STRUCTURE 확정은0개입니다. 원본 도면은 내력벽·기둥 식별 근거를 제공하지 않습니다.

각 주요 경계는 창호, 양끝 벽체, 하부벽 가정, 상부벽 가정으로 구분했습니다. 하부850mm/상부150mm는 기존 엔진의 공통 설정으로 생성된 값이며 원본에서 확인된 실제 벽 높이가 아닙니다. 해당 부재는 실재·높이·구조 여부 모두 미확정입니다. V2는 이들 부재를 삭제하지 않고 윤곽으로 표시하며 충돌을 보존합니다.

판정도는 제거 빨강, 유지확정 검정, 미확인 주황입니다. 같은 평면 위치에 겹친 하부·상부 가정 부재는 ±90mm 도식 오프셋의 주황점선으로 표현합니다. 실제 모델 좌표는 이동하지 않습니다.

판정도 아래에 동일카메라 BASE vs V2 3D가 있습니다. 촬영 브라우저는 Canvas3D fallback을 사용했습니다. 자료는 모델 검토용이며 현장 철거 승인이나 시공 지시가 아닙니다.

node interior-v2-tests.mjs로 기준 SHA256, segment 분류 전수 대응, 부재 보존을 검사합니다. INTERIOR_V2-assessment.svg는 별도 판정도이며 JSON에는 부재별 a/b 좌표, 높이, 판정, 근거를 기록했습니다.

이하 이전 기록:

# INTERIOR_V1 · 발코니 확장 비교

시작 화면은 확장 전/후 비교입니다. BASE_GEOMETRY_V1.json은 원본 그대로 보존했습니다. INTERIOR_V1.json은 같은 좌표에서 복제한 별도 검토 모델입니다. 발코니 3곳을 실내 용도로 전환하고 기존 내부 유리창 5곳만 제외합니다. 철거 여부가 확인되지 않은 경계 10개를 STRUCTURE_UNCONFIRMED로 표시하며, 모든 기존 벽체·하부벽·상부벽과 충돌을 유지합니다. 완전히 열린 동선은 구조 확인 전까지 확정하지 않습니다.

- 한 버튼으로 BEFORE/AFTER 전환, 나란히 비교 버튼으로 2D/3D 동시 비교.
- 3D 전체 보기와 현관 시점은 두 모델의 카메라를 동기화합니다.
- 3D 비교 이미지 저장을 지원합니다.
- WebGL 미지원 기기에서는 같은 Three.js mesh와 카메라를 Canvas에 투영합니다. 이 간이 표시에는 그림자가 없으며 가속 렌더와 외관이 다를 수 있습니다.
- 원본 도면 검증은 review.html에 유지합니다.
- 가구·마감재·조명 설계 추가 없음.
- node interior-tests.mjs: 원본 SHA256 불변, 같은 좌표, 벽체 보존 및 유리창만 제거 검사.

이하 원본 검증 기록:

# 역삼푸르지오 24평 2호 라인 — STEP 1 평면 검증

현재 시작 화면에서 1호 라인 2D, 반전된 2호 라인 2D, 동일 데이터의 3D를 함께 검증합니다. 현관 밖에서 집 안을 볼 때 거실이 왼쪽입니다. STEP 3 확장 설계 이후 기능은 진행하지 않았습니다. 이 버전은 원본에 근거한 **사용자 검토 후보**이며 실측 또는 구조도 기반 digital twin으로 확정된 상태가 아닙니다.

## 실행

Python 3 설치 후 프로젝트 폴더에서:

```sh
python3 -m http.server 8000 --directory dist
```

Windows에서는 `py -m http.server 8000 --directory dist`도 가능합니다. 브라우저에서 http://localhost:8000 을 엽니다. 파일 더블클릭 대신 HTTP 서버로 실행하세요. 빌드/npm 설치/외부 CDN이 필요 없습니다.

## 검증 순서

1. 왼쪽 원본은 1호 라인 그대로 표시하여 문 기호와 mm 치수를 읽습니다.
2. 오른쪽은 **실제 좌표를 mirror한 2호 라인**입니다. 청록 벽 중심선, 주황 문/힌지/회전호, 파랑 창/유리 경계가 반전 원본에 겹칩니다. 점선 외곽은 미확정 후보입니다.
3. 원본 overlay의 균일 배율(mm/px), X/Y 이동(mm), 회전(도), 투명도를 조절합니다. 이는 이미지 정렬만 바꾸며 건축 좌표는 바꾸지 않습니다. 정렬은 반전된 이미지의 좌상단을 기준으로 이동 → 회전 → 균일 배율 → 픽셀 좌우반전 순서의 SVG 변환으로 저장됩니다.
4. `기존 형상 비교`를 켜면 최초 확장형 모델을 같은 2호 라인으로 반전한 회색 선과 비교할 수 있습니다. 확장 전/후 경계 차이는 오류로 단정하지 마세요.
5. 선을 클릭하거나 요소 목록에서 선택해 벽 양 끝점, 문/창 시작거리·폭, 문 힌지와 열림 방향을 숫자로 수정합니다. 벽 길이는 끝점으로 결정됩니다. 화면 Y는 JSON Z입니다.
6. 공간별 검토 메모를 남기고 저장하거나 JSON을 내보냅니다. `검토 저장`은 브라우저 localStorage의 STEP 1 전용 키를 사용합니다. 과거 3D 저장 데이터와 분리됩니다.
7. SVG 다운로드는 현재 정렬과 형상을 원본 이미지와 함께 내장해 저장합니다.

## 데이터

- `dist/apartment.config.json`: 현재 2호 라인 전체 건축 좌표 + 치수 근거 + overlay 정렬 + 검토 메모. schemaVersion 2.
- `dist/previous.config.json`: 최초 모델을 좌표 반전한 비교 전용 데이터.
- `dist/assumptions.json`: 미확정 사항.
- `dist/floorplan.png`: 제공된 원본.
- `dist/plan-core.js`: 공유 SVG 렌더링, 좌표 mirror, 문 회전, 검증 로직.
- `dist/review.js`, `dist/review.css`, `dist/index.html`: STEP 1 앱.
- `dist/line2-plan-review.svg`, `dist/plan-comparison.svg`, `dist/plan-comparison.png`: 동일 렌더 함수로 만든 검토용 정적 출력. 브라우저 스크린샷은 아닙니다.
- `archive/`: 초기 1호 라인 3D/설정 보관 자료. 현재 앱은 아래의 새 공유 3D 엔진을 사용합니다.
- `dist/shared-3d.js`: 현재 3D 엔진. `plan-core.js`의 compileGeometry가 동일 config에서 벽, 문짝, 창, 바닥, 충돌을 생성합니다. `vendor/`의 Three.js를 사용합니다. 기존 `app.js`, `geometry.js`는 보관 코드이며 로드하지 않습니다.

단위는 mm. 벽 `a=[x,z]`, `b=[x,z]`. 문/창 `start`는 a에서 b를 향한 거리, `width`는 개구부 폭. 문 `hinge`는 개구부 `start`/`end`, `swing`은 화면 좌표에서 ±90도입니다. `rooms.rect`는 방명 표시 영역이며 벽 생성이나 면적 계산에 사용하지 않습니다.

Mirror는 `x₂ = 7950 - x₁`입니다. 벽 a→b 순서를 유지하므로 문/창의 상대 start/width는 유지되고 실제 양 끝점은 반전됩니다. 문 회전 부호는 반전합니다. 방 rect는 min/max 재정렬, spawn 및 fixture 위치도 반전합니다. 렌더링 그룹이나 카메라만 뒤집은 것이 아닙니다.

`dimensionEvidence`의 `printed-*`는 원본 표기 또는 표기에서 계산한 값이며 실측 확정을 뜻하지 않습니다. 각 벽/문/창은 `dimension-constrained`, `image-estimated`, `user-edited`로 근거를 구분합니다. `dimension-constrained`라도 벽 두께와 내부 opening은 별도 추정입니다.

## 이번 출입 관계 교정

원본 1호 라인 기준:

- 침실3: 동측 문 삭제 → 남측 우단, 침실 안으로 열림.
- 침실2: 서측 하단, 침실 안으로 열림.
- 욕실1: 서측 하단, 욕실 안으로 열림.
- 욕실2: 서측 문 삭제 → 남측, 침실1에서 진입하여 욕실 안으로 열림.
- 침실1: 북측 좌단, 침실 안으로 열림.
- 현관: 서측, 공용 전실 쪽으로 열림.
- 주방/식당: 거실과 개방, 독립 여닫이문 추가 없음.

문 기호의 위치/방향과 실제 mm 치수를 구별합니다. 모든 문 폭과 이격거리는 미실측 이미지 추정입니다. 상단의 불명확한 발코니 외측 구간에는 문/창 개구부를 추가하지 않고 점선 기준선만 둡니다. 내부 발코니 유리 경계는 기호 판독 후보이며 개폐 방식은 미확인입니다.

## 남은 확인

벽 치수선 기준(내측/외측/중심), 벽 두께, 각 문폭/이격거리, 상단 박스·단차, 하단 발코니 곡선, 창호/난간 상세, 원본과 2호 라인 사이의 대칭 이외 차이. 발코니 경계 복원은 원본 검증용이며 확장 공사 가능성/철거 가능성의 판단이 아닙니다.

## 검사

```sh
npm run check
npm test
```

좌표 두 번 반전 복원, 모든 문의 힌지/회전호 반전, 잘못된 문 제거 및 새 출입 관계, 표기 치수 합계, 입력 검증을 검사합니다. 정적 SVG 출력은 렌더링하여 원본과 대조했습니다. 브라우저 UI 자동 검사는 수행하지 않았습니다.

`make_config.py`와 `revise_plan.py`는 과거 작성 과정의 기록입니다. 현재 JSON 수정 후 재실행하면 덮어쓸 수 있으므로 기본 편집 수단으로 사용하지 마세요. UI에서 내보낸 `apartment.config.json`으로 dist의 같은 파일을 교체하면 다음 실행의 기본값이 됩니다.

## 공유 3D 검증

상단 `3D 바로 보기`로 이동합니다. 기본 카메라는 현관 밖 450mm, 눈높이 1600mm에서 집 안을 바라봅니다. `3D 전체 보기`는 드래그·확대가 가능하고 `현관 정면으로 복귀`로 돌아옵니다. 걷기는 PC 화면 클릭 후 WASD와 마우스를 사용합니다.

2D와 3D는 같은 config 객체를 전달받으며 좌표 편집 시 둘 다 갱신됩니다. 모든 wall/opening, room/floor/balcony polygon, labelPosition 및 local basis가 X=3975mm 축으로 반전되어 있습니다. 충돌은 같은 벽·문 geometry에서 파생합니다. 가구·재질·조명 설계 변경은 포함하지 않습니다.

`npm test`는 공통 geometry와 충돌 반전, 방 local 좌표, 현관 카메라 투영에서 거실의 좌측 위치를 검사합니다. 브라우저 화면/조작 검증은 미수행입니다.

## BASE_GEOMETRY_V1 — 기준 평면

`dist/BASE_GEOMETRY_V1.json`은 2026-09-07 원본 도면 overlay로 교정한 변경 금지 스냅샷입니다. `apartment.config.json`은 현재 작업본이며 최초에는 기준본과 같습니다. 이후 인테리어 설계는 이 기준본을 복제하고 `baseGeometryId`를 유지합니다. UI에서 벽·문·창을 수정하면 WORKING_COPY로 표시됩니다. 기준본 파일은 UI에서 덮어쓰지 않습니다.

교정 내역은 `calibration-report.json`, 도면 비교는 `calibration-overlay.png`를 참고합니다. 세로 표기 치수 체인에 따라 4800→4820, 9550→9555mm로 교정했습니다. 기존 창·현관문 폭과 상단 경계만 가시 기호에 맞췄으며 방/개구부를 새로 추가하지 않았습니다. 문/창의 폭·위치는 모두 ASSUMED이고, 벽 두께도 ASSUMED입니다. 단위 픽셀 약38.1mm, 육안 판독 ±2px(약76mm) 수준의 불확실성을 기록했습니다. 이 숫자는 측량 정확도나 통계적 오차 보증이 아닙니다. 도면의 표기 치수 기준면 및 발코니 곡면은 미확정입니다.

이 단계는 확장 전 도면 검증용 기준이며 실제 시공 확정 도면이 아닙니다. shared geometry와 2호라인 방향은 유지합니다.
