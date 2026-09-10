# V8.24 — Sol 검토/병합용 재질 패치

상태: REVIEW CANDIDATE. GitHub main push/배포하지 않음. 실제 WebGL 전후 시각 검증 미완료.

## 기준과 병합 범위

- 저장소: oizhoto/Yeoksam-home-3d
- 기준 main: `c57742bed8efeb90008fade715fceb4f6a3ae80c` (V8.23)
- 사용자가 최신 V8.23 보존을 선택했으므로 이전 V7.9 요청을 V8.24로 구분했다.
- baseline V7.5, 확장, 모든 문/중문/터닝도어, DESIGN, 가구, 욕실·주방 상세, 카메라, 조명 배치는 그대로다.
- `dist/materials.js`만 재질 로직 변경. 다른 실행 파일은 버전/설명 문자열만 변경했다.
- 원본의 주방 모듈, 싱크 타공, 욕실2 수건 및 벽 1/2 기능을 유지한다.

## 실제 변경

| 대상 | 이전 | 이번 검토안 |
|---|---|---|
| 바닥 | 한 판 반복, 가는 색상 테두리, 테두리와 무관한 bump | 서로 다른 4판의 1620×650mm atlas, 각 판 810×325mm 유지; 이음선과 일치하는 color/height/roughness |
| 바닥 무늬 | 투명도가 낮은 점/곡선 | 연속적인 저대비 석재 입자·명도 변화, 큰 마블 vein 없음 |
| 벽지 | 작은 점 중심, bumpScale 0.25mm | seamless 회벽 얼룩과 다중 크기 입자; bumpScale 0.65mm, 저광택 유지 |
| 필름 | 벽지 bump 재사용 | 독립적인 고운 grain/roughness, bumpScale 0.10mm, 벽지보다 매끈한 반응 |
| roughness 계수 | 벽 .94 / 바닥 .76 / 필름 .62 | 벽 .96 / 바닥 .73 / 필름 .55; 각 map과 곱하여 적용 |

기존 기준색과 제품은 보존했다. 위 bumpScale은 셰이더 계수이며 제품의 실제 요철 높이를 실측한 값이 아니다. 바닥은 기존 정렬/방향/좌표를 유지하고 atlas 내부만 2×2로 나눴다. 줄눈은 1.1mm 중심부와 부드러운 경계 음영으로 표현하며 시공 상세 확정값이 아니다. 바닥 높이/mesh에는 변화가 없다.

욕실/현관/안방 발코니 바닥, 유리, 천장 재질은 기존 구현 그대로다. 필름 적용 대상을 새로 확대하지 않았다. normal map 추가 없이 bump와 roughness를 사용한다. anisotropy는 장치 한도와 8 중 작은 값이다.

## 출처와 정확도

기존 stage2에서 조사한 제품 정보와 기준색을 재사용했다. 제조사 PBR 자료나 측색 데이터로 주장하지 않는다.

- LX 제품: https://www.lxzin.com/zin/product/102541 — PR002-13 회벽/블랑 그레이.
- 동화 공식 제품 소개: https://www.youtube.com/shorts/QTGBn6mK468 — 그란데 판재 규격/제품 표현 참고.
- 영림 PX454-2는 기존 확정 선택을 유지했다. 별도 보정된 표면 scan을 확보하지 않았으므로 고운 석재 느낌의 절제된 procedural 표현이다.
- 세 제품 모두 실물 샘플과 실제 집 조명에서 최종 색상 확인 필요. 이번에는 새로운 제품 조사나 카메라 노출/조명 변경을 하지 않았다.

## 검증 결과

- `node tools/check-material-refinement.mjs`: PASS. 기준 커밋의 보호 대상 기존 파일 122개 byte-identical. shared-3d.js 전체는 APP_VERSION 한 줄만 변경; interior.js는 안내 문구만 변경; index.html은 버전/시간만 변경.
- BASE, 확장, DESIGN SHA256 불변 확인. 실제 Three.js material 생성, 비단색 map, 채널 정합, 판재 규격/UV repeat, 필름 독립 bump, 제외 바닥 검사 PASS.
- 변경 JS syntax 검사 PASS.
- 실제 브라우저: 2D 표시, 3D 전환, 시안 켜기, 거실→주방 카메라, 벽 1/2 버튼 호출을 확인했다. 전체 기능 회귀 검증을 의미하지 않는다.
- **WebGL은 Disabled라 Canvas3D fallback으로 실행됨. 이 fallback은 texture/bump/roughness를 표시하지 않는다. 실제 재질 효과/광택, 동일 카메라 전후 육안 비교 및 GPU 성능 검증은 미완료다.** Canvas 화면을 개선 증거로 제공하지 않았다.

## Sol에 전달할 병합 절차

1. ZIP을 별도 폴더에 푼다. 최신 저장소에 바로 덮어쓰지 않는다.
2. 최신 main의 PROJECT_STATE.md를 읽고 기준 커밋 이후 변경을 확인한다.
3. ZIP의 `tools/check-material-patch-target.mjs`를 저장소 root에서 실행한다. 이 검사는 쓰기 작업을 하지 않으며 변경 예정 파일의 원본 Git blob hash가 기준과 같은지 확인한다.
4. 모두 PASS일 때만 변경 파일을 적용한다. 하나라도 다르면 전체 파일을 덮어쓰지 말고 동봉된 변경 설명/별도 .patch를 기준으로 해당 hunk만 병합한다. 특히 shared-3d.js는 버전 한 줄 때문에 포함되었으므로 후속 3D 로직을 이전 것으로 되돌리면 안 된다.
5. main이 더 높은 버전이면 버전/시간/이력만 현재 규칙에 맞춰 새로 합친다. V8.24를 재사용하거나 이전 버전으로 내리지 않는다.
6. 적용 후 검사 스크립트를 실행한다. 기준 이후 합법적 변경이 있으면 byte 비교는 실패할 수 있으므로 병합 직전/직후의 geometry와 DESIGN 불변을 별도로 확인한다.
7. WebGL이 활성화된 동일 장치에서 이전/이후를 각각 실행하고 같은 창 크기, 같은 디자인 ON/OFF, 가구 상태, 주간 조명으로 비교한다. 기존 `거실 → 주방`, `거실 전체`, `현관 → 거실` 버튼을 각각 눌러 같은 프리셋으로 캡처한다. grain이 거칠거나 선이 강하면 materials.js의 계수만 조정한다.
8. 시각 검증 후 사용자가 최종 반영. 이 패치는 자동 적용·자동 배포 기능이 없다.

권장 commit: `V8.24: refine finish textures while preserving V8.23 interior`
