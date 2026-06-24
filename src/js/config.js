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

  // 블록(테트로미노) → 곰 색(=assets/gomimg/<색>.png). 2단계 진입 시 그 색으로 고정
  PIECE_BEAR: {
    I: 'blue', J: 'blue', O: 'yellow', T: 'pink', S: 'green', Z: 'orange', L: 'orange',
  },
  DEFAULT_BEAR: 'white',  // 아직 줄을 못 지웠을 때 기본 곰 (하얀곰)

  // 젤리곰: 1줄 제거 = 곰 1개. 이 개수마다 "오늘의 말" 포춘 등장
  GOM_PER_FORTUNE: 10,
  GOM_COLORS: ['pink', 'orange', 'yellow', 'green', 'blue', 'white'],
  FORTUNES: [
    '오늘 당신에게 행운이 가득할 거예요 🍀',
    '작은 노력이 큰 결과를 만들어요',
    '잠깐 쉬어가도 괜찮아요 ☕',
    '당신은 생각보다 훨씬 잘하고 있어요',
    '좋은 일이 곧 찾아올 거예요 ✨',
    '오늘도 웃는 하루 되세요 😊',
    '실수해도 괜찮아요, 다시 하면 되니까',
    '오늘의 행운 숫자는 7 이에요',
    '가까운 사람에게 안부를 전해보세요',
    '한 줄 한 줄, 차근차근 가면 돼요',
    '포기하지 않는 당신이 멋져요 🐻',
    '달콤한 간식이 필요한 날이에요 🍪',
    '깊게 숨 한 번 쉬어볼까요?',
    '오늘 만난 사람에게 친절을 베풀어요',
    '당신의 하루를 곰돌이가 응원해요!',
    '서두르지 않아도 괜찮아요',
    '지금 이 순간을 즐겨요 🎮',
    '곧 행운의 4줄(테트리스)이 터질 거예요!',
  ],

  STORAGE_KEY: 'tetris.highScore',
};
