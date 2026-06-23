/* main.js — 부트스트랩: 객체 생성, UI 연결, 게임 시작 */

window.addEventListener('DOMContentLoaded', () => {
  const renderer = new Renderer();
  const game = new Game(renderer);
  const bear = new JellyBear();   // 보드 뒤 젤리곰
  Sound.enabled = true;
  Sound.initBgm();   // 배경음(bgm.mp3) 준비

  // ----- DOM 참조 -----
  const $ = (id) => document.getElementById(id);
  const $score = $('score'), $lines = $('lines'), $level = $('level'), $high = $('high'), $gom = $('gom');
  const $overlay = $('overlay'), $overlayTitle = $('overlay-title'), $overlayText = $('overlay-text');
  const $startBtn = $('start');
  const $pauseBtn = $('pause-btn');
  const $help = $('help'), $helpBtn = $('help-btn');
  const $muteBtn = $('mute-btn');

  // 시작 버튼 라벨(상태별)
  const BTN_LABEL = { idle: '게임 시작', paused: '계속하기', over: '다시 시작' };

  // ----- UI 헬퍼 (input.js 에 전달) -----
  const ui = {
    toggleHelp() { $help.classList.toggle('show'); },
    toggleMute() {
      const on = Sound.toggleMute();
      $muteBtn.textContent = on ? '🔊 소리 켬' : '🔇 소리 끔';
      $muteBtn.classList.toggle('off', !on);
    },
  };

  // ----- 상태 → 화면 -----
  game.onState = (s) => {
    $score.textContent = s.score.toLocaleString();
    $lines.textContent = s.lines;
    $level.textContent = s.level;
    $high.textContent = s.highScore.toLocaleString();

    bear.update(s.lines);   // 젤리곰 성장 갱신
    const gomStage = Math.min(11, Math.floor(s.lines / 10) + 1);
    $gom.innerHTML = gomStage + '<span class="gom-max"> / 11</span>';

    // 일시정지 버튼은 플레이 중에만 활성
    $pauseBtn.disabled = (s.phase !== 'playing' && s.phase !== 'paused');
    $pauseBtn.textContent = (s.phase === 'paused') ? '▶ 계속' : '⏸ 일시정지';

    // 시작 버튼은 오버레이 안에서만 (idle/paused/over 일 때 표시)
    if (s.phase === 'over') {
      $overlayTitle.textContent = 'GAME OVER';
      $overlayText.textContent = `점수 ${s.score.toLocaleString()}`;
      $startBtn.textContent = BTN_LABEL.over;
      $startBtn.style.display = '';
      $overlay.classList.add('show');
    } else if (s.phase === 'paused') {
      $overlayTitle.textContent = 'PAUSED';
      $overlayText.textContent = '잠시 멈춤';
      $startBtn.textContent = BTN_LABEL.paused;
      $startBtn.style.display = '';
      $overlay.classList.add('show');
    } else if (s.phase === 'idle') {
      $overlayTitle.textContent = 'GOMTRIS';
      $overlayText.textContent = '게임을 시작하세요';
      $startBtn.textContent = BTN_LABEL.idle;
      $startBtn.style.display = '';
      $overlay.classList.add('show');
    } else if (s.phase === 'playing') {
      $overlay.classList.remove('show');
    }
    // counting 은 onCountdown 이 처리
  };

  // 카운트다운 표시 (시작 버튼 숨김, 큰 숫자만)
  game.onCountdown = (n) => {
    if (n === null) { $overlay.classList.remove('show'); return; }
    $overlayTitle.textContent = (n === 0) ? 'GO!' : String(n);
    $overlayText.textContent = '';
    $startBtn.style.display = 'none';
    $overlay.classList.add('show');
  };

  // ----- 이벤트 연결 -----
  bindInput(game, ui);
  bindTouch(game);   // 폰 손가락 제스처

  $startBtn.addEventListener('click', () => {
    const p = game.phase;
    if (p === 'idle' || p === 'over') game.start();
    else if (p === 'paused') game.togglePause();
  });
  $pauseBtn.addEventListener('click', () => game.togglePause());

  if ($helpBtn) $helpBtn.addEventListener('click', () => ui.toggleHelp());
  if ($muteBtn) $muteBtn.addEventListener('click', () => ui.toggleMute());
  if ($help) $help.addEventListener('click', () => $help.classList.remove('show'));

  // 초기 렌더 (시작 전 빈 보드 + 타이틀)
  game._render();
});
