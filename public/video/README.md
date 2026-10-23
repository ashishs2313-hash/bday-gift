# Amma's birthday wish video

The Phase 5 video is served from `/video/amma-birthday-wish.mp4`.

The source MP4 was copied into this folder without recompression. Keep the original source file unchanged. Phase 5 uses the browser's native video controls and moves to the final gift question only after natural playback raises the video's `ended` event.

For local development only, add `?phase5test=1` to the URL. The video scene then shows a development preview button to continue without watching the video. The button is only rendered by Vite's development build and is absent from production.
