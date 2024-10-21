// global.d.ts

// Cordova 플러그인의 타입 정의
interface CordovaPlugins {
  foregroundService: {
    start(title: string, text: string, icon?: string): void;
    stop(): void;
  };
  backgroundMode: {
    enable(): void;
    disable(): void;
  };
}

// Cordova의 타입을 명시적으로 window 객체에 추가
interface Window {
  cordova?: {
    plugins: CordovaPlugins;
    file: any;
  };
}