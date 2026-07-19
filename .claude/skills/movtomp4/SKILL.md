---
name: movtomp4
description: project-doc/영상 폴더의 .mov 파일을 웹 최적화 mp4로 인코딩해 assets/videos/에 저장하고, 해당 works 상세페이지의 미디어 영역(.wd-shot)에 video 태그로 삽입한다. "mov를 mp4로", "영상 인코딩해서 상세페이지에 넣어줘" 같은 요청에 사용.
---

# movtomp4 — mov를 웹용 mp4로 인코딩해 상세페이지에 삽입

## 입력

- 대상 .mov 파일: 사용자가 경로를 주면 그 파일, 아니면 `project-doc/영상/<이름>.mov`
- 대상 상세페이지: 파일명과 같은 이름의 `works/<이름>.html` (예: `hyosung-tnc.mov` → `works/hyosung-tnc.html`)

## 절차

1. **원본 확인** — ffprobe로 해상도를 확인한다:
   ```bash
   ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of default=noprint_wrappers=1 "<입력.mov>"
   ```

2. **인코딩** — 아래 설정을 그대로 사용한다 (이 프로젝트의 표준 스펙):
   ```bash
   ffmpeg -y -i "<입력.mov>" -vf scale=1600:-2 -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart -an "assets/videos/<이름>.mp4"
   ```
   - 1600px 폭으로 축소(`-2`는 짝수 높이 보장), 음성 제거(`-an`), 스트리밍용 faststart
   - 결과 파일이 25MB를 넘으면 Cloudflare Pages 업로드 제한에 걸리므로 crf를 30~32로 올려 재인코딩

3. **상세페이지 삽입** — `works/<이름>.html`의 `.wd-shot` 영역을 아래 패턴으로 교체한다.
   width/height에는 1단계에서 확인한 **원본 해상도**를 넣는다 (인코딩 후 해상도가 아님):
   ```html
   <div class="wd-shot">
     <video src="../assets/videos/<이름>.mp4" width="<원본W>" height="<원본H>" autoplay muted loop playsinline></video>
     <span class="gcard-file"><이름>.mp4</span>
   </div>
   ```
   기존에 `<img>`가 있으면 통째로 교체하고, `gcard-file` 라벨도 mp4 파일명으로 바꾼다.

4. **보고** — 원본 대비 인코딩 결과 용량, 교체된 파일 경로를 사용자에게 알린다. 커밋은 사용자가 요청할 때만 한다.

## 참고 사례

- `assets/videos/gollage.mp4` + `works/gollage.html:58` — 이 패턴의 원본 사례
