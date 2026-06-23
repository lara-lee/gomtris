/* gen-bears.js — 11단계 젤리곰 SVG 생성기 (node tools/gen-bears.js)
 * stage1(0줄, 아기) ~ stage11(100줄, 황제). 10줄마다 색 젤리 1개 추가.
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'gomimg');
fs.mkdirSync(OUT, { recursive: true });

const COLORS = ['#ff5d8f','#ff7a7a','#ffa53d','#ffd23d','#7be04a','#19d3e6','#8a6bff','#ff6fce','#2fe0a8','#ff4d4d'];
const SPOTS = [
  [48,98],[64,94],[56,112],[42,88],[74,86],
  [60,80],[46,120],[70,118],[36,106],[84,102],
];

const OUTLINE = '#6b4a22';

function bearBody() {
  return `
    <!-- 그림자 -->
    <ellipse cx="60" cy="139" rx="30" ry="6" fill="#000" opacity="0.10"/>
    <!-- 팔 -->
    <ellipse cx="27" cy="96" rx="10" ry="13" fill="url(#bear)" stroke="${OUTLINE}" stroke-width="2.2"/>
    <ellipse cx="93" cy="96" rx="10" ry="13" fill="url(#bear)" stroke="${OUTLINE}" stroke-width="2.2"/>
    <!-- 다리 -->
    <ellipse cx="45" cy="130" rx="12" ry="10" fill="url(#bear)" stroke="${OUTLINE}" stroke-width="2.2"/>
    <ellipse cx="75" cy="130" rx="12" ry="10" fill="url(#bear)" stroke="${OUTLINE}" stroke-width="2.2"/>
    <!-- 몸통 -->
    <ellipse cx="60" cy="102" rx="34" ry="30" fill="url(#bear)" stroke="${OUTLINE}" stroke-width="2.4"/>
    <!-- 배 -->
    <ellipse cx="60" cy="106" rx="20" ry="18" fill="url(#belly)"/>
    <!-- 귀 -->
    <circle cx="40" cy="30" r="11" fill="url(#bear)" stroke="${OUTLINE}" stroke-width="2.2"/>
    <circle cx="80" cy="30" r="11" fill="url(#bear)" stroke="${OUTLINE}" stroke-width="2.2"/>
    <circle cx="40" cy="30" r="5" fill="url(#belly)"/>
    <circle cx="80" cy="30" r="5" fill="url(#belly)"/>
    <!-- 머리 -->
    <circle cx="60" cy="50" r="26" fill="url(#bear)" stroke="${OUTLINE}" stroke-width="2.4"/>
    <!-- 주둥이 -->
    <ellipse cx="60" cy="59" rx="13" ry="10" fill="url(#belly)"/>
    <!-- 볼터치 -->
    <ellipse cx="42" cy="56" rx="5" ry="3.4" fill="#ff8fb0" opacity="0.55"/>
    <ellipse cx="78" cy="56" rx="5" ry="3.4" fill="#ff8fb0" opacity="0.55"/>
    <!-- 코 -->
    <ellipse cx="60" cy="53" rx="4" ry="3" fill="#5b3b16"/>
    <!-- 입 -->
    <path d="M60 56 Q56 60 53 57 M60 56 Q64 60 67 57" fill="none" stroke="#5b3b16" stroke-width="1.6" stroke-linecap="round"/>
    <!-- 눈 -->
    <circle cx="50" cy="46" r="3.4" fill="#33240f"/>
    <circle cx="70" cy="46" r="3.4" fill="#33240f"/>
    <circle cx="51.2" cy="44.8" r="1.1" fill="#fff"/>
    <circle cx="71.2" cy="44.8" r="1.1" fill="#fff"/>`;
}

function jellies(count) {
  if (count <= 0) return '';
  let defs = '', circles = '';
  for (let i = 0; i < count; i++) {
    const c = COLORS[i];
    const [x, y] = SPOTS[i];
    defs += `<radialGradient id="jg${i}" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
        <stop offset="55%" stop-color="${c}"/>
        <stop offset="100%" stop-color="${c}"/>
      </radialGradient>`;
    circles += `<circle cx="${x}" cy="${y}" r="9" fill="url(#jg${i})"/>`;
  }
  // multiply 로 곰 몸 위에서 색이 섞임
  return `<defs>${defs}</defs><g style="mix-blend-mode:multiply">${circles}</g>`;
}

function crown() {
  return `<g>
    <path d="M44 26 L44 14 L52 21 L60 9 L68 21 L76 14 L76 26 Z"
          fill="#ffd23d" stroke="${OUTLINE}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="60" cy="9" r="2.4" fill="#ff5d8f" stroke="${OUTLINE}" stroke-width="1"/>
  </g>`;
}

function sparkles() {
  const s = (x, y, r) => `<path d="M${x} ${y-r} L${x+r*0.3} ${y-r*0.3} L${x+r} ${y} L${x+r*0.3} ${y+r*0.3} L${x} ${y+r} L${x-r*0.3} ${y+r*0.3} L${x-r} ${y} L${x-r*0.3} ${y-r*0.3} Z" fill="#fff3a0" stroke="#e6b800" stroke-width="0.6"/>`;
  return `<g opacity="0.9">${s(20,40,4)}${s(100,46,5)}${s(96,86,3.5)}</g>`;
}

function makeStage(stage) {
  const jellyCount = stage - 1;          // stage1 = 0개 ... stage11 = 10개
  const isEmperor = stage === 11;
  const showSparkle = stage >= 9;
  // 단계가 오를수록 살짝 통통/크게
  const scale = 1 + Math.max(0, stage - 5) * 0.015;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150" width="120" height="150">
  <defs>
    <radialGradient id="bear" cx="38%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#ffe8b0"/>
      <stop offset="60%" stop-color="#f7b94e"/>
      <stop offset="100%" stop-color="#ef9f2e"/>
    </radialGradient>
    <radialGradient id="belly" cx="40%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#fff6df"/>
      <stop offset="100%" stop-color="#ffdf9e"/>
    </radialGradient>
  </defs>
  <g transform="translate(60 150) scale(${scale.toFixed(3)}) translate(-60 -150)">
    ${isEmperor ? crown() : ''}
    ${bearBody()}
    ${jellies(jellyCount)}
    ${showSparkle ? sparkles() : ''}
  </g>
</svg>
`;
}

for (let s = 1; s <= 11; s++) {
  fs.writeFileSync(path.join(OUT, `stage${s}.svg`), makeStage(s), 'utf8');
}
console.log('생성 완료: gomimg/stage1.svg ~ stage11.svg');
