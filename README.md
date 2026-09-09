# 역삼푸르지오 24평 2호라인 Digital Twin

**현재 패키지: V2_2026-09-08**

장기 인테리어 설계를 위해 데이터와 웹앱을 분리한 버전입니다. 핵심 기준본은 `data/geometry/BASE_GEOMETRY_V1_2026-09-07.json`, 현재 확장 검토안은 `data/interior/INTERIOR_V1_2026-09-08.json`입니다.

`BASE_GEOMETRY_V1`은 원본 도면 기반의 변경 금지 기준본이며 실측/구조도 확정본은 아닙니다. `INTERIOR_V1`은 발코니 1·2·3을 실내 전환한 개념안이고 철거 가능 여부 미확인 구조는 `STRUCTURE_UNCONFIRMED`로 유지합니다.

## 폴더

- `data/` — 장기 보관할 설계 원본(source of truth)
- `dist/` — 현재 웹앱 실행/배포본
- `references/` — 원본 도면, calibration, 비교 이미지
- `tools/` — 생성/검증/동기화 도구
- `archive/` — 이전 버전/과거 자료
- `docs/` — 구조 설명, 변경 기록, 기존 README

상세 구조는 `docs/PROJECT_STRUCTURE.md`를 참고하세요.

## 실행

```sh
npm run sync
npm test
npm start
```

브라우저에서 `http://localhost:8000`을 엽니다.

## 현재 설계 레이어

- BASE geometry: `V1_2026-09-07`
- INTERIOR: `V1_2026-09-08`
- FURNITURE: `V0_2026-09-08`
- MATERIALS: `V0_2026-09-08`
- LIGHTING: `V0_2026-09-08`

다음 변경부터는 기존 날짜 파일을 덮어쓰지 않고 새 버전/날짜 파일을 추가하는 방식으로 관리합니다.
