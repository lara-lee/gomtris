/* game.js — 게임 상태/루프/규칙 총괄 */

class Game {
  constructor(renderer) {
    this.renderer = renderer;
    this.board = new Board();
    this.bag = new BagRandomizer();
    this.highScore = Number(localStorage.getItem(CONFIG.STORAGE_KEY) || 0);
    this.onState = () => {};     // HUD 갱신 콜백
    this.onCountdown = () => {};  // 카운트다운 표시 콜백
    this._tick = this._tick.bind(this);
    this._reset();
  }

  // 현재 진행 단계
  get phase() {
    if (this.over) return 'over';
    if (this.counting) return 'counting';
    if (this.paused) return 'paused';
    if (this.running) return 'playing';
    return 'idle';
  }

  _reset() {
    this.board.reset();
    this.bag = new BagRandomizer();
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.nextType = this.bag.next();
    this.over = false;
    this.paused = false;
    this.counting = false;
    this.clearing = false;
    this.running = false;
    this.dropAcc = 0;
    this.lastTime = 0;
    this._spawn();
  }

  // 시작: 리셋 후 카운트다운 → 플레이
  start() {
    this._reset();
    this._render();
    this._countdown(CONFIG.COUNTDOWN_FROM);
  }

  _countdown(n) {
    this.counting = true;
    if (n <= 0) {
      this.counting = false;
      this.running = true;
      this.lastTime = 0;
      this.onCountdown(null);
      Sound.play('start');
      Sound.startBgm();          // 배경음 시작
      this._updateBgmTempo();
      requestAnimationFrame(this._tick);
      this._render();
      return;
    }
    this.onCountdown(n);
    Sound.play('count');
    setTimeout(() => this._countdown(n - 1), 700);
  }

  // 레벨에 따라 배경음 템포 상승 (레벨 1 = 1.0배 → 최대 1.6배)
  _updateBgmTempo() {
    const rate = Math.min(1.6, 1 + (this.level - 1) * 0.05);
    Sound.setBgmRate(rate);
  }

  // 현재 낙하 간격(ms): 레벨이 오를수록 짧아짐
  get gravity() {
    return Math.max(
      CONFIG.MIN_DROP_MS,
      CONFIG.BASE_DROP_MS - (this.level - 1) * CONFIG.STEP_DROP_MS
    );
  }

  _spawn() {
    this.piece = createPiece(this.nextType);
    this.nextType = this.bag.next();
    if (!this.board.isValid(this.piece)) this._gameOver();
  }

  _gameOver() {
    this.over = true;
    this.running = false;
    Sound.stopBgm();
    Sound.play('gameover');
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem(CONFIG.STORAGE_KEY, String(this.score));
    }
    this._render();
  }

  // ===== 입력 동작 =====
  move(dir) {
    if (!this._playable()) return;
    if (this.board.isValid(this.piece, 0, dir)) {
      this.piece.col += dir;
      Sound.play('move');
      this._render();
    }
  }

  hardDrop() {
    if (!this._playable()) return;
    const dist = this.board.dropDistance(this.piece);
    this.piece.row += dist;
    this.score += dist * CONFIG.HARD_DROP_BONUS;
    Sound.play('hard');
    this._lock();
  }

  rotate(dir = 1) {
    if (!this._playable()) return;
    const next = (this.piece.rotation + dir + 4) % 4;
    for (const off of [0, -1, 1, -2, 2]) {  // 간단 월 킥
      if (this.board.isValid(this.piece, 0, off, next)) {
        this.piece.rotation = next;
        this.piece.col += off;
        Sound.play('rotate');
        this._render();
        return;
      }
    }
  }

  togglePause() {
    if (this.over || this.counting) return;
    this.paused = !this.paused;
    Sound.play('pause');
    if (this.paused) {
      Sound.pauseBgm();
    } else {
      Sound.resumeBgm();
      this.lastTime = 0;
      requestAnimationFrame(this._tick);
    }
    this._render();
  }

  // 게임 나가기 → 타이틀(시작 화면)로, 소리 정지
  quit() {
    Sound.stopBgm();
    this._reset();     // 보드 초기화 + idle 상태
    this._render();
  }

  // 창 포커스를 잃으면 자동 일시정지
  pauseForBlur() {
    if (this.running && !this.paused && !this.over && !this.counting) {
      this.paused = true;
      Sound.pauseBgm();
      this._render();
    }
  }

  _playable() { return this.running && !this.paused && !this.over && !this.clearing; }

  // 피스 고정 → (줄제거 애니메이션) → 점수/레벨 → 새 피스
  _lock() {
    this.board.merge(this.piece);
    Sound.play('lock');
    const full = this.board.getFullRows();

    if (full.length === 0) {
      this._spawn();
      this._render();
      return;
    }

    // 줄 제거 애니메이션 동안 입력/중력 정지
    this.piece = null;
    this.clearing = true;
    this._render();                 // 합쳐진 보드 표시
    this.renderer.flashRows(full);  // 깜빡임
    Sound.play(full.length >= 4 ? 'tetris' : 'clear');

    setTimeout(() => {
      this.board.removeRows(full);
      const cleared = full.length;
      this.score += (CONFIG.SCORE_TABLE[cleared] || 0) * this.level;
      this.lines += cleared;
      const newLevel = Math.floor(this.lines / CONFIG.LINES_PER_LEVEL) + 1;
      if (newLevel > this.level) { this.level = newLevel; Sound.play('levelup'); this._updateBgmTempo(); }
      this.clearing = false;
      this._spawn();
      this._render();
    }, CONFIG.LINE_CLEAR_MS);
  }

  // ===== 메인 루프 =====
  _tick(time) {
    if (!this.running || this.paused || this.over) return;
    if (this.clearing) { requestAnimationFrame(this._tick); return; } // 애니 중 대기
    if (!this.lastTime) this.lastTime = time;
    const delta = time - this.lastTime;
    this.lastTime = time;
    this.dropAcc += delta;
    if (this.dropAcc >= this.gravity) {
      this.dropAcc = 0;
      if (this.board.isValid(this.piece, 1, 0)) { this.piece.row++; this._render(); }
      else { this._lock(); }
    }
    requestAnimationFrame(this._tick);
  }

  _render() {
    this.renderer.drawBoard(this.board, (this.over || this.clearing) ? null : this.piece);
    this.onState({
      score: this.score,
      lines: this.lines,
      level: this.level,
      highScore: this.highScore,
      phase: this.phase,
    });
  }
}
