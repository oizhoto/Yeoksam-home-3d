# CHANGELOG

## V2_2026-09-08

- 장기 사용을 위해 설계 데이터와 웹앱 배포물을 분리.
- BASE / INTERIOR / WORKING / FURNITURE / MATERIALS / LIGHTING / ASSUMPTIONS 레이어 분리.
- 기준본 `BASE_GEOMETRY_V1_2026-09-07.json`을 immutable snapshot으로 보존.
- 현재 확장안 `INTERIOR_V1_2026-09-08.json` 생성/보존.
- 마감재/조명은 아직 설계하지 않았으므로 V0 빈 레이어 생성.
- 원본 도면과 calibration/비교 이미지를 `references/`로 분리.
- 유지보수 스크립트를 `tools/`로 분리하고 `npm run sync` 추가.
- `dist/`는 배포용 산출물로만 유지.

## V3_2026-09-08
- 원본/확장/도배·바닥/가구/완성안 단계 탭 추가
- INTERIOR_V1 전체 확장안 유지
- 디아망/나투스진 계열 마감 프리뷰 3종 추가 (실제품 품번 확정 전 후보)
- BASE_GEOMETRY_V1 변경 없음
