# 마감재 2단계 패치

적용 기준: GitHub main 304ac57b249fb4712d44b466eccbb7ab703cacee / V7.5 BASELINE LOCKED.

## 변경
- LX 디아망 PR002-13: 기존 회벽 색상맵을 유지하면서 중복 색상 곱을 제거. 회벽 미세요철은 0.25mm bump scale, roughness 0.94 및 변화 맵으로 표현.
- 동화 나투스진 그란데 이모션블랑: 판재 810×325mm. 기존 ExtrudeGeometry UV가 이미 m 단위인데 방 크기를 다시 곱하던 오류 수정. 방 간 패턴 원점/방향 동일. 바닥 bump는 0.18mm, roughness 0.76 및 변화 맵.
- 영림 루카화이트 PX454-2: 기존 밝은 필름톤 유지. 임의의 긴 대리석 선 대신 미세한 저대비 입자와 0.08mm 요철, roughness 0.62. 기존 문짝 대상만 유지하며 새로운 필름 대상을 추가하지 않음.
- 벽/문 BoxGeometry의 6개 면에 실제 면 크기 기반 반복을 각각 적용. 벽 250mm, 필름 400mm 텍스처 타일은 모델링 가정이며 제조사 반복 규격이 아님.
- 재질 설정은 materials.js의 MATERIAL_V1에 모음. 제조사 실측 PBR이나 색 보정된 스캔을 사용한 것은 아니며 디지털 근사임.

## 자료
- LX 공식 제품/견본: https://www.lxzin.com/zin/product/102541 — PR002-13, 회벽/블랑 그레이, 106cm×15.6m.
- 동화 공식 시공 소개: https://www.youtube.com/shorts/QTGBn6mK468 및 https://www.youtube.com/shorts/cOV4w2dFwYQ — 이모션블랑 325×810×7mm.
- 영림 공식 사이트 https://www.yl.co.kr 는 이번 조회에 실패. PX454-2 제품 지정과 기존 참조 색상을 유지하며 공식 광택/요철 수치로 주장하지 않음.

## 보존 및 검증
geometry/확장/문/중문/터닝도어, 가구, 천장, 조명 배치, 카메라, 기존 UI 파일 변경 없음.
욕실·현관·안방 발코니 별도 바닥 재질 유지. 욕실 설계나 타일 변경 없음.
`node tools/check-material-stage2.mjs` / JavaScript syntax 검사.
브라우저에서 2D, 3D, 시안 토글, 거실 시점, 조명 선택, 가구 편집 화면을 실행 확인.
이 검증 환경은 WebGL을 제공하지 않아 기존 Canvas3D 대체 렌더러로 실행됨. GPU texture/bump/roughness의 최종 시각 검증은 미완료이며 실물과 동일한 색감·광택을 보증하지 않음.

## ZIP 적용
yeoksam-v7.7-material-stage2-patch.zip은 변경된 파일만 저장소 root 기준 상대경로로 포함.
기존 폴더를 삭제하지 말고 동일 경로에 파일을 합쳐 덮어쓰기. 이전 버전 기준이므로 이후 같은 파일에 다른 수정이 있다면 먼저 diff 확인.
패치 버전 표시는 배포 버전이며 잠긴 baseline은 계속 V7.5.

## GitHub 반영 상태
연결 앱의 create-tree 요청이 403 Resource not accessible by integration으로 거절되어 원격 커밋은 생성되지 않음. ZIP을 직접 적용할 수 있음.
