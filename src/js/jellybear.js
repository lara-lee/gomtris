/* jellybear.js — 보드 밖(포스터 여백)을 돌아다니는 젤리곰
 *  · 색 = 2단계(10줄) 진입 시 그 블록 색으로 고정 (assets/gomimg/<색>.png)
 *  · 크기 = 곰 단계( floor(줄/10)+1, 1~11 ) → 1단계 작게 ~ 11단계 크게
 *  · 카운터 = 한 판에서 지운 줄 수 (새 판이면 1단계·기본색)
 */
const BEAR_STAGES = 11;

class JellyBear {
  constructor(stageId = 'bear-stage') {
    this.stage = document.getElementById(stageId);
    this.color = null;
    this.curStage = null;
    if (this.stage) this._build();
  }

  _build() {
    this.stage.innerHTML = `
      <div class="bear-walker">
        <div class="bear-face">
          <img id="bear-img" class="bear" alt="gom" />
        </div>
      </div>`;
    this.img = this.stage.querySelector('#bear-img');
    this.walker = this.stage.querySelector('.bear-walker');
    this.petImg = document.getElementById('pet-img');     // 펫 박스(My Gom)
    this.petStage = document.getElementById('pet-stage');
  }

  // game 의 onState 에서 매 갱신마다 호출 (lines, 블록색)
  update(lines, color) {
    if (!this.stage || !this.img) return;
    const stage = Math.max(1, Math.min(BEAR_STAGES, Math.floor(lines / 10) + 1));

    // 색 바뀜 → 그 색 곰을 띄움(팝)
    if (color && color !== this.color) {
      this.color = color;
      this.img.src = `assets/gomimg/${color}.png`;
      this._pop();
      if (typeof Sound !== 'undefined' && this.curStage !== null) Sound.play('jelly');
    }
    // 단계(크기) 바뀜
    if (stage !== this.curStage) {
      const grew = this.curStage !== null && stage > this.curStage;
      this.curStage = stage;
      this.img.dataset.stage = stage;
      this.img.style.width = (34 + (stage - 1) * 8) + 'px';   // 34px ~ 114px
      // 9단계 이상에서만 돌아다님 (그 외엔 고정 — 정신없음 방지)
      if (this.walker) this.walker.classList.toggle('roaming', stage >= 9);
      if (grew) { this._pop(); if (typeof Sound !== 'undefined' && stage >= BEAR_STAGES) Sound.play('evolve'); }
    }
    this._updatePet(stage, this.color || 'white');
  }

  // DEV 미리보기: 게임과 무관하게 특정 단계/색 곰을 강제로 표시
  preview(stage, color) {
    if (!this.img) return;
    this.color = color;
    this.curStage = stage;
    this.img.src = `assets/gomimg/${color}.png`;
    this.img.dataset.stage = stage;
    this.img.style.width = (34 + (stage - 1) * 8) + 'px';
    if (this.walker) this.walker.classList.toggle('roaming', stage >= 9);
    this._pop();
    this._updatePet(stage, color);
  }

  // 펫 박스(My Gom) 동기화
  _updatePet(stage, color) {
    if (this.petImg) {
      this.petImg.src = `assets/gomimg/${color}.png`;
      this.petImg.style.width = (30 + (stage - 1) * 4.5) + 'px';   // 박스 안에서도 점점 커짐
    }
    if (this.petStage) this.petStage.textContent = stage + '단계';
  }

  _pop() {
    this.img.classList.remove('pop');
    void this.img.offsetWidth;   // 애니메이션 리스타트
    this.img.classList.add('pop');
  }
}
