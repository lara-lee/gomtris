/* sw.js — Gomtris 서비스워커 (오프라인 캐시 + 설치형 PWA)
 * 앱 쉘을 캐시해 두고, 오프라인에서도 실행되게 함.
 */
const CACHE = 'gomtris-v6';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './src/css/style.css',
  './src/js/config.js',
  './src/js/audio.js',
  './src/js/tetrominoes.js',
  './src/js/board.js',
  './src/js/renderer.js',
  './src/js/game.js',
  './src/js/input.js',
  './src/js/touch.js',
  './src/js/main.js',
  './assets/gomimg/pink.png',
  './icon-192.png',
  './icon-512.png',
];

// 설치: 앱 쉘 캐시
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// 활성화: 이전 버전 캐시 정리
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 요청 처리: 네트워크 우선(항상 최신) → 오프라인이면 캐시로 폴백
// (옛 버전이 캐시에 박혀 안 보이는 문제 방지)
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // 외부(교차 출처) 요청은 그대로 통과 (예: 제목 폰트 CDN)
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then((hit) => hit || caches.match('./index.html')))
  );
});
