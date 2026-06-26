/* board.js — 게임판 상태와 충돌/줄제거 로직 (렌더링과 분리) */

class Board {
  constructor(cols = CONFIG.COLS, rows = CONFIG.ROWS) {
    this.cols = cols;
    this.rows = rows;
    this.reset();
  }

  reset() {
    // 0 = 빈칸, 문자열('I','O'...) = 고정된 블록 색
    this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
  }

  // 주어진 회전 상태의 셀 좌표 목록 반환
  static cellsOf(piece, rotation = piece.rotation) {
    const shape = piece.shapes[rotation];
    const cells = [];
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) cells.push([r, c]);
      }
    }
    return cells;
  }

  // (offRow, offCol) 만큼 이동하고 rotation 을 적용했을 때 놓을 수 있는지
  isValid(piece, offRow = 0, offCol = 0, rotation = piece.rotation) {
    for (const [r, c] of Board.cellsOf(piece, rotation)) {
      const nr = piece.row + r + offRow;
      const nc = piece.col + c + offCol;
      if (nc < 0 || nc >= this.cols) return false;     // 좌우 벽
      if (nr >= this.rows) return false;               // 바닥
      if (nr >= 0 && this.grid[nr][nc] !== 0) return false; // 다른 블록
    }
    return true;
  }

  // 피스를 보드에 고정
  merge(piece) {
    for (const [r, c] of Board.cellsOf(piece)) {
      const nr = piece.row + r;
      const nc = piece.col + c;
      if (nr >= 0) this.grid[nr][nc] = piece.color;
    }
  }

  // 완성된(빈칸 없는) 줄의 인덱스 목록 반환
  getFullRows() {
    const rows = [];
    for (let r = 0; r < this.rows; r++) {
      if (this.grid[r].every(cell => cell !== 0)) rows.push(r);
    }
    return rows;
  }

  // 지정한 줄들을 제거하고 위 블록을 내림 (애니메이션 후 호출)
  removeRows(rowsToRemove) {
    const remove = new Set(rowsToRemove);
    this.grid = this.grid.filter((_, r) => !remove.has(r));
    while (this.grid.length < this.rows) {
      this.grid.unshift(Array(this.cols).fill(0));
    }
    return rowsToRemove.length;
  }

  // 피스가 바닥까지 내려갈 거리 (고스트 위치 계산용)
  dropDistance(piece) {
    let dist = 0;
    while (this.isValid(piece, dist + 1, 0)) dist++;
    return dist;
  }
}
