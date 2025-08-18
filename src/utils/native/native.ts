import {Capacitor} from "@capacitor/core";
import {ForegroundService} from "@capawesome-team/capacitor-android-foreground-service";

export const startForegroundService = async () => {
  if (Capacitor.getPlatform() !== 'android') {
    return false;
  }
  console.log('starting Foreground service');
  await ForegroundService.startForegroundService({
    body: "넘버원푸드 앱 실행중",
    id: 123,
    smallIcon: "ic_notification",
    title: "넘버원푸드"
  });
};

export const stopForegroundService = async () => {
  console.log('stopping Foreground service');
  if (Capacitor.getPlatform() !== 'android') {
    return false;
  }
  await ForegroundService.stopForegroundService();
};

export function isNative() {
  return Capacitor.isNativePlatform();
}