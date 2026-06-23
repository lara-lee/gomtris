/* touch.js — 폰에서 손가락 제스처로 조작
 *  · 좌우 드래그   → 칸 단위로 좌우 이동
 *  · 아래로 드래그 → 소프트 드롭(한 칸씩)
 *  · 아래로 빠르게 튕김(플릭) → 하드 드롭
 *  · 짧게 탭        → 회전
 *  · 길게 누름      → 홀드
 * (하단 버튼 패드는 그대로 보조 수단으로 유지)
 */
function bindTouch(game) {
  const area = document.getElementById('board');
  if (!area) return;

  const STEP = 22;          // 이동/드롭 1회로 인정할 픽셀 거리
  const TAP_MS = 220;       // 탭으로 인정할 최대 시간
  const TAP_MOVE = 14;      // 탭으로 인정할 최대 이동량
  const FLICK_MS = 250;     // 하드드롭 플릭 최대 시간
  const FLICK_DY = 70;      // 하드드롭으로 인정할 아래 이동량
  const HOLD_MS = 420;      // 길게 누름(홀드) 시간

  let sx = 0, sy = 0, st = 0;
  let lastX = 0, lastY = 0;
  let moved = false, holdTimer = null, didHold = false;

  const clearHold = () => { if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; } };

  area.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    sx = lastX = t.clientX;
    sy = lastY = t.clientY;
    st = Date.now();
    moved = false;
    didHold = false;
    clearHold();
    holdTimer = setTimeout(() => { game.hold(); didHold = true; }, HOLD_MS);
    e.preventDefault();
  }, { passive: false });

  area.addEventListener('touchmove', (e) => {
    const t = e.touches[0];

    // 좌우 이동
    const dx = t.clientX - lastX;
    if (Math.abs(dx) >= STEP) {
      game.move(dx > 0 ? 1 : -1);
      lastX = t.clientX;
      moved = true;
      clearHold();
    }
    // 아래로 소프트 드롭
    const dy = t.clientY - lastY;
    if (dy >= STEP) {
      game.softDrop();
      lastY = t.clientY;
      moved = true;
      clearHold();
    }
    e.preventDefault();
  }, { passive: false });

  area.addEventListener('touchend', (e) => {
    clearHold();
    if (didHold) { e.preventDefault(); return; }   // 이미 홀드 처리됨
    const dt = Date.now() - st;
    const t = e.changedTouches[0];
    const totDx = t.clientX - sx, totDy = t.clientY - sy;

    // 탭 → 회전
    if (!moved && dt < TAP_MS && Math.abs(totDx) < TAP_MOVE && Math.abs(totDy) < TAP_MOVE) {
      game.rotate(1);
    }
    // 아래로 빠른 플릭 → 하드 드롭
    else if (totDy > FLICK_DY && dt < FLICK_MS && totDy > Math.abs(totDx)) {
      game.hardDrop();
    }
    e.preventDefault();
  }, { passive: false });
}
