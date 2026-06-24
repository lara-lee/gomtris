/* touch.js — 폰에서 손가락 제스처로 조작 (방향으로 명확히 구분)
 *  · 좌우 드래그   → 칸 단위로 좌우 이동
 *  · 아래로 밀기    → 드롭(바닥까지 한 번에)
 *  · 짧게 탭        → 회전
 * (하단 버튼 패드는 보조 수단)
 */
function bindTouch(game) {
  const area = document.getElementById('board');
  if (!area) return;

  const STEP = 24;       // 좌우 이동 1칸으로 인정할 픽셀 거리
  const TAP_MS = 250;    // 탭(회전)으로 인정할 최대 시간
  const TAP_MOVE = 16;   // 탭으로 인정할 최대 이동량
  const DROP_DY = 46;    // 아래로 밀어 드롭으로 인정할 거리

  let sx = 0, sy = 0, st = 0;
  let lastX = 0;
  let moved = false;     // 좌우로 이동했는지
  let dropped = false;   // 이번 터치에서 이미 드롭했는지

  area.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    sx = lastX = t.clientX;
    sy = t.clientY;
    st = Date.now();
    moved = false;
    dropped = false;
    e.preventDefault();
  }, { passive: false });

  area.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    // 좌우 이동 (칸 단위)
    const dx = t.clientX - lastX;
    if (Math.abs(dx) >= STEP) {
      game.move(dx > 0 ? 1 : -1);
      lastX = t.clientX;
      moved = true;
    }
    // 아래로 충분히 밀면 → 드롭 (한 번만)
    const totDy = t.clientY - sy;
    if (!dropped && totDy >= DROP_DY && totDy > Math.abs(t.clientX - sx)) {
      game.hardDrop();
      dropped = true;
      moved = true;
    }
    e.preventDefault();
  }, { passive: false });

  area.addEventListener('touchend', (e) => {
    if (dropped) { e.preventDefault(); return; }
    const dt = Date.now() - st;
    const t = e.changedTouches[0];
    const totDx = t.clientX - sx, totDy = t.clientY - sy;

    // 거의 안 움직인 짧은 터치 → 회전
    if (!moved && dt < TAP_MS && Math.abs(totDx) < TAP_MOVE && Math.abs(totDy) < TAP_MOVE) {
      game.rotate(1);
    }
    e.preventDefault();
  }, { passive: false });
}
