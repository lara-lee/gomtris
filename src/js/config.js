/* config.js — 게임 전역 상수 정의 */
const CONFIG = {
  COLS: 10,            // 게임판 가로 칸 수
  ROWS: 20,            // 게임판 세로 칸 수
  PREVIEW_SIZE: 4,     // NEXT / HOLD 미리보기 격자 크기 (4x4)

  // 레벨별 낙하 속도(ms): 레벨이 오를수록 빨라짐
  // gravity = BASE_DROP_MS - (level - 1) * STEP, 최소 MIN_DROP_MS
  BASE_DROP_MS: 800,
  STEP_DROP_MS: 70,
  MIN_DROP_MS: 80,

  LINES_PER_LEVEL: 10, // 몇 줄을 지우면 레벨업 하는지

  COUNTDOWN_FROM: 3,    // 시작 카운트다운 숫자
  LINE_CLEAR_MS: 280,   // 줄 제거 애니메이션 시간(ms)

  // 동시 제거 줄 수별 기본 점수 (레벨 n 을 곱함)
  SCORE_TABLE: { 1: 100, 2: 300, 3: 500, 4: 800 },
  HARD_DROP_BONUS: 2,  // 하드 드롭 시 내려간 칸 당 점수

  // 블록(테트로미노) → 곰 색(=gomimg/<색>.png). 줄을 지운 블록의 색 곰이 등장
  PIECE_BEAR: {
    I: 'blue', J: 'blue', O: 'yellow', T: 'pink', S: 'green', Z: 'orange', L: 'orange',
  },
  DEFAULT_BEAR: 'pink',   // 아직 줄을 못 지웠을 때 기본 곰

  STORAGE_KEY: 'tetris.highScore',
};
