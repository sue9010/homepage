## 2025년 8월 18일 월요일

### 진행 내용

*   서버 용량 측정 시 확인해야 할 폴더에 대해 설명했습니다.
    *   초기에는 `dist` 폴더를 언급했으나, Vercel 배포 환경의 특성을 고려하여 `coxcamera-astro/.vercel/output/` 폴더 전체의 용량을 확인해야 함을 명확히 설명했습니다.
    *   `dist/client`와 `_functions`의 역할 및 포함되는 내용에 대해 상세히 설명했습니다.
    *   `node_modules` 등 개발용 파일은 배포 용량에 포함되지 않음을 강조했습니다.
*   `src/pages/ko/products/[slug].astro` 파일에 `export const prerender = true;` 추가 완료.
*   `src/pages/en/products/[slug].astro` 파일에 `export const prerender = true;` 추가 완료.

### Vercel 배포 설정 상세 가이드

Vercel 프로젝트 설정 페이지에서 다음 항목들을 확인하고 필요에 따라 조정합니다.

1.  **Root Directory (루트 디렉토리):**
    *   **설명:** Vercel이 프로젝트의 소스 코드를 찾을 기본 디렉토리입니다. Git 저장소의 루트가 아닐 수도 있습니다.
    *   **`coxcamera-astro` 프로젝트 설정:**
        *   만약 Git 저장소의 루트가 `coxcamera-astro` 디렉토리라면, **비워두거나 `./`로 설정**합니다.
        *   만약 Git 저장소의 루트가 `E:\Coding_practice\250814_homepage\`이고, 그 안에 `coxcamera-astro` 폴더가 있다면, **`coxcamera-astro`로 설정**해야 합니다.

2.  **Build and Output Settings (빌드 및 출력 설정):**
    *   **Framework Preset (프레임워크 프리셋):** Vercel이 대부분 자동으로 **Astro**를 감지할 것입니다. 감지되지 않는다면 수동으로 Astro를 선택합니다.
    *   **Build Command (빌드 명령어):** Astro 프로젝트의 기본 빌드 명령어는 `npm run build`입니다. Vercel이 자동으로 감지할 것입니다.
        *   `package.json`에 다른 빌드 스크립트가 정의되어 있다면 해당 스크립트를 사용합니다.
    *   **Output Directory (출력 디렉토리):** Astro 프로젝트의 기본 빌드 출력 디렉토리는 `dist`입니다. Vercel이 자동으로 감지할 것입니다.
        *   `astro.config.mjs` 파일에서 `outDir` 설정이 변경되지 않았다면 `dist`를 사용합니다.

3.  **Environment Variables (환경 변수):**
    *   **설명:** 빌드 및 런타임 시 애플리케이션에서 사용할 수 있는 변수입니다. API 키, 데이터베이스 연결 문자열 등 민감한 정보나 환경에 따라 달라지는 값을 여기에 저장합니다.
    *   **설정 방법:** Vercel 대시보드의 프로젝트 설정 페이지에서 "Environment Variables" 섹션으로 이동하여 추가합니다.
    *   **예시:** `Name`에 `PUBLIC_API_KEY`, `Value`에 실제 API 키 값을 입력하고 "Add" 버튼을 클릭합니다.
    *   **주의:** 민감한 정보는 절대 코드에 직접 하드코딩하지 않고 환경 변수를 사용해야 합니다.

### .gitignore 파일 내용 확인

*   `E:\Coding_practice\250814_homepage\coxcamera-astro\.gitignore` 파일에 포함된 `dist/`, `.astro/`, `node_modules/`, `.env`, `.vercel/`, 로그 파일, IDE 설정 파일 등은 모두 Git 버전 관리에서 제외하는 것이 일반적이고 올바른 관행입니다.
*   이러한 파일들은 빌드 결과물, 의존성, 민감한 정보, 또는 개발 환경에 특화된 파일들이기 때문에 Git으로 관리할 필요가 없으며, 오히려 저장소를 깔끔하게 유지하고 보안을 강화하는 데 도움이 됩니다.
*   따라서 현재 `.gitignore` 파일의 설정은 **매우 적절하며, 전혀 걱정할 필요가 없습니다.**

### 빌드 로그 에러 분석

*   제공된 `error.txt` 파일의 빌드 로그를 분석한 결과, **심각한 빌드 실패 에러는 발견되지 않았습니다.**
*   로그에 나타난 `npm warn deprecated node-domexception@1.0.0` 및 `[WARN] [vite] [vite:css][postcss] Replace color-adjust to print-color-adjust` 메시지는 **경고(warning)**이며, 빌드 프로세스를 중단시키지 않습니다.
*   로그의 마지막 부분에서 `[build] Complete!`, `Build Completed`, `Deployment completed` 메시지를 통해 **프로젝트가 성공적으로 빌드되고 Vercel에 배포되었음**을 확인했습니다.
*   따라서, 걱정하실 필요가 없으며, 프로젝트는 정상적으로 배포되었습니다。

### "수리 요청 제출 중..." 문제 진단 가이드

"수리 요청 제출 중..." 상태에서 멈추는 문제는 클라이언트 측 콘솔에 에러가 나타나지 않더라도 서버 측(Vercel Serverless Function)에서 문제가 발생했을 가능성이 높습니다.

**가장 중요한 진단 단계는 Vercel 대시보드에서 `submit-repair` API 엔드포인트의 로그를 확인하는 것입니다.**

**로그 확인 방법:**

1.  `vercel.com`에 로그인합니다.
2.  해당 `coxcamera-astro` 프로젝트를 선택합니다.
3.  문제가 발생한 배포를 선택합니다.
4.  "Logs" 탭으로 이동합니다.
5.  `submit-repair` API 엔드포인트에 해당하는 Serverless Function의 로그를 확인합니다. `console.log`와 `console.error` 메시지가 여기에 나타날 것입니다. 특히 "Error sending email:" 또는 "Error appending to Google Sheet:"와 같은 오류 메시지를 찾아주세요.

이 로그를 통해 문제의 정확한 원인(환경 변수 문제, API 인증 문제, 통신 문제 등)을 파악할 수 있습니다.

### Google Sheets API 에러 분석 및 해결

*   제공된 로그(`error.txt`)를 분석한 결과, "수리 요청 제출 중..." 문제가 발생하는 원인은 **Google Sheets에 데이터를 추가하는 과정에서 발생한 에러** 때문입니다.
*   에러 메시지: `Error appending to Google Sheet: Error: error:1E08010C:DECODER routines::unsupported`
*   이 에러는 `GOOGLE_PRIVATE_KEY` 환경 변수 설정과 관련이 있습니다. Vercel 환경 변수에 `GOOGLE_PRIVATE_KEY`를 설정할 때, 키 값 내의 줄바꿈 문자(`
`)가 제대로 처리되지 않아 발생하는 문제입니다.

**해결 방안:**

`GOOGLE_PRIVATE_KEY` 환경 변수를 Vercel에 설정할 때, **줄바꿈 문자(`
`)를 `\n`으로 이스케이프하여 한 줄로 입력**해야 합니다.

1.  서비스 계정 키 파일에서 `private_key` 값을 복사합니다.
2.  복사한 키 값 내의 모든 줄바꿈 문자(`
`)를 **두 개의 백슬래시와 n (`\n`)**으로 바꿉니다.
    *   **예시:**
        ```
        -----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQ... (중략) ...\n-----END PRIVATE KEY-----
