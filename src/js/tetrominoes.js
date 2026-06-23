/* tetrominoes.js — 7가지 블록 정의 + 7-Bag 랜덤 생성기 */

// 각 블록의 회전 상태별 좌표 행렬 (1 = 채워진 칸)
const TETROMINOES = {
  I: {
    color: 'I',
    shapes: [
      [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
      [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
      [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
      [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
    ],
  },
  O: {
    color: 'O',
    shapes: [
      [[1,1],[1,1]],
      [[1,1],[1,1]],
      [[1,1],[1,1]],
      [[1,1],[1,1]],
    ],
  },
  T: {
    color: 'T',
    shapes: [
      [[0,1,0],[1,1,1],[0,0,0]],
      [[0,1,0],[0,1,1],[0,1,0]],
      [[0,0,0],[1,1,1],[0,1,0]],
      [[0,1,0],[1,1,0],[0,1,0]],
    ],
  },
  S: {
    color: 'S',
    shapes: [
      [[0,1,1],[1,1,0],[0,0,0]],
      [[0,1,0],[0,1,1],[0,0,1]],
      [[0,0,0],[0,1,1],[1,1,0]],
      [[1,0,0],[1,1,0],[0,1,0]],
    ],
  },
  Z: {
    color: 'Z',
    shapes: [
      [[1,1,0],[0,1,1],[0,0,0]],
      [[0,0,1],[0,1,1],[0,1,0]],
      [[0,0,0],[1,1,0],[0,1,1]],
      [[0,1,0],[1,1,0],[1,0,0]],
    ],
  },
  J: {
    color: 'J',
    shapes: [
      [[1,0,0],[1,1,1],[0,0,0]],
      [[0,1,1],[0,1,0],[0,1,0]],
      [[0,0,0],[1,1,1],[0,0,1]],
      [[0,1,0],[0,1,0],[1,1,0]],
    ],
  },
  L: {
    color: 'L',
    shapes: [
      [[0,0,1],[1,1,1],[0,0,0]],
      [[0,1,0],[0,1,0],[0,1,1]],
      [[0,0,0],[1,1,1],[1,0,0]],
      [[1,1,0],[0,1,0],[0,1,0]],
    ],
  },
};

const TYPES = Object.keys(TETROMINOES);

/* 7-Bag 랜덤: 7종을 한 묶음으로 섞어 차례로 꺼냄 → 분포가 고름 */
class BagRandomizer {
  constructor() { this.bag = []; }

  _refill() {
    this.bag = TYPES.slice();
    for (let i = this.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
    }
  }

  next() {
    if (this.bag.length === 0) this._refill();
    return this.bag.pop();
  }
}

/* 새 블록(피스) 생성: 보드 상단 중앙에 배치 */
function createPiece(type) {
  const def = TETROMINOES[type];
  const size = def.shapes[0].length;
  return {
    type,
    color: def.color,
    rotation: 0,
    shapes: def.shapes,
    // 상단 중앙 정렬 (CONFIG 사용)
    row: 0,
    col: Math.floor((CONFIG.COLS - size) / 2),
  };
}
