import {MutableRefObject} from "react";
import {MediaObject} from "@ionic-native/media";
import {Capacitor} from "@capacitor/core";

export type AudioRefObject = MutableRefObject<HTMLAudioElement | null> | MutableRefObject<Media | null>;

export function getAudio(uri: string): HTMLAudioElement {
  const audio = new Audio(uri);
  audio.muted = true;

  return audio;
}

export function getMedia(uri: string): Media {
  return new Media(uri, () => console.log("Audio played successfully"));
}

export function playAudio(audioRef: AudioRefObject) {

  if (Capacitor.isNativePlatform()) {
    const audio = audioRef.current as Media | null;
    if (audio) {
      console.log('playing audio');
      console.log(audio);

      audio.stop();
      audio.seekTo(0);
      audio.play();
    }
  } else {
    const audio = audioRef.current as HTMLAudioElement | null;
    if (audio) {
      console.log('playing audio');
      console.log(audio);

      audio.pause();
      audio.currentTime = 0;
      audio.play().then();
    }
  }


}

export function playAppAudio(audioRef: MutableRefObject<MediaObject | null>) {
  console.log('playing audio');
  const audio = audioRef.current;

  if (audio) {
    audio.pause();
    audio.seekTo(0);
    audio.play();
  }
}