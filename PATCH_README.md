# V7.0 Main-page cleanup

이번 패치는 현재 실제 배포된 V6.1 기준으로 다시 만든 통합 패치입니다.

반영:
1. 세탁실 터닝도어
- 잘못된 가로선 제거
- 구조체 코너 x=4550,z=1250에서 위쪽/외측 z=0 방향으로 세로 배치
- position [4550,0,625]
- size [50,2200,1250]

2. 욕실문
- 이번 패치에서는 건드리지 않음
- 사용자가 한 번 더 위치를 확인한 뒤 원본/검증 geometry에 반영 예정

3. 메인페이지 소스 최소화
- 메인 geometry: INTERIOR_V2_SVG_EXPANSION.json
- 기본 고정 인테리어: FIXED_INTERIOR_V1.json
- 가구: FURNITURE_V1.json
- 기존 ENTRY_INTERIOR_V1.json / KITCHEN_V1.json은 메인페이지가 더 이상 읽지 않음

4. 메인페이지 기본 적용
- 현관 중문: 항상 ON
- 세탁실 터닝도어: 항상 ON
- 안방 붙박이장: 항상 ON
- 주방: 항상 ON
- 레이어 버튼은 '가구' 하나만 남김
- 완성안/원본/중문/주방 버튼 제거
- 2D/3D/워크스루/저장은 보기 기능이므로 유지

5. 가구 조작
- 가구 ON 시 이동/회전 패널이 2D 도면 아래에 표시
- 기존 localStorage 저장 및 JSON 내보내기 로직 유지

버전: V7.0
