# V7.5 BASELINE LOCK PATCH

이 패치는 V7.4 overlay 검토 결과를 실제 geometry source에 확정 반영하고 baseline을 잠급니다.

변경:
- 침실2 문 start=1375 확정
- 욕실1 문 start=3195 확정
- 욕실2 문 start=2150, hinge=end, swing=-90 확정
- BASE / apartment.config / expansion에 동일하게 동기화
- review.js의 임시 runtime door override 제거
- PROJECT_STATE.md 추가
- geometry/확장/중문/터닝도어/확정 문은 사용자 명시 요청 없이는 수정 금지

이후 Astra/ChatGPT 모두 GitHub main + PROJECT_STATE.md를 기준으로 작업합니다.
