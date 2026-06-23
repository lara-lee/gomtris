/* jellybear.js — 보드 뒤를 걸어다니는 젤리곰 성장 시스템
 *  · 10줄마다 색 젤리가 날아와 곰 몸에 붙음 (색은 mix-blend 로 실제 섞임)
 *  · 50/80/100줄에서 외형 진화 (통통 → 왕 → 황제)
 *  · 카운터 = 한 판에서 지운 줄 수 (새 판이면 아기곰부터)
 */

// 10줄마다 추가되는 젤리 색 (최대 10개)
const BEAR_COLORS = [
  '#ff4d8d', '#ff6b6b', '#ff9f1c', '#ffe600', '#6eff00',
  '#00e0ff', '#7a5cff', '#ff5cc8', '#19e6a8', '#ff3b3b',
];

// 젤리가 곰 몸에 붙는 위치 (곰 박스 기준 %)
const BEAR_SPOTS = [
  { x: 32, y: 60 }, { x: 64, y: 56 }, { x: 48, y: 70 }, { x: 24, y: 46 }, { x: 72, y: 44 },
  { x: 50, y: 40 }, { x: 38, y: 78 }, { x: 64, y: 76 }, { x: 20, y: 66 }, { x: 80, y: 62 },
];

class JellyBear {
  constructor(stageId = 'bear-stage') {
    this.stage = document.getElementById(stageId);
    this.jellies = [];
    this.form = null;
    if (this.stage) this._build();
    this.reset();
  }

  _build() {
    this.stage.innerHTML = `
      <div class="bear-walker">
        <div class="bear-face">
          <div class="bear" id="bear">
            <div class="bear-ear left"></div>
            <div class="bear-ear right"></div>
            <div class="bear-arm left"></div>
            <div class="bear-arm right"></div>
            <div class="bear-leg left"></div>
            <div class="bear-leg right"></div>
            <div class="bear-body"></div>
            <div class="bear-head">
              <div class="bear-eye left"></div>
              <div class="bear-eye right"></div>
              <div class="bear-snout"></div>
            </div>
            <div class="jellies" id="jellies"></div>
            <div class="crown"></div>
          </div>
        </div>
      </div>`;
    this.bear = this.stage.querySelector('#bear');
    this.jelliesEl = this.stage.querySelector('#jellies');
  }

  reset() {
    this.jellies = [];
    this.form = null;
    if (this.jelliesEl) this.jelliesEl.innerHTML = '';
    this._setForm(0, true);
  }

  // 줄 수에 맞춰 곰 상태 갱신 (game 의 onState 에서 호출)
  update(lines) {
    if (!this.stage) return;
    const target = Math.min(BEAR_SPOTS.length, Math.floor(lines / 10));
    if (target < this.jellies.length) this.reset();   // 새 판 → 초기화
    while (this.jellies.length < target) this._addJelly();
    this._setForm(lines, false);
  }

  _addJelly() {
    const i = this.jellies.length;
    const color = BEAR_COLORS[i % BEAR_COLORS.length];
    const spot = BEAR_SPOTS[i];
    const j = document.createElement('div');
    j.className = 'jelly fly';
    j.style.setProperty('--c', color);
    j.style.setProperty('--fromx', (i % 2 === 0 ? -130 : 130) + 'px');
    j.style.left = spot.x + '%';
    j.style.top = spot.y + '%';
    this.jelliesEl.appendChild(j);
    this.jellies.push(color);
    if (typeof Sound !== 'undefined') Sound.play('jelly');
    setTimeout(() => j.classList.remove('fly'), 600);
  }

  _setForm(lines, silent) {
    let form = 'baby', scale = 1;
    if (lines >= 100)     { form = 'emperor'; scale = 2.3; }
    else if (lines >= 80) { form = 'king';    scale = 1.85; }
    else if (lines >= 50) { form = 'chubby';  scale = 1.4; }

    if (form === this.form) return;
    this.form = form;
    if (!this.bear) return;
    this.bear.dataset.form = form;
    this.bear.style.setProperty('--bear-scale', scale);

    if (!silent && form !== 'baby') {           // 진화 연출
      this.bear.classList.remove('pop');
      void this.bear.offsetWidth;               // 애니메이션 리스타트
      this.bear.classList.add('pop');
      if (typeof Sound !== 'undefined') Sound.play('evolve');
    }
  }
}