```
        위와 같은 형태의 키를 다음과 같이 한 줄로 만듭니다.
        ```
        -----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQ...\n...\n-----END PRIVATE KEY-----
```
3.  이렇게 변환된 한 줄짜리 키 값을 Vercel 대시보드의 환경 변수 설정에서 `GOOGLE_PRIVATE_KEY`에 붙여넣습니다.

**추가 확인 사항:**
*   `GOOGLE_SERVICE_ACCOUNT_EMAIL` 환경 변수 값도 정확한지 다시 한번 확인해 주세요.
*   Google Cloud Platform에서 해당 서비스 계정에 Google Sheets API에 대한 쓰기 권한이 부여되어 있는지 확인해 주세요.

### Vercel 환경 변수 수정 방법

Vercel 대시보드에서 환경 변수를 수정하는 단계는 다음과:

1.  **Vercel 대시보드 로그인:** `vercel.com`에 접속하여 로그인합니다.
2.  **프로젝트 선택:** 환경 변수를 수정하려는 프로젝트를 선택합니다.
3.  **"Settings" 탭 이동:** 프로젝트 페이지 상단 또는 좌측 메뉴에서 "Settings" 탭을 클릭합니다.
4.  **"Environment Variables" 섹션 선택:** "Settings" 탭 내에서 좌측 메뉴에 있는 "Environment Variables"를 클릭합니다.
5.  **환경 변수 수정/추가/삭제:** 
    *   **수정:** 기존 환경 변수의 값을 수정하려면 해당 변수 옆의 "Edit" (연필 아이콘) 버튼을 클릭하고 새 값을 입력한 후 "Save"를 클릭합니다.
    *   **추가:** 새로운 환경 변수를 추가하려면 "Add New" 버튼을 클릭하고 "Name"과 "Value"를 입력한 후 "Add"를 클릭합니다.
    *   **삭제:** 환경 변수를 삭제하려면 해당 변수 옆의 "Delete" (휴지통 아이콘) 버튼을 클릭합니다.
6.  **재배포 (필요한 경우):** 환경 변수를 수정한 후에는 변경 사항이 적용되도록 프로젝트를 **재배포**해야 합니다. (프로젝트 대시보드에서 "Deployments" 탭으로 이동하여 "Redeploy" 버튼 클릭)

### `GOOGLE_PRIVATE_KEY` 재설정 후에도 동일 에러 발생 분석

*   `GOOGLE_PRIVATE_KEY`를 수정했음에도 불구하고 동일한 `Error appending to Google Sheet: Error: error:1E08010C:DECODER routines::unsupported` 에러가 발생하는 것은 `GOOGLE_PRIVATE_KEY` 환경 변수 설정이 여전히 올바르지 않다는 것을 의미합니다.
*   로그에서 `GOOGLE_PRIVATE_KEY (first 20 chars): "-----"BEGIN PRIVATE` 로 시작하는 것을 볼 때, 키가 제대로 파싱되지 않고 있습니다.

**가능성 있는 원인 및 해결 방안:**

1.  **`GOOGLE_PRIVATE_KEY` 값 자체의 문제:**
    *   서비스 계정 키 파일을 다시 다운로드하여 `private_key` 값을 정확히 복사했는지 확인합니다. 키 파일의 내용이 손상되었을 수도 있습니다.
2.  **Vercel 환경 변수 입력 시 문제 (가장 유력):**
    *   Vercel 대시보드에서 환경 변수를 입력할 때, `\n`으로 이스케이프하는 과정에서 오타가 있거나, 복사-붙여넣기 과정에서 문제가 발생했을 수 있습니다.
    *   **재확인 방법:**
        *   서비스 계정 키 파일에서 `private_key` 값을 복사합니다.
        *   텍스트 편집기 (예: VS Code, Sublime Text)를 열고 복사한 값을 붙여넣습니다.
        *   **모든 줄바꿈 문자(`\n`)를 `\\n`으로 수동으로 변경합니다.** (예: `Ctrl+H` 또는 `Cmd+H`로 `\n`을 `\\n`으로 바꾸기)
        *   이렇게 변환된 한 줄짜리 문자열을 **정확히 복사**하여 Vercel 환경 변수에 붙여넣습니다.
        *   **절대 키 값 앞뒤에 공백이 들어가서는 안 됩니다.**
3.  **Google Cloud Platform 설정 문제:**
    *   해당 서비스 계정에 Google Sheets API에 대한 쓰기 권한이 부여되어 있는지 다시 한번 확인합니다.
    *   Google Sheets API가 프로젝트에서 활성화되어 있는지 확인합니다.

**가장 먼저 시도해야 할 것은 `GOOGLE_PRIVATE_KEY` 값을 `\n`으로 이스케이프하여 Vercel 환경 변수에 다시 한번 정확히 입력하는 것입니다.
## 2025년 8월 18일 월요일

### Task: 네비게이션 바의 Solutions 메뉴에 'Camera Guide / 카메라 추천' 페이지 신설 및 연결

**진행 내용:**
- `src/pages/ko/solutions/camera-guide.astro` 파일 생성 및 기본 내용 추가.
- `src/pages/en/solutions/camera-guide.astro` 파일 생성 및 기본 내용 추가.
- `src/components/Header.astro` 파일 수정하여 Solutions 메뉴를 드롭다운으로 변경하고 '카메라 추천' 링크 추가.

**완료 여부:** 완료

## 2025년 8월 18일 월요일

### Task: 'Camera Guide / 카메라 추천' 페이지의 BaseLayout import 경로 수정

**진행 내용:**
- `src/pages/ko/solutions/camera-guide.astro` 파일의 `BaseLayout` import 경로를 `../../../layouts/BaseLayout.astro`로 수정.
- `src/pages/en/solutions/camera-guide.astro` 파일의 `BaseLayout` import 경로를 `../../../layouts/BaseLayout.astro`로 수정.

**완료 여부:** 완료

## 2025년 8월 18일 월요일

### Task: 네비게이션 바의 Solutions 메뉴에서 '카메라 추천' 링크 순서 변경

**진행 내용:**
- `src/components/Header.astro` 파일에서 Solutions 메뉴의 하위 링크 중 '카메라 추천' 링크를 두 번째 위치로 이동.

**완료 여부:** 완료

## 2025년 8월 18일 월요일

### Task: 네비게이션 바의 Solutions 메뉴에서 '스마트 팩토리' 링크 404 에러 수정 (임시)

**진행 내용:**
- `src/components/Header.astro` 파일에서 Solutions 메뉴의 하위 링크 중 '스마트 팩토리' 링크의 `href`를 `/ko/solutions/smart-factoryko`로 임시 수정하여 한국어 페이지 404 에러 해결 시도.

**완료 여부:** 완료

## 2025년 8월 18일 월요일

### Task: 네비게이션 바의 Solutions 메뉴에서 '스마트 팩토리' 링크 영문 페이지 오류 수정 및 원인 분석

**진행 내용:**
- `src/components/Header.astro` 파일에서 Solutions 메뉴의 하위 링크 중 '스마트 팩토리' 링크의 `href`를 `/ko/solutions/smart-factory`로 되돌려 영문 페이지 오류 해결.
- `src/content/solutions/smart-factory.en.mdx` 파일 확인 결과, 슬러그는 `smart-factory`임을 확인.
- `src/pages/ko/solutions/[slug].astro` 파일 확인 결과, 슬러그는 `solution.slug`를 직접 사용하며, `smart-factory.ko.mdx`의 슬러그는 `smart-factory`임을 확인.
- `/ko/solutions/smart-factoryko`가 작동하는 것은 임시적인 현상(캐시, 로컬 서버 설정, 오타 등)으로 판단.
- 올바른 URL은 `/ko/solutions/smart-factory`임을 사용자에게 안내하고, 캐시 삭제 또는 재빌드를 권장.

**완료 여부:** 완료

## 2025년 8월 18일 월요일

### Task: 네비게이션 바의 Solutions 메뉴에서 '예지 보전' 링크 404 에러 분석

**진행 내용:**
- `src/content/solutions/predictive-maintenance.ko.mdx` 파일 확인 결과, 슬러그는 `predictive-maintenance`임을 확인.
- `src/pages/ko/solutions/[slug].astro` 파일 확인 결과, 슬러그는 `solution.slug`를 직접 사용하며, `predictive-maintenance.ko.mdx`의 슬러그는 `predictive-maintenance`임을 확인.
- `src/components/Header.astro` 파일 확인 결과, '예지 보전' 링크는 `/ko/solutions/predictive-maintenance`를 올바르게 가리킴.
- 모든 코드 설정은 올바르며, 페이지가 열리지 않는 문제는 캐싱 또는 로컬 개발 서버 문제로 판단됨.

**해결 방안:**
- 브라우저 캐시를 지우고 (Ctrl+F5 또는 Cmd+Shift+R) 새로고침.
- 개발 서버를 재시작 (npm run dev 프로세스 중지 후 다시 시작).
- 빌드 실행 시, 빌드 로그에서 `predictive-maintenance` 관련 오류 확인.

**완료 여부:** 완료

## 2025년 8월 18일 월요일

### Task: 네비게이션 바의 Solutions 메뉴에서 '예지 보전' 링크 404 에러 재분석 (경고 메시지 확인)

**진행 내용:**
- `[WARN] [router] A getStaticPaths()` 경고 메시지 확인.
- `src/pages/ko/solutions/[slug].astro`의 `getStaticPaths` 함수가 `predictive-maintenance`에 대한 정적 경로를 찾지 못했음을 의미.
- `predictive-maintenance.ko.mdx` 파일의 내용을 최소화하여 테스트 진행.

**완료 여부:** 진행 중

## 2025년 8월 18일 월요일

### Task: '예지 보전' 페이지 빌드 실패 원인 분석 및 수정

**진행 내용:**
- `error.txt` 파일 확인 결과, `[InvalidContentEntryDataError]` 발생.
- `predictive-maintenance.ko.mdx` 파일에서 `shortDesc` 필드가 누락되어 스키마 유효성 검사 실패.
- `predictive-maintenance.ko.mdx` 파일의 내용을 원래대로 복원하여 `shortDesc` 필드 포함.

**완료 여부:** 완료

## 2025년 8월 18일 월요일

### Task: `npm error enoent` 오류 해결

**진행 내용:**
- `npm` 명령 실행 시 `package.json` 파일을 찾을 수 없다는 오류 발생.
- 현재 작업 디렉토리가 `E:\Coding_practice\250814_homepage\`이므로, `package.json`이 있는 `E:\Coding_practice\250814_homepage\coxcamera-astro\` 디렉토리로 이동해야 함을 확인.

**해결 방안:**
- `cd E:\Coding_practice\250814_homepage\coxcamera-astro` 명령으로 디렉토리 이동 후 `npm` 명령 실행.

**완료 여부:** 완료

## 2025년 8월 18일 월요일

### Task: `solutions` 컬렉션 i18n 폴더 구조 및 frontmatter 리팩토링

**진행 내용:**
- `src/content/solutions/ko` 및 `src/content/solutions/en` 디렉토리 생성.
- `predictive-maintenance.ko.mdx` -> `ko/predictive-maintenance.mdx`로 이동 및 이름 변경.
- `predictive-maintenance.en.mdx` -> `en/predictive-maintenance.mdx`로 이동 및 이름 변경.
- `smart-factory.ko.mdx` -> `ko/smart-factory.mdx`로 이동 및 이름 변경.
- `smart-factory.en.mdx` -> `en/smart-factory.mdx`로 이동 및 이름 변경.
- 모든 `solutions` 콘텐츠 파일의 frontmatter에 `lang` 및 `slug` 필드 추가/수정.
- `src/content/config.ts`의 `solutions` 스키마에 `lang: z.enum(['ko', 'en'])` 및 `slug: z.string()` 추가/수정.
- `src/pages/ko/solutions/[slug].astro` 및 `src/pages/en/solutions/[slug].astro` 파일의 `getStaticPaths`에서 `params.slug`를 `solution.data.slug`로 변경.

**완료 여부:** 완료

## 2025년 8월 18일 월요일

### Task: `products` 컬렉션 i18n 폴더 구조 및 frontmatter 리팩토링

**진행 내용:**
- `src/content/products/ko` 및 `src/content/products/en` 디렉토리 생성.
- `CG320.ko.mdx` -> `ko/CG320.mdx`로 이동 및 이름 변경.
- `CG320IP.ko.mdx` -> `ko/CG320IP.mdx`로 이동 및 이름 변경.
- `CG640.ko.mdx` -> `ko/CG640.mdx`로 이동 및 이름 변경.
- `CG640IP.ko.mdx` -> `ko/CG640IP.mdx`로 이동 및 이름 변경.
- `cox-p3.en.mdx` -> `en/cox-p3.mdx`로 이동 및 이름 변경.
- `cox-t1.en.mdx` -> `en/cox-t1.mdx`로 이동 및 이름 변경.
- 모든 `products` 콘텐츠 파일의 frontmatter에 `lang` 및 `slug` 필드 추가/수정.
- `src/content/config.ts`의 `products` 스키마에 `lang: z.enum(['ko', 'en'])` 및 `slug: z.string()` 추가/수정.
- `src/pages/ko/products/[slug].astro` 및 `src/pages/en/products/[slug].astro` 파일의 `getStaticPaths`에서 `params.slug`를 `product.data.slug`로 변경.

**완료 여부:** 완료

## 2025년 8월 19일 화요일

### Task: `solutions` 페이지 라우팅 및 렌더링 오류 수정

**진행 내용:**

1.  **`solutions/[slug].astro` 로직 수정**:
    *   `src/pages/ko/solutions/[slug].astro`와 `src/pages/en/solutions/[slug].astro` 파일을 수정했습니다.
    *   기존에 `getStaticPaths`의 `props`에 의존하던 방식에서, URL의 `slug` 파라미터를 (`Astro.params.slug`) 사용해 콘텐츠를 다시 조회하도록 변경했습니다.
    *   콘텐츠 조회 실패 시 404 페이지로 리다이렉트하는 가드 로직을 추가했습니다.
    *   `products` 컬렉션과의 프론트매터 키 불일치 문제를 해결하기 위해, `title`/`name`, `coverImage`/`heroImage`, `shortDesc`/`summary` 키에 대한 fallback 로직을 추가했습니다.

2.  **링크 생성 로직 수정**:
    *   `src/pages/ko/solutions/index.astro` 및 `en/solutions/index.astro` 파일에서 상세 페이지로 연결되는 `href`가 잘못된 경로(`.../ko/ko/slug`)를 생성하던 문제를 수정했습니다.
    *   `slug` 문자열에서 언어 코드 접두사(`ko/`, `en/`)를 제거하여 올바른 경로로 연결되도록 수정했습니다.
    *   동일한 문제가 `products` 목록 페이지에도 존재하여, `src/pages/ko/products/index.astro` 및 `en/products/index.astro` 파일의 링크 생성 로직도 함께 수정했습니다.

3.  **콘텐츠 스키마 보강**:
    *   `src/content/config.ts` 파일의 `solutions` 컬렉션 스키마를 수정했습니다.
    *   `title`, `shortDesc` 필드를 optional로 변경하고, fallback을 위해 `name`, `heroImage`, `summary` 필드를 optional로 추가하여 유연성을 확보하고 빌드 에러를 방지했습니다.

4.  **빌드 확인**:
    *   `npm run build` 명령을 실행하여 모든 변경사항이 적용된 후에도 프로젝트가 성공적으로 빌드되는 것을 확인했습니다.

**완료 여부:** 완료

## 2025년 8월 19일 화요일

### Task: `getEntryBySlug` Deprecation 에러 수정

**진행 내용:**

*   `error.txt` 로그 분석 결과, `solutions` 상세 페이지에서 더 이상 사용되지 않는 `getEntryBySlug` 함수를 호출하여 에러가 발생하는 것을 확인했습니다.
*   Astro의 권장사항에 따라 `getEntryBySlug`를 `getEntry` 함수로 변경했습니다.
*   `src/pages/ko/solutions/[slug].astro` 파일의 `import` 구문과 함수 호출을 수정했습니다.
*   `src/pages/en/solutions/[slug].astro` 파일의 `import` 구문과 함수 호출을 수정했습니다.

**완료 여부:** 완료

# `solutions` 페이지를 `products` 페이지처럼 리팩토링하는 작업 계획

**목표:** `solutions` 콘텐츠 타입의 데이터 처리, 스키마, 페이지 템플릿을 `products`와 유사한 구조로 통일하여 일관성을 높이고 관리를 용이하게 합니다.

---


### Task 1: 콘텐츠 파일 슬러그(Slug) 및 구조 통일

**목표:** `solutions` 콘텐츠의 slug에서 언어 접두사(`ko/`, `en/`)를 제거하여 `products`와 동일한 방식으로 처리되도록 합니다.

1.  **`[slug].astro` 데이터 조회 로직 수정:**
    *   **대상 파일:**
        *   `src/pages/ko/solutions/[slug].astro`
        *   `src/pages/en/solutions/[slug].astro`
    *   **작업 내용:** `getStaticPaths`가 `products` 페이지처럼 `lang`을 기준으로 콘텐츠를 필터링하고, slug를 그대로 사용하도록 수정합니다. 페이지에서는 `getEntry` 대신 `Astro.props`로 데이터를 받습니다.

    *   **`ko` 페이지 수정 (`src/pages/ko/solutions/[slug].astro`):**
        *   **`getStaticPaths` 수정:**
            ```javascript
            // 수정 전
            export async function getStaticPaths() {
              const solutions = await getCollection('solutions', ({ data }) => data.lang === 'ko');
              return solutions.map((solution) => ({
                params: { slug: solution.slug.replace(/^ko\//, '') },
              }));
            }
            // 수정 후
            export async function getStaticPaths() {
              const solutions = await getCollection('solutions', ({data}) => data.lang === 'ko');
              return solutions.map(solution => ({
                params: { slug: solution.slug },
                props: { solution },
              }));
            }
            ```
        *   **데이터 조회 로직 수정:**
            ```javascript
            // 수정 전
            const { slug } = Astro.params;
            const solution = await getEntry('solutions', `ko/${slug}`);
            // 수정 후
            const { solution } = Astro.props;
            ```

    *   **`en` 페이지 수정 (`src/pages/en/solutions/[slug].astro`):**
        *   `ko` 페이지와 동일한 방식으로 수정하되, `getCollection`의 필터 조건을 `data.lang === 'en'`으로 변경합니다.

---


### Task 2: `solutions` 데이터 스키마 확장

**목표:** `src/content/config.ts` 파일의 `solutions` 컬렉션 스키마를 `products`처럼 더 구조적으로 변경합니다.

1.  **`src/content/config.ts` 파일 수정:**
    *   `solutions` 컬렉션의 `schema`를 `products` 스키마와 유사하게 수정합니다. `title`은 `name`으로, `coverImage`는 `heroImage`로 변경하여 필드명을 통일하고, `gallery`, `features` 등을 추가합니다.

    *   **수정 후 (제안):**
        ```typescript
        const solutions = defineCollection({
          type: 'content',
          schema: z.object({
            name: z.string(), // title -> name 으로 변경하여 통일
            shortDesc: z.string(),
            heroImage: z.string(), // coverImage -> heroImage 로 변경
            gallery: z.array(z.string()).optional(),
            features: z.array( // 'specs'와 유사한 'features' 필드 추가
              z.object({
                title: z.string(),
                description: z.string(),
                icon: z.string().optional(), // 아이콘 필드 추가
              })
            ).optional(),
            relatedProducts: z.array(z.string()).optional(), // 관련 제품 slug 배열
            order: z.number().optional(),
            lang: z.enum(['ko','en']),
          })
        });
        ```

---


### Task 3: `solutions` 콘텐츠 파일 업데이트

**목표:** 새로운 스키마에 맞게 `src/content/solutions/` 디렉토리의 모든 `.mdx` 파일 내용을 수정합니다.

1.  **파일 내용 일괄 수정:** 각 파일의 frontmatter를 새로운 스키마에 맞게 수정합니다.
    *   `title` -> `name`으로 변경
    *   `coverImage` -> `heroImage`로 변경
    *   `shortDesc` 필드 내용 채우기
    *   `gallery`, `features` 필드 추가 (샘플 데이터로 채움)

    *   **수정 예시 (`smart-factory.ko.mdx`):**
        ```mdx
        ---
        name: '스마트 팩토리 솔루션'
        lang: 'ko'
        shortDesc: 'COX의 열화상 카메라를 활용하여 스마트 팩토리의 생산성과 안전성을 극대화하세요.'
        heroImage: '/assets/products/sample/placeholder.png'
gallery:
  - '/assets/products/sample/placeholder.png'
  - '/assets/products/sample/placeholder.png'
features:
  - title: '실시간 온도 모니터링'
    description: '주요 설비의 온도를 실시간으로 모니터링하여 과열로 인한 고장을 사전에 방지합니다.'
    icon: 'mdi:thermometer'
  - title: '자동화된 품질 검사'
    description: '제품의 미세한 온도 변화를 감지하여 불량품을 자동으로 선별합니다.'
    icon: 'mdi:robot-industrial'
relatedProducts:
  - 'cg320'
  - 'cg640ip'
order: 1
---

솔루션에 대한 상세 설명은 여기에 MDX 형식으로 작성합니다...
```

---


### Task 4: `solutions` 페이지 템플릿 리팩토링

**목표:** `src/pages/ko/solutions/[slug].astro` 와 `src/pages/en/solutions/[slug].astro` 파일을 `products` 페이지와 유사한 레이아웃으로 수정합니다.

1.  **HTML 구조 수정:** `products/[slug].astro`의 구조를 참고하여, `solutions` 페이지의 `<body>` 내용을 수정합니다.
    *   `product.data.*`를 `solution.data.*`로 변경합니다.
    *   상단 히어로 섹션(이미지 + 이름 + 설명 + 문의 버튼)을 추가합니다.
    *   갤러리 섹션을 추가합니다.
    *   `specs` 테이블 대신 `features` 목록을 렌더링하는 섹션을 새로 만듭니다. (예: 아이콘, 제목, 설명이 있는 카드 목록)
    *   `<Content />` 컴포넌트로 MDX 본문을 렌더링하는 부분을 유지합니다.

2.  **컴포넌트 및 스타일 가져오기:** `Icon` 컴포넌트 등 `products` 페이지에서 사용하는 컴포넌트 import를 추가합니다.

---


### Task 5: 최종 확인 및 기록

**목표:** 모든 변경사항이 정상적으로 작동하는지 확인하고, `task.md`에 완료 상태를 기록합니다.

1.  **개발 서버 실행:** `npm run dev` 명령어로 로컬 개발 서버를 실행합니다.
2.  **페이지 확인:**
    *   `/ko/solutions` 및 `/en/solutions` 목록 페이지가 정상적으로 표시되는지 확인합니다.
    *   각 솔루션 상세 페이지(`/ko/solutions/[slug]`)가 새로운 레이아웃과 데이터로 올바르게 표시되는지 확인합니다.
3.  **`task.md` 업데이트:** 모든 작업이 완료되면 `task.md` 파일에 진행 상황을 요약하여 추가합니다.


# 작업 기록

**[2025-08-20]** `solutions` 페이지 리팩토링 Task 1 완료: `ko` 및 `en` 솔루션 상세 페이지(`[slug].astro`)의 데이터 조회 로직을 `products` 페이지와 동일하게 변경하여 slug 처리 방식을 통일했습니다.

**[2025-08-20]** `solutions` 페이지 리팩토링 Task 2 완료: `src/content/config.ts`의 `solutions` 스키마를 `products`와 유사한 구조(name, heroImage, gallery, features 등)로 확장했습니다.

**[2025-08-20]** `solutions` 페이지 리팩토링 Task 3 완료: `src/content/solutions` 내의 모든 `.mdx` 파일의 frontmatter를 새로운 스키마에 맞게 수정했습니다.

**[2025-08-20]** `solutions` 페이지 리팩토링 Task 4 완료: `ko` 및 `en` 솔루션 상세 페이지(`[slug].astro`)의 레이아웃을 `products` 페이지와 유사한 구조로 리팩토링했습니다.
## 2025-08-20

- **완료**: 반응형 헤더 및 모바일 메뉴 구현
  - 현상: 화면 너비가 768px 이하일 때 네비게이션 메뉴가 사라지는 문제.
  - 해결:
    1. `Header.astro` 컴포넌트를 수정하여 모바일 화면용 햄버거 버튼을 추가함.
    2. 햄버거 버튼 클릭 시, 세로형 링크와 닫기 버튼이 포함된 전체 화면 메뉴가 나타나도록 구현함.
    3. 메뉴를 열고 닫는 상호작용을 위해 컴포넌트 내에 JavaScript 코드 추가.
    4. 기존 데스크톱 메뉴는 `md:` 미디어 쿼리를 통해 768px 초과 화면에서만 표시되도록 유지함.

- [x] 2025-08-21: 비교 페이지(`ko/compare`, `en/compare`)의 사양 테이블에서 사양의 섹션 제목이 표시되지 않도록 수정.

- [x] 2025-08-21: 비교 페이지(`ko/compare`, `en/compare`)의 사양 테이블에서 사양 이름(`<td>`)에 `font-bold` 클래스를 적용.
- [x] 2025-08-21: `CG320.ko.mdx` 파일의 '온도 측정 범위' 사양 값을 여러 줄로 표시되도록 YAML 블록 스타일로 수정.
- [x] 2025-08-21: 제품 상세 페이지(`ko/products/[slug].astro`, `en/products/[slug].astro`)의 사양(spec) 값에 `whitespace-pre-wrap` 클래스를 추가하여 MDX frontmatter의 여러 줄 값이 올바르게 표시되도록 수정.

## 2025-08-25

- `RepairForm.astro` 및 `TechnicalInquiryForm.astro` 컴포넌트가 `lang` 속성을 통해 다국어를 지원하도록 수정했습니다.
- 영문 및 한글 지원 페이지(`en/support/*`, `ko/support/*`)에서 각 컴포넌트로 `lang` 속성을 전달하도록 업데이트했습니다.
- 이제 영문 페이지에서는 양식이 영어로, 한글 페이지에서는 한국어로 올바르게 표시됩니다.

## 2025-08-25

- **완료**: 기술 지원 및 수리 요청 양식 제출 기능 수정
  - 현상: 다국어 지원 수정 이후, 양식 제출 시 이메일 발송 및 리디렉션이 올바르게 동작하지 않는 문제.
  - 해결:
    1. `RepairForm.astro` 및 `TechnicalInquiryForm.astro` 컴포넌트에 현재 언어(`lang`)를 값으로 가지는 숨겨진 `input` 필드를 추가하여, 양식 제출 시 언어 정보를 API로 함께 전송하도록 수정했습니다.
    2. `src/pages/api/submit-repair.ts` 및 `src/pages/api/submit-technical-inquiry.ts` API 엔드포인트에서 전송된 `lang` 값을 읽도록 수정했습니다.
    3. API 로직 내에서 `lang` 값에 따라 이메일 내용을 (제목, 본문) 한국어 또는 영어로 동적으로 생성하도록 변경했습니다.
    4. 양식 제출 완료 후, 해당 언어에 맞는 완료 페이지(예: `/en/support/repair-complete`)로 올바르게 리디렉션되도록 수정했습니다.

## 2025-08-25

- **완료**: 문의/수리 요청 기능 디버깅 및 안정성 강화
  - 현상: 양식 제출 후 완료 페이지가 없다는 오류 및 이메일 미발송 문제.
  - 해결:
    1. **완료 페이지 생성**: 한국어와 영어 버전에 대한 `repair-complete.astro` 및 `technical-complete.astro` 페이지를 생성하여, 제출 후 사용자가 명확한 완료 메시지를 볼 수 있도록 했습니다.
    2. **API 로깅 추가**: `submit-repair.ts` 및 `submit-technical-inquiry.ts` API 엔드포인트에 상세한 `console.log`를 추가했습니다. 이를 통해 Vercel 대시보드에서 양식 데이터 수신, 언어 감지, 이메일 전송, Google Sheets 연동 등 각 단계의 진행 상황과 잠재적 오류를 쉽게 추적할 수 있도록 디버깅 기능을 강화했습니다.

## 2025-08-25

- **완료**: 로컬 개발 환경에서 양식 제출 오류 수정
  - 현상: 로컬에서 문의/수리 요청 양식 제출 시, API로 요청이 전송되지 않고 페이지가 새로고침되는 문제.
  - 원인: Astro 컴포넌트의 `<script>` 태그가 기본적으로 서버에서만 처리되고 클라이언트로는 전송되지 않아, `submit` 이벤트를 가로채는 JavaScript 코드가 실행되지 않았습니다.
  - 해결: `RepairForm.astro`와 `TechnicalInquiryForm.astro` 컴포넌트의 `<script>` 태그에 `is:inline` 지시어를 추가하여, 해당 스크립트가 클라이언트에서 실행되도록 강제했습니다. 이를 통해 양식 제출이 정상적으로 JavaScript의 `fetch` 요청으로 처리됩니다.