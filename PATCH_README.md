# Yeoksam fixed-interior rendering correction V6.1

수정 범위:
- 워시타워 터닝도어 2D 방향/라벨 및 3D 표시 수정
- 안방 붙박이장 라벨 및 3D 표시 수정
- 페이지 최상단 버전 표시바 추가

변경하지 않음:
- BASE_GEOMETRY_V1.json
- INTERIOR_V2_SVG_EXPANSION.json
- 벽/문/창/방 크기
- 카메라
- 재질
- 기존 가구 및 가구 이동/회전/저장/내보내기 기능
- 주방 V1

구현 방식:
- 기존 3D 렌더러가 이미 지원하는 screenDoor / cabinet 타입을 재사용하여 최소 변경.
- 터닝도어 좌표는 z=1250, x=2750..4500 선으로 표시.
- 붙박이장은 x=0 측 벽을 따라 D600, z=6720..9955.
