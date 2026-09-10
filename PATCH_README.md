# V7.1 욕실문 overlay 검토 후보

이번 패치는 원본 geometry JSON 자체를 확정 수정하지 않습니다.
`review.js`에서만 욕실문 후보 좌표를 임시 적용해 원본 이미지 overlay와 다시 비교합니다.

욕실1:
- door-bath1
- start 3295 -> 3195
- width 650 유지
- hinge=end 유지
- swing=-90 유지
- 결과: 화면에서 약 100 mm 위로 이동

욕실2:
- door-bath2
- start 2550 -> 2450
- width 650 유지
- hinge start -> end
- swing 90 -> -90
- 결과: 화면에서 약 100 mm 오른쪽 이동 + 좌우반전

중요:
- main 확장안 geometry 및 V7.0 기본 인테리어는 건드리지 않음
- 검증 화면에 `DOOR_REVIEW_CANDIDATE_V7_1`이 표시됨
- 사용자가 overlay OK 확인 후 원본 geometry에 최종 반영 예정
