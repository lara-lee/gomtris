/* audio.js — 사운드 관리
 * · 효과음(SFX): 파일 없이 WebAudio 로 즉석 합성 (음원 파일 불필요)
 * · 배경음(BGM): assets/audio/bgm.mp3 한 개만 사용 (있으면 재생, 없으면 무음)
 * · M 키 / 버튼으로 음소거 토글
 */
const Sound = {
  enabled: true,
  ctx: null,

  // 효과음 합성 설정 [주파수Hz, 길이초, 파형]
  synth: {
    move:    [330, 0.03, 'square'],
    rotate:  [440, 0.04, 'square'],
    soft:    [220, 0.02, 'square'],
    hard:    [110, 0.09, 'sawtooth'],
    lock:    [180, 0.05, 'square'],
    clear:   [660, 0.16, 'triangle'],
    tetris:  [880, 0.30, 'triangle'],
    levelup: [990, 0.22, 'triangle'],
    hold:    [550, 0.05, 'sine'],
    gameover:[ 80, 0.60, 'sawtooth'],
    pause:   [400, 0.10, 'sine'],
    count:   [500, 0.10, 'square'],
    start:   [720, 0.16, 'triangle'],
    jelly:   [620, 0.14, 'sine'],     // 젤리가 곰에 붙을 때
    evolve:  [840, 0.35, 'triangle'], // 젤리곰 진화
  },

  // ===== 효과음 =====
  play(name) {
    if (!this.enabled) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = this.ctx || new AC();
      const [freq, dur, type] = this.synth[name] || [440, 0.05, 'square'];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      const t = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.07, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + dur);
    } catch (e) { /* 오디오 차단 환경이면 조용히 무시 */ }
  },

  // ===== 배경음 (assets/audio/bgm.mp3) =====
  bgm: null,
  _bgmWanted: false,

  initBgm() {
    try {
      this.bgm = new Audio('assets/audio/bgm.mp3');
      this.bgm.loop = true;
      this.bgm.volume = 0.35;
    } catch (e) { this.bgm = null; }
  },

  _applyBgm() {
    if (!this.bgm) return;
    if (this.enabled && this._bgmWanted) {
      const p = this.bgm.play();
      if (p && p.catch) p.catch(() => {});  // 파일 없거나 자동재생 차단 시 무시
    } else {
      this.bgm.pause();
    }
  },

  startBgm() {                    // 게임 시작: 처음부터
    if (!this.bgm) return;
    this._bgmWanted = true;
    try { this.bgm.currentTime = 0; } catch (e) {}
    this.setBgmRate(1);
    this._applyBgm();
  },
  resumeBgm() { this._bgmWanted = true; this._applyBgm(); },  // 이어서
  pauseBgm()  { this._bgmWanted = false; this._applyBgm(); }, // 일시정지
  stopBgm()   {                                               // 정지(되감기)
    this._bgmWanted = false;
    this._applyBgm();
    if (this.bgm) { try { this.bgm.currentTime = 0; } catch (e) {} }
  },
  setBgmRate(rate) { if (this.bgm) { try { this.bgm.playbackRate = rate; } catch (e) {} } },

  toggleMute() {
    this.enabled = !this.enabled;
    this._applyBgm();
    return this.enabled;
  },
};
