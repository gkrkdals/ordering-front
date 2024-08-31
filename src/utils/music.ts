import {MutableRefObject} from "react";

export function playAudio(audioRef: MutableRefObject<HTMLAudioElement>) {
  const audio = audioRef.current;
  audio.volume = 1.0;

  if (audio.paused) {
    audio.play().then();
  } else {
    audio.pause();
    audio.currentTime = 0;
    audio.play().then();
  }
}