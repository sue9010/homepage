

## 2025-08-20

- **완료**: Vercel 빌드 오류 수정
  - 현상: 로컬에서는 정상적으로 빌드되나, Vercel 환경에서만 `Rollup failed to resolve import "nanostores"` 오류가 발생하며 빌드 실패.
  - 원인: `src/stores/compareStore.ts`에서 `nanostores`를 사용하고 있으나, `package.json`의 의존성 목록(`dependencies`)에 누락됨.
  - 해결: `package.json` 파일에 `nanostores` 의존성을 직접 추가하여 Vercel 빌드 환경에서도 해당 패키지를 설치하도록 조치함.
  - 후속 조치(사용자): 로컬에서 `npm install`을 실행하여 `package-lock.json`을 업데이트하고, 변경된 `package.json`과 `package-lock.json`을 커밋/푸시 하도록 안내함.
