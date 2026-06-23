# 오디오 파일 넣는 곳

## 필요한 파일은 단 1개 — `bgm.mp3`

```
assets/audio/bgm.mp3
```

이 파일 하나만 넣으면 **게임 시작 시 자동으로 반복 재생**되고,
일시정지/게임오버 시 멈추며, **레벨이 오를수록 템포가 빨라집니다**(최대 1.6배).

- 파일이 없으면 배경음만 조용히 생략됩니다(에러 없음).
- 음소거 버튼(또는 `M` 키)으로 끄고 켤 수 있습니다.
- 음원 검색 키워드(영어): `chiptune loop`, `8bit music loop`, `retro game bgm`, `korobeiniki`
- 추천 무료 사이트: pixabay.com/music · freesound.org · incompetech.com

> 확장자가 `.ogg` 등이면 `src/js/audio.js` 의 `initBgm()` 에서 경로만 바꾸세요.

## 효과음(SFX)은 파일이 필요 없습니다
이동·회전·드롭·줄제거·레벨업 등 효과음은 코드에서 **즉석 합성(WebAudio)**으로
만들어 재생합니다. 별도 음원 파일을 준비할 필요가 없습니다.
(음색을 바꾸려면 `src/js/audio.js` 의 `synth` 값을 조절하세요.)
