# 프로젝트 구조 · V2_2026-09-08

이 프로젝트는 **설계 데이터(data)** 와 **웹앱 배포물(dist)** 을 분리한다.

- `data/geometry/` : 변경 금지 기준 평면. BASE_GEOMETRY 스냅샷.
- `data/interior/` : 확장/벽체 등 인테리어 구조안.
- `data/working/` : 평면 검토 UI에서 수정 가능한 작업본.
- `data/furniture/` : 이동 가능한 가구/가전 레이어.
- `data/materials/` : 벽지·바닥·필름·도어 마감 레이어.
- `data/lighting/` : 조명·스위치·간접조명 레이어.
- `data/assumptions/` : 실측/구조 확인 전 가정과 미확정 사항.
- `references/` : 원본 평면, calibration, 정적 비교 이미지.
- `dist/` : 브라우저에서 바로 실행/배포하는 웹앱. 직접 설계 원본으로 취급하지 않는다.
- `tools/` : 생성·검증·동기화 스크립트.
- `archive/` : 과거 모델/이전 형상 보관.

## 버전 규칙

파일명은 `LAYER_Vn_YYYY-MM-DD.ext` 형식을 기본으로 한다.

예: `INTERIOR_V2_2026-10-15.json`

`BASE_GEOMETRY_V1_2026-09-07.json`은 기준본이므로 덮어쓰지 않는다. 새 실측 도면으로 기준을 갱신해야 할 때만 `BASE_GEOMETRY_V2_날짜.json`을 새로 만든다.

## 작업 흐름

1. `data/`에서 새 버전을 만든다.
2. `VERSION.json`의 현재 버전을 갱신한다.
3. `npm run sync`로 웹앱용 canonical 파일을 `dist/`에 복사한다.
4. `npm test`로 기준 geometry 보존과 2D/3D 관계를 검사한다.
5. `npm start`로 웹앱을 확인한다.

`dist/BASE_GEOMETRY_V1.json`, `dist/INTERIOR_V1.json` 같은 파일명은 앱 호환을 위한 canonical alias다. 장기 보관 기준은 날짜가 붙은 `data/` 파일이다.
