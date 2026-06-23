/* input.js — 키보드 / 터치 입력을 게임 동작에 연결 */

function bindInput(game, ui) {
  // ---- 키보드 ----
  const repeatable = new Set(['ArrowLeft', 'ArrowRight', 'ArrowDown']);
  window.addEventListener('keydown', (e) => {
    const handled = {
      ArrowLeft:  () => game.move(-1),
      ArrowRight: () => game.move(1),
      ArrowDown:  () => game.softDrop(),
      ArrowUp:    () => game.rotate(1),
      KeyZ:       () => game.rotate(-1),
      KeyX:       () => game.rotate(1),
      Space:      () => game.hardDrop(),
      KeyP:       () => game.togglePause(),
      Escape:     () => game.togglePause(),
      KeyR:       () => game.start(),              // 재시작
      KeyM:       () => ui && ui.toggleMute(),     // 음소거
      KeyH:       () => ui && ui.toggleHelp(),     // 도움말
      Slash:      () => ui && ui.toggleHelp(),     // ? 키
    }[e.code];
    if (!handled) return;
    if (e.repeat && !repeatable.has(e.key)) return; // 회전/드롭 연타 방지
    e.preventDefault();
    handled();
  });

  // 창 포커스 잃으면 자동 일시정지
  window.addEventListener('blur', () => game.pauseForBlur());

  // ---- 화면 버튼(모바일) ----
  const btn = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  };
  btn('btn-left', () => game.move(-1));
  btn('btn-right', () => game.move(1));
  btn('btn-down', () => game.softDrop());
  btn('btn-rotate', () => game.rotate(1));
  btn('btn-drop', () => game.hardDrop());
}
