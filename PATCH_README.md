# V7.2 욕실문 overlay 검토 후보

이번 패치는 V7.1 검토안에서 욕실2 문 위치만 조금 더 오른쪽으로 조정합니다.
원본 geometry JSON 자체는 아직 확정 수정하지 않습니다.

욕실1:
- door-bath1
- start 3195 유지
- width 650 유지
- hinge=end 유지
- swing=-90 유지

욕실2:
- door-bath2
- start 2450 -> 2300
- width 650 유지
- hinge=end 유지
- swing=-90 유지
- 결과: V7.1 대비 화면에서 약 150 mm 더 오른쪽 이동

중요:
- main 확장안 geometry 및 V7.0 기본 인테리어는 건드리지 않음
- 검증 화면에 `DOOR_REVIEW_CANDIDATE_V7_2`가 표시됨
- overlay 확인 후 OK를 받으면 그때 원본 geometry에 최종 반영 예정
