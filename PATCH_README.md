# BASE 욕실2 문 보정 R1

이번 패치는 사용자의 명시적 요청으로 BASE 불변 규칙을 일시 해제하고,
원본 평면 overlay 검토 결과에 따라 욕실2 문 위치를 BASE 단계에서 보정합니다.

변경:
- `door-bath2` only
- `bed1-north` 벽 자체 위치/길이/두께는 유지
- start: 2820 -> 2550 mm
- width: 650 mm 유지
- hinge: start 유지
- swing: +90 유지
- 결과적으로 x=0측 벽과 문 개구부 끝 사이 약 600 mm 확보
- 실측값이 아니므로 ASSUMED / user-reviewed 상태 유지

동기화:
- `dist/BASE_GEOMETRY_V1.json`
- `dist/apartment.config.json`

변경하지 않음:
- 다른 벽/문/창
- 방 크기/폴리곤
- 확장 geometry
- 카메라
- 재질
- 가구/주방/중문/터닝도어/붙박이장
- 가구 저장/내보내기

주의:
- 메인 확장안의 욕실2 문은 이미 별도 보정 패치로 수정되어 있으므로 이번 패치는 BASE/검증 페이지를 같은 기준으로 맞추는 목적입니다.
