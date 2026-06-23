/* jellybear.js — 보드 밖(포스터 여백)을 돌아다니는 젤리곰 성장 시스템
 *  · 단계 = floor(지운 줄 / 10) + 1, 1~11단계
 *  · 단계마다 색이 바뀌고 점점 커짐. 11단계는 주황 히어로곰(gom1) + 글로우
 *  · 카운터 = 한 판에서 지운 줄 수 (새 판이면 1단계부터)
 */
const BEAR_STAGES = 11;
const BEAR_CYCLE = ['white', 'pink', 'yellow', 'green', 'blue']; // 1~10단계 순환 색
const BEAR_FINAL = 'gom1';                                       // 11단계 = 주황 히어로곰

function bearImageFor(stage) {
  return stage >= BEAR_STAGES ? BEAR_FINAL : BEAR_CYCLE[(stage - 1) % BEAR_CYCLE.length];
}

class JellyBear {
  constructor(stageId = 'bear-stage') {
    this.stage = document.getElementById(stageId);
    this.cur = null;
    if (this.stage) this._build();
    this.reset();
  }

  _build() {
    this.stage.innerHTML = `
      <div class="bear-walker">
        <div class="bear-face">
          <img id="bear-img" class="bear" alt="gom" />
        </div>
      </div>`;
    this.img = this.stage.querySelector('#bear-img');
  }

  reset() { this.cur = null; this._setStage(1, true); }

  // 줄 수 → 곰 단계 갱신 (game 의 onState 에서 호출)
  update(lines) {
    if (!this.stage) return;
    const stage = Math.max(1, Math.min(BEAR_STAGES, Math.floor(lines / 10) + 1));
    this._setStage(stage, false);
  }

  _setStage(stage, silent) {
    if (stage === this.cur) return;
    const grew = this.cur !== null && stage > this.cur;
    this.cur = stage;
    if (!this.img) return;

    this.img.src = `gomimg/${bearImageFor(stage)}.png`;
    this.img.dataset.stage = stage;
    // 1단계 작게 → 11단계 크게
    this.img.style.width = (34 + (stage - 1) * 8) + 'px';

    if (grew && !silent) {                        // 성장 연출
      this.img.classList.remove('pop');
      void this.img.offsetWidth;                  // 애니메이션 리스타트
      this.img.classList.add('pop');
      if (typeof Sound !== 'undefined') Sound.play(stage >= BEAR_STAGES ? 'evolve' : 'jelly');
    }
  }
}
