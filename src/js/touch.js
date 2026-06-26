/* touch.js — 폰에서 손가락 제스처로 조작
 *  · 좌우 드래그       → 칸 단위 이동
 *  · 짧게 탭            → 회전
 *  · 꾹 누르기(롱프레스) → 빨리 내리기(누르는 동안 계속)
 * (하단 버튼 패드는 보조 수단)
 */
function bindTouch(game) {
  const area = document.getElementById('board');
  if (!area) return;

  const STEP = 24;        // 좌우 이동 1칸 인정 픽셀
  const TAP_MS = 200;     // 탭(회전) 최대 시간
  const TAP_MOVE = 16;    // 탭 최대 이동량
  const HOLD_MS = 220;    // 이 시간 이상 누르면 '빨리 내리기' 시작
  const SOFT_EVERY = 55;  // 빨리 내리기 반복 간격(ms)

  let sx = 0, sy = 0, st = 0, lastX = 0;
  let moved = false;     // 좌우 이동했는지
  let softed = false;    // 빨리 내리기가 시작됐는지
  let holdTimer = null, softTimer = null;

  function stopSoft() {
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    if (softTimer) { clearInterval(softTimer); softTimer = null; }
  }

  area.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    sx = lastX = t.clientX;
    sy = t.clientY;
    st = Date.now();
    moved = false; softed = false;
    stopSoft();
    // 가만히 누르고 있으면 빨리 내리기 시작
    holdTimer = setTimeout(() => {
      softed = true;
      game.softDrop();
      softTimer = setInterval(() => game.softDrop(), SOFT_EVERY);
    }, HOLD_MS);
    e.preventDefault();
  }, { passive: false });

  area.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    // 좌우 이동 (옆으로 밀면 빨리 내리기 취소)
    const dx = t.clientX - lastX;
    if (Math.abs(dx) >= STEP) {
      game.move(dx > 0 ? 1 : -1);
      lastX = t.clientX;
      moved = true;
      stopSoft();
    }
    e.preventDefault();
  }, { passive: false });

  area.addEventListener('touchend', (e) => {
    stopSoft();
    const dt = Date.now() - st;
    const t = e.changedTouches[0];
    const totDx = t.clientX - sx, totDy = t.clientY - sy;

    // 짧게 톡 (이동·빨리내리기 없음) → 회전
    if (!moved && !softed && dt < TAP_MS &&
        Math.abs(totDx) < TAP_MOVE && Math.abs(totDy) < TAP_MOVE) {
      game.rotate(1);
    }
    e.preventDefault();
  }, { passive: false });

  area.addEventListener('touchcancel', stopSoft);
}
