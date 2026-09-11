# V8.25 — Reference Built-ins / Bath Detail

Reference: https://contents.ohou.se/projects/191168

## Source-supported
The published project text explicitly supports:
- 24평 역삼푸르지오
- 현관의 밝은 베이지 톤
- 우측 오픈 수납 / 좌측 대형 수납 취지
- 주방 한샘 무드베이지
- 욕실 크리미한 색감의 타일
- 미니멀하고 통일성 있는 마감/가구 색상

## User direction
- Reference look is preferred broadly.
- DO NOT copy the reference L-shaped kitchen; keep the current straight kitchen.
- DO NOT change lighting in this patch.
- Bring the bathroom toilet/basin/ledge feel, upper/lower cabinet style, entry style and built-in wardrobe detail into the existing model.

## Implementation
- Existing V7.5 wall/door/expansion geometry is untouched.
- Existing fixed object envelopes/locations remain.
- Detail is added as a 3D overlay in `BATHROOM_KITCHEN_V1.referenceDetails`.
- Kitchen lower/upper fronts receive flat Mood-Beige panels, shadow reveals, drawer split and toe-kick.
- Master wardrobe receives 5 slab fronts, narrow seams, plinth and ceiling filler.
- Entry cabinet receives warm beige slab fronts and a stronger open-niche expression.
- Bathroom fixture placement is preserved, while fixture/cabinet geometry is visually refined.

## Important limitation
Exact fixture product models, exact cabinet door widths and exact finish values are not stated in the public text. Those portions are approximations based on the visual reference and the existing Yeoksam model envelope.
