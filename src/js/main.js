/* main.js — 부트스트랩: 객체 생성, UI 연결, 게임 시작 */

window.addEventListener('DOMContentLoaded', () => {
  const renderer = new Renderer();
  const game = new Game(renderer);
  const bear = new JellyBear();   // 보드 뒤 젤리곰
  Sound.enabled = true;
  Sound.initBgm();   // 배경음(bgm.mp3) 준비

  // ----- DOM 참조 -----
  const $ = (id) => document.getElementById(id);
  const $score = $('score'), $lines = $('lines'), $level = $('level'), $high = $('high');
  const $overlay = $('overlay'), $overlayTitle = $('overlay-title'), $overlayText = $('overlay-text');
  const $startBtn = $('start');
  const $help = $('help'), $helpBtn = $('help-btn');
  const $muteBtn = $('mute-btn');
  const diffButtons = Array.from(document.querySelectorAll('[data-diff]'));

  // 버튼 라벨(상태별)
  const BTN_LABEL = {
    idle: '게임 시작', playing: '일시정지', paused: '계속하기',
    over: '다시 시작', counting: '...',
  };

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

    $startBtn.textContent = BTN_LABEL[s.phase];
    $startBtn.disabled = (s.phase === 'counting');

    // 난이도 버튼: 진행 중일 땐 잠금, 선택 표시
    const lockDiff = (s.phase === 'playing' || s.phase === 'paused' || s.phase === 'counting');
    diffButtons.forEach(b => {
      b.disabled = lockDiff;
      b.classList.toggle('active', b.dataset.diff === s.difficulty);
    });

    // 오버레이 (카운트다운은 onCountdown 이 따로 처리)
    if (s.phase === 'over') {
      $overlayTitle.textContent = 'GAME OVER';
      $overlayText.textContent = `점수 ${s.score.toLocaleString()}`;
      $overlay.classList.add('show');
    } else if (s.phase === 'paused') {
      $overlayTitle.textContent = 'PAUSED';
      $overlayText.textContent = 'P / ESC 로 계속';
      $overlay.classList.add('show');
    } else if (s.phase === 'idle') {
      $overlayTitle.textContent = 'GOMTRIS';
      $overlayText.textContent = '난이도를 고르고 시작하세요';
      $overlay.classList.add('show');
    } else if (s.phase === 'playing') {
      $overlay.classList.remove('show');
    }
  };

  // 카운트다운 표시
  game.onCountdown = (n) => {
    if (n === null) { $overlay.classList.remove('show'); return; }
    $overlayTitle.textContent = (n === 0) ? 'GO!' : String(n);
    $overlayText.textContent = '';
    $overlay.classList.add('show');
  };

  // ----- 이벤트 연결 -----
  bindInput(game, ui);
  bindTouch(game);   // 폰 손가락 제스처

  $startBtn.addEventListener('click', () => {
    const p = game.phase;
    if (p === 'idle' || p === 'over') game.start();
    else if (p === 'playing' || p === 'paused') game.togglePause();
  });

  diffButtons.forEach(b => {
    b.addEventListener('click', () => game.setDifficulty(b.dataset.diff));
  });

  if ($helpBtn) $helpBtn.addEventListener('click', () => ui.toggleHelp());
  if ($muteBtn) $muteBtn.addEventListener('click', () => ui.toggleMute());
  // 도움말 패널 클릭 시 닫기
  if ($help) $help.addEventListener('click', () => $help.classList.remove('show'));

  // 초기 렌더 (시작 전 빈 보드 + 타이틀)
  game._render();
});
