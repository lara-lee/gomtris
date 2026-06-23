/* jellybear.js — 젤리곰 성장 + 박스/로밍 흐름
 *  · 1~8단계: MY GOM 박스 안에 (단계 오를수록 박스를 꽉 채움)
 *  · 9~11단계: 박스보다 커져서 박스를 나가 보드 뒤(포스터 여백)를 돌아다님
 *  · 색 = 2단계(10줄) 진입 시 그 블록 색으로 고정 (assets/gomimg/<색>.png)
 *  · 카운터 = 한 판에서 지운 줄 수
 */
const BEAR_STAGES = 11;
const IN_BOX_MAX = 8;                                  // 1~8 박스 / 9~11 로밍

function petWidth(stage) { return 52 + (stage - 1) * 8; }    // 박스 안: 52 ~ 108px
function roamWidth(stage) { return 140 + (stage - 9) * 22; } // 보드 뒤: 140 / 162 / 184px

class JellyBear {
  constructor(stageId = 'bear-stage') {
    this.stage = document.getElementById(stageId);   // 보드 뒤 로밍 레이어
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
    this.img = this.stage.querySelector('#bear-img');     // 로밍 곰
    this.walker = this.stage.querySelector('.bear-walker');
    this.petImg = document.getElementById('pet-img');     // 박스 곰
    this.petOut = document.getElementById('pet-out');     // "나갔어요" 표시
    this.gomNum = document.getElementById('gom');         // 단계 숫자 (N / 11)
  }

  // game 의 onState 에서 호출 (lines, 고정색)
  update(lines, color) {
    if (!this.stage || !this.img) return;
    const stage = Math.max(1, Math.min(BEAR_STAGES, Math.floor(lines / 10) + 1));

    if (color && color !== this.color) {       // 색 변경 (2단계 진입 시 1회)
      this.color = color;
      this.img.src = `assets/gomimg/${color}.png`;
      if (this.petImg) this.petImg.src = `assets/gomimg/${color}.png`;
      this._pop();
      if (typeof Sound !== 'undefined' && this.curStage !== null) Sound.play('jelly');
    }

    if (stage !== this.curStage) {             // 단계 변경
      const grew = this.curStage !== null && stage > this.curStage;
      this.curStage = stage;
      this._layout(stage);
      if (grew) { this._pop(); if (typeof Sound !== 'undefined' && stage >= BEAR_STAGES) Sound.play('evolve'); }
    }
  }

  // DEV 미리보기: 게임과 무관하게 특정 단계/색으로 강제 표시
  preview(stage, color) {
    this.color = color;
    this.curStage = stage;
    if (this.img) this.img.src = `assets/gomimg/${color}.png`;
    if (this.petImg) this.petImg.src = `assets/gomimg/${color}.png`;
    this._layout(stage);
    this._pop();
  }

  // 단계에 따라 박스/로밍 전환 + 크기 지정
  _layout(stage) {
    const inBox = stage <= IN_BOX_MAX;

    // 박스 안 곰 (1~8)
    if (this.petImg) {
      this.petImg.style.width = petWidth(stage) + 'px';
      this.petImg.style.display = inBox ? '' : 'none';
    }
    if (this.petOut) this.petOut.style.display = inBox ? 'none' : 'flex';

    // 보드 뒤 로밍 곰 (9~11) — 그 외엔 레이어 자체를 숨김
    this.stage.style.display = inBox ? 'none' : '';
    if (this.img) {
      this.img.style.width = roamWidth(stage) + 'px';
      this.img.dataset.stage = stage;
    }
    if (this.walker) this.walker.classList.toggle('roaming', !inBox);

    if (this.gomNum) this.gomNum.textContent = stage;
  }

  // 박스/로밍 중 보이는 곰을 통통 튀게
  _pop() {
    [this.img, this.petImg].forEach((el) => {
      if (!el) return;
      el.classList.remove('pop');
      void el.offsetWidth;
      el.classList.add('pop');
    });
  }
}
