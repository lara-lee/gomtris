/* renderer.js — 게임판을 DOM 격자로 그림 (CSS 블록 스타일 사용) */

class Renderer {
  constructor() {
    this.boardEl = document.getElementById('board');
    this.cells = this._buildGrid(this.boardEl, CONFIG.COLS, CONFIG.ROWS);
  }

  // 격자 div 생성 후 셀 배열 반환
  _buildGrid(container, cols, rows) {
    container.style.setProperty('--cols', cols);
    container.style.setProperty('--rows', rows);
    const cells = [];
    for (let i = 0; i < cols * rows; i++) {
      const div = document.createElement('div');
      div.className = 'cell';
      container.appendChild(div);
      cells.push(div);
    }
    return cells;
  }

  _paint(cell, color, ghost = false) {
    cell.className = 'cell';
    if (color) {
      cell.classList.add('block', color);
      if (ghost) cell.classList.add('ghost');
    }
  }

  // 메인 보드 그리기: 고정 블록 + 고스트 + 현재 피스
  drawBoard(board, piece) {
    // 1) 고정된 블록
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        this._paint(this.cells[r * board.cols + c], board.grid[r][c] || null);
      }
    }
    if (!piece) return;

    // 2) 고스트(착지 위치 미리보기)
    const dist = board.dropDistance(piece);
    if (dist > 0) {
      for (const [r, c] of Board.cellsOf(piece)) {
        const nr = piece.row + r + dist, nc = piece.col + c;
        if (nr >= 0) this._paint(this.cells[nr * board.cols + nc], piece.color, true);
      }
    }

    // 3) 현재 피스
    for (const [r, c] of Board.cellsOf(piece)) {
      const nr = piece.row + r, nc = piece.col + c;
      if (nr >= 0) this._paint(this.cells[nr * board.cols + nc], piece.color);
    }
  }

  // 제거될 줄을 깜빡이게 (CSS 애니메이션) — 이후 drawBoard 가 클래스 초기화
  flashRows(rows) {
    for (const r of rows) {
      for (let c = 0; c < CONFIG.COLS; c++) {
        this.cells[r * CONFIG.COLS + c].classList.add('clearing');
      }
    }
  }
}
