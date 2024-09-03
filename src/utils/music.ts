import {MutableRefObject} from "react";

export function playAudio(audioRef: MutableRefObject<HTMLAudioElement>) {
  const audio = audioRef.current;

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
    audio.currentTime = 0;
    audio.play().then();
  }
}