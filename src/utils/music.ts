import {MutableRefObject} from "react";
export type AudioRefObject = MutableRefObject<HTMLAudioElement | null> | string;

export function getAudio(uri: string): HTMLAudioElement {
  const audio = new Audio(uri);
  audio.muted = true;

  return audio;
}

export function playAudio(audioRefOrPath: AudioRefObject) {

  if (typeof audioRefOrPath === 'string') {
    const audio = new Media(
      `file:///android_asset/alarms/${audioRefOrPath}`,
      () => {
        console.log("Media is succesfully played. Releasing resources...");
        audio.release();
      }
    );

    console.log(`playing audio`);

    audio.stop();
    audio.seekTo(0);
    audio.play();
  } else {
    const audio = audioRefOrPath.current as HTMLAudioElement | null;
    if (audio) {
      console.log('playing audio');

      audio.pause();
      audio.currentTime = 0;
      audio.play().then(() => console.log('audio is played succesfully'));
    }
  }
}