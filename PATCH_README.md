# V7.6 Interior Stage 1 — yeoksam-update compatible

이 패치는 Astra가 만든 Stage 1 인테리어 패치를 우리 기존 `yeoksam-update` 방식에 맞게 재포장한 버전입니다.

## 중요한 차이
기존 Astra ZIP 이름은 `Yeoksam_V75_Interior_Stage1_Patch.zip`이어서,
현재 updater가 찾는 `yeoksam*.zip` 패턴과 맞지 않을 수 있습니다.
이 파일은 `yeoksam-v7.6-interior-stage1-patch.zip` 이름으로 재구성했습니다.

## 적용 방식
- 프로젝트 전체를 교체하지 않습니다.
- ZIP 내부의 동일 경로 파일만 기존 repo 위에 덮어씁니다.
- `git add/commit/push` 시 Git이 변경 파일만 수정으로 인식합니다.

## 포함 파일
- dist/index.html
- dist/interior.js
- dist/shared-3d.js
- dist/DESIGN_V1.json
- dist/design-layer.js
- docs/REFERENCE_1521.md
- tools/check-baseline-lock.mjs

## 주의
이 패치는 V7.5 baseline 위에 적용하는 Stage 1 디자인 레이어입니다.
baseline geometry, 확장, 중문, 터닝도어, 확정 문 위치는 수정하지 않습니다.

---
# V7.5용 인테리어 시안 1단계 패치

기준 커밋: 81f9035ac4737185c16acce0b76a357ba2f2cc14
이 ZIP은 전체 프로젝트가 아니라 변경 파일만 포함합니다.

## 적용
1. 현재 저장소를 백업하고, 위 기준 이후 동일 파일에 변경사항이 있다면 먼저 비교하세요.
2. ZIP을 풀어 나온 dist, docs, tools 폴더를 기존 프로젝트 루트의 같은 폴더에 합칩니다. 폴더 자체를 삭제하거나 교체하지 마세요.
3. 변경 파일을 GitHub에 업로드합니다. ZIP 자체만 올리면 앱에 적용되지 않습니다.
4. 앱을 새로고침하고 상단 '인테리어 시안'을 누릅니다. 거실 전체 / 거실 → 주방 / 현관 → 거실과 조명 비교를 사용할 수 있습니다.

## 포함 범위
흰색 3엽 실링팬, 천장형 에어컨 외부 패널, 다운라이트, 간접조명, 커튼박스, 시안 UI.
가구 디테일 모델, 실제 커튼 천, 욕실 재설계, 최종 고품질 렌더는 아직 포함하지 않습니다.
설비는 제안 배치이며 제품별 설치 이격·배관·매립 깊이 확인 전입니다.

## 검증 및 한계
- 구조/확장/고정 인테리어 JSON, plan-core.js, review.js: 기준 커밋 대비 바이트 동일 검사 통과.
- 변경 JavaScript 구문 검사 통과.
- 브라우저 화면·버튼·모바일 조작 검증은 미완료입니다.
- WebGL 미지원 환경의 기존 Canvas fallback은 재질/조명 표현이 제한됩니다.
- GitHub 커밋 및 배포는 수행하지 않았습니다.

검사: 프로젝트 루트에서 `node tools/check-baseline-lock.mjs`.
이 검사는 기준 커밋이 있는 Git 저장소에서 실행합니다.
