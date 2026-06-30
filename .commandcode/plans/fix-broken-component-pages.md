# Fix: Broken Component Pages (Whitespace / Wrong Rendering)

## Root Causes Found

| Component | Issue | Root Cause |
|-----------|-------|------------|
| **QCarousel** | Whitespace | `modelValue: 1` (number) != slide `name="1"` (string) — Quasar strict comparison |
| **QVideo** | Whitespace | `src: ''` — empty iframe is invisible |
| **QKnob** | Not a knob | `color: ''` (no stroke), `showValue: 'true'` (string), no `size` |
| **QTooltip** | Floating detached | `anchor`/`self` from boundProps override hardcoded; `modelValue: 'true'` (string) may not open tooltip |
| **QBanner** | Whitespace | `modelValue: 'true'` extraneous (not a QBanner prop). Likely renders but perhaps `bg-primary` class not applied correctly |
| **QBreadcrumbs** | Whitespace | Unknown — may render fine, check screenshot |
| **QLinearProgress** | Whitespace | `size: '8px'` may be too thin for visible screenshot |
| **QOptionGroup** | Whitespace | `color: ''` — radio circles render but invisible against white bg |
| **QSkeleton** | Whitespace | Unknown — skeleton animation may be invisible in headless |

## Files to Modify

All files are under `packages/app/src/pages/`.

### 1. QCarouselPage.vue
- **Line**: `modelValue: 1` → `modelValue: '1'`
- **Why**: String `'1'` matches slide `name="1"`
- **Also**: Hardcode `swipeable: true` and `animated: true` as booleans instead of strings

### 2. QVideoPage.vue
- **Line**: `src: ''` → `src: 'https://www.youtube.com/embed/jNQXAC9IVRw'`
- **Why**: QVideo needs a src for the iframe to render at all
- **Note**: Test env has no network, but the iframe container renders at the correct ratio

### 3. QKnobPage.vue
- **Add**: `color: 'primary'` (visible colored arc)
- **Add**: `size: '120px'` (explicit size so it's not tiny)
- **Fix**: `showValue: 'true'` → `showValue: true` (boolean)

### 4. QTooltipPage.vue
- **Fix**: `modelValue: 'true'` → `modelValue: true` (boolean)
- **Key fix**: Strip `anchor`, `self`, and `offset` from boundProps by setting them to `''` in pageDefaults (empty string → coerced to undefined by boundProps computed). This lets the hardcoded `anchor="top middle"` `self="bottom middle"` on the `<q-tooltip>` element work correctly.
- **Fix**: Move explicit `target="true"` to pageDefaults so the tooltip targets the parent button.

### 5. QBannerPage.vue
- **Remove**: `modelValue: 'true'` from pageDefaults (not a QBanner prop)
- **Fix**: `rounded: 'true'` → `rounded: true` (boolean)

### 6. QBreadcrumbsPage.vue
- **No changes initially** — take a screenshot to verify. If blank, investigate CSS scoping.

### 7. QLinearProgressPage.vue
- **Fix**: `stripe: 'true'` → `stripe: true` (boolean)
- **Change**: `size: '8px'` → `size: '16px'` (better visible in screenshot)
- **Add**: `rounded: true` (visual polish for screenshot)

### 8. QOptionGroupPage.vue
- **Add**: `color: 'primary'` to pageDefaults

### 9. QSkeletonPage.vue
- **No changes initially** — take a screenshot. If skeleton animation renders oddly in headless, may need `animation: 'none'` or adding a darker background to the preview area.

## Verification

1. For each component, visit `/{slug}?style=md3` in a browser and observe the preview area
2. Run the test suite: `pnpm test` and check screenshot sizes are > 100 bytes
3. Inspect any remaining whitespace screenshots visually
4. Regression: verify QBtn, QBadge, QChip, QToggle still render correctly
