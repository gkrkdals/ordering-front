# No1Food Frontend - 넘버원푸드 📱

> **고객 주문과 매장 운영을 하나로 담은 React 웹앱 & Capacitor 기반 Android 앱**

No1Food(넘버원푸드) 배달·주문 관리 시스템의 프론트엔드입니다. 하나의 코드베이스로 **고객용 주문 화면**과 **관리자(매니저/라이더/조리사)용 운영 화면**을 모두 제공하며, 웹 브라우저와 Android 네이티브 앱(Capacitor) 양쪽에서 동작합니다.

전체 시스템 개요와 백엔드 실행 방법은 [`back/README.md`](../back/README.md)를 참고하세요.

<br/>

## 🛠 기술 스택 (Tech Stack)

- **React 18 + TypeScript + Vite**: SPA 기반의 빠른 개발 환경과 빌드
- **Capacitor 6**: 웹 코드를 그대로 Android 앱(`com.reactivecoding.numberonefood`)으로 패키징
- **MUI 5 + Bootstrap 5 + Sass**: UI 컴포넌트 및 스타일링
- **Recoil + React Context**: 전역 상태 관리 (역할별 Context 분리)
- **Socket.io Client**: 주문 생성·상태 변경의 실시간 수신
- **Firebase Cloud Messaging**: 백그라운드 푸시 알림 (주문 채널별 알림음 지원)
- **Axios**: JWT 쿠키 기반 인증이 적용된 API 통신

<br/>

## 🧭 라우팅 및 역할 구조 (Routes & Roles)

| 경로 | 화면 | 대상 |
|------|------|------|
| `/client` | 고객 주문 화면 | 고객 |
| `/manager` | 운영 관리 화면 | 최고 관리자 |
| `/rider` | 운영 관리 화면 (배달 중심) | 라이더 |
| `/cook` | 운영 관리 화면 (조리 중심) | 조리사 |
| `/login` | 로그인 | 공통 (루트 `/` 접속 시 리다이렉트) |

`/manager`, `/rider`, `/cook`은 동일한 `ManagerPage`를 공유하며, **현재 URL 경로에서 역할을 판별**해 화면 구성과 알림 동작을 다르게 처리합니다 (`src/utils/network/socket.ts`의 `getUser()`).

<br/>

## 🚀 시작하기 (Getting Started)

### 1. 패키지 설치
```bash
cd front
npm install
```

### 2. 환경 변수 설정
실행 모드별로 환경 변수 파일을 사용합니다.
- 개발: `.env.development`
- 운영: `.env.production`

```env
VITE_MODE=development

VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:8080
VITE_PRINTER_URL=https://localhost:8443
```
- `VITE_API_URL`: 백엔드 API 서버 주소 (`/api` 프리픽스 포함)
- `VITE_SOCKET_URL`: Socket.io 게이트웨이 주소 (백엔드 `WS_PORT`)
- `VITE_PRINTER_URL`: 영수증 출력 서비스(`printneworder/`) 주소

### 3. 개발 서버 실행
```bash
npm run dev   # http://0.0.0.0:5173
```

### 4. 빌드
```bash
npm run build       # 프로덕션 빌드 (dist/)
npm run build:dev   # development 모드 환경 변수로 빌드
npm run lint        # ESLint 검사 (warning 0개 기준)
```

프로덕션 빌드 결과물(`dist/`)은 백엔드의 `static` 디렉토리로 옮겨져 NestJS 서버가 직접 서빙합니다.

<br/>

## 🤖 Android 앱 빌드 (Capacitor)

```bash
npm run cap:sync:dev    # development 빌드 후 android/ 프로젝트에 동기화
npm run cap:sync:prod   # production 빌드 후 android/ 프로젝트에 동기화
npx cap open android    # Android Studio에서 열기
```

이후 Android Studio에서 빌드·실행하거나 APK/AAB를 생성합니다.

### 네이티브 기능
- **포그라운드 서비스** (`@capawesome-team/capacitor-android-foreground-service`): 앱이 백그라운드에 있어도 주문 알림을 놓치지 않도록 상시 실행 알림을 유지합니다 (`src/utils/native/native.ts`).
- **FCM 푸시 알림** (`@capacitor-firebase/messaging`): 신규 주문, 조리 시작, 배달 지연 등 **이벤트별 알림 채널**과 전용 알림음을 등록합니다 (`src/utils/native/notifications.ts`).
- **알림음 재생** (`cordova-plugin-media`): 웹에서는 `HTMLAudioElement`, Android에서는 네이티브 Media 플러그인으로 `public/alarms/*.mp3`를 재생합니다 (`src/utils/music.ts`).
- **로컬 저장소** (`@capacitor/preferences`): 로그인 정보 등 기기 설정 저장 (`src/utils/native/preferences.ts`).

<br/>

## 📂 디렉토리 구조 (Directory Structure)

```
src/
├── pages/
│   ├── client/        # 고객 주문 화면 (components: atoms/molecules/organisms, modals)
│   ├── manager/       # 관리자 화면 (주문/메뉴/고객/설정 모달 포함)
│   └── login/         # 로그인 화면
├── components/        # 공통 컴포넌트 (Card, Container, 테이블 등)
├── contexts/          # React Context — client / common / manager 역할별 분리
├── recoil/atoms/      # Recoil 전역 상태 (사용자, 고객, 최근 작업)
├── models/            # 도메인 모델 — client / common / manager 분리
├── interfaces/        # 타입 정의
├── hooks/             # 커스텀 훅 (테이블 정렬, 그릇 수거 시간 등)
├── router/            # 라우팅 정의
└── utils/
    ├── network/       # axios 클라이언트, Socket.io 클라이언트 (역할별)
    └── native/        # Capacitor 네이티브 기능 래퍼
```

### 주요 컨벤션
- **경로 별칭**: `@src/*` → `src/*` (Vite `resolve.alias`)
- **역할별 분리**: `contexts`, `models`, 페이지 컴포넌트 모두 `client` / `common` / `manager` 구조를 따릅니다. 새 기능 추가 시 해당 역할 폴더에 배치하세요.
- **컴포넌트 계층**: 페이지별 컴포넌트는 atomic design(atoms / molecules / organisms) 구조를 따릅니다.
- **Socket 클라이언트**: `customerSocket` / `managerSocket` / `printerSocket`이 역할을 handshake query로 전달하며, 모두 `autoConnect: false`로 선언되어 페이지 진입 시 명시적으로 연결합니다.
