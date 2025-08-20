# 제품 비교 기능 구현 계획

**목표:** 사용자가 제품 목록 페이지에서 최대 2개의 제품을 선택하고, 별도의 비교 페이지에서 두 제품의 사양을 나란히 비교할 수 있는 기능을 구현합니다.

---

### Task 1: UI/UX - 제품 카드 호버 효과 및 버튼 추가

**목표:** 제품 목록의 각 카드에 마우스를 올렸을 때 "제품 보기"와 "제품 담기" 버튼이 나타나는 UI를 구현합니다.

1.  **`ProductCard.astro` 컴포넌트 수정:**
    *   기존 카드 내용을 `div`로 감싸고 `group` 클래스를 추가하여 호버 효과의 기준을 만듭니다.
    *   카드 위에 오버레이 `div`를 추가합니다. 이 `div`는 기본적으로 숨겨져 있다가 (`opacity-0`), `group-hover:opacity-100` 클래스를 통해 호버 시 나타나도록 설정합니다. 오버레이에는 반투명한 검은색 배경을 추가합니다.
    *   오버레이 내부에 "제품 보기"와 "제품 담기" 버튼을 배치합니다.
    *   "제품 보기" 버튼은 기존처럼 상세 페이지로 이동하는 `<a>` 태그입니다.
    *   "제품 담기" 버튼은 `button` 태그로 만들고, 제품의 slug(또는 ID)를 식별할 수 있도록 `data-product-slug` 같은 속성을 추가합니다.

**[2025-08-20] 진행 상황: 완료**
*   `src/components/ProductCard.astro` 컴포넌트에 호버 시 오버레이와 버튼이 표시되도록 UI를 수정했습니다.
*   `src/pages/ko/products/index.astro` 와 `src/pages/en/products/index.astro`에서 `ProductCard` 컴포넌트로 `slug` prop을 전달하도록 수정했습니다.

---

### Task 2: 클라이언트 측 상태 관리 설정 (Nano Stores)

**목표:** 선택된 비교 제품 목록을 클라이언트 측에서 관리하기 위해 상태 관리 라이브러리(Nano Stores)를 설정합니다.

1.  **Nano Stores 설치:**
    *   `npm install nanostores`
    *   Astro와 함께 사용할 프레임워크(React 등)가 있다면 해당 바인딩도 설치합니다. (예: `@nanostores/react`). 우선 바닐라 JS로 접근합니다.

2.  **Store 생성:**
    *   `src/stores/compareStore.ts` 파일을 생성합니다.
    *   `atom`을 사용하여 비교할 제품 목록(slug 배열)을 저장하는 store를 정의합니다.
    *   최대 2개의 제품만 담을 수 있도록 아이템을 추가/제거하는 헬퍼 함수를 store에 정의합니다.
        *   `addProduct(slug)`: 목록에 제품이 2개 미만이고, 해당 제품이 아직 목록에 없을 때만 추가합니다.
        *   `removeProduct(slug)`: 목록에서 제품을 제거합니다.
        *   `isFull()`: 목록이 꽉 찼는지 확인합니다.

**[2025-08-20] 진행 상황: 완료**
*   `npm install nanostores` 명령어로 라이브러리를 설치했습니다.
*   `src/stores/compareStore.ts` 파일을 생성하고, `compareProducts` atom과 관련 헬퍼 함수들을 정의했습니다.

---

### Task 3: "제품 담기" 기능 구현

**목표:** "제품 담기" 버튼 클릭 시, 해당 제품을 비교 store에 추가하는 로직을 구현합니다.

1.  **클라이언트 스크립트 추가:**
    *   제품 목록 페이지(`src/pages/ko/products/index.astro` 등)에 `<script>` 태그를 추가합니다.
    *   `compareStore.ts`에서 정의한 `addProduct` 함수를 import 합니다.
    *   페이지의 모든 "제품 담기" 버튼(`[data-product-slug]`)에 `click` 이벤트 리스너를 추가합니다.
    *   클릭 시, `data-product-slug` 값을 가져와 `addProduct` 함수를 호출하여 해당 제품을 store에 추가합니다.
    *   Store가 꽉 찼을 경우, 사용자에게 알림(예: `alert('최대 2개까지 담을 수 있습니다.')`)을 띄우거나 버튼을 비활성화하는 로직을 추가합니다.

**[2025-08-20] 진행 상황: 완료**
*   `ko` 및 `en` 제품 목록 페이지에 클라이언트 스크립트를 추가했습니다.
*   스크립트는 `compareStore`와 연동하여 "제품 담기" 버튼 클릭 시 제품을 비교 목록에 추가합니다.
*   비교 목록의 상태에 따라 버튼의 텍스트("담겨있음", "비교함 가득참")가 변경되고 비활성화되도록 하여 사용자 피드백을 개선했습니다.

---

### Task 4: 비교 위젯 UI 구현

**목표:** 화면 하단 등에 현재 비교함에 담긴 제품을 보여주고, 비교 페이지로 이동할 수 있는 위젯을 만듭니다.

1.  **`CompareWidget.astro` (또는 React/Svelte 컴포넌트) 생성:**
    *   이 컴포넌트는 클라이언트에서만 렌더링되어야 하므로 `client:only` 지시어를 사용해야 할 수 있습니다. React나 Svelte 같은 UI 프레임워크를 사용하는 것이 상태에 따른 UI 업데이트에 더 용이합니다. (React로 가정하고 진행)
    *   `@nanores/react`의 `useStore` 훅을 사용하여 비교 store의 상태를 구독합니다.
    *   Store에 담긴 제품 목록을 화면에 표시합니다. (제품 이름과 '제거' 버튼 포함)
    *   '제거' 버튼 클릭 시 store의 `removeProduct` 함수를 호출합니다.
    *   Store에 제품이 2개 담기면 "비교하기" 버튼을 활성화합니다.
    *   "비교하기" 버튼 클릭 시, store에 있는 두 제품의 slug를 쿼리 파라미터로 사용하여 `/ko/compare` 페이지로 이동시킵니다. (예: `/ko/compare?products=cg320,cg640ip`)

2.  **레이아웃에 위젯 추가:**
    *   `BaseLayout.astro` 파일에 `CompareWidget` 컴포넌트를 추가하여 모든 페이지에 표시되도록 합니다.

**[2025-08-20] 진행 상황: 완료**
*   `@astrojs/react`와 `@nanostores/react` 라이브러리를 설치하고 `astro.config.mjs`에 React 통합 설정을 추가했습니다.
*   `src/components/CompareWidget.tsx` React 컴포넌트를 생성했습니다. 이 위젯은 비교할 상품 목록을 보여주고, 목록에서 상품을 제거하거나 비교 페이지로 이동하는 기능을 포함합니다.
*   `src/layouts/BaseLayout.astro`에 위젯을 추가하여 모든 페이지에서 비교 위젯이 표시되도록 설정했습니다.

---

### Task 5: 비교 페이지 구현

**목표:** 두 제품의 이미지와 사양을 나란히 보여주는 비교 페이지를 생성합니다.

1.  **`src/pages/ko/compare.astro` 페이지 생성:**
    *   URL 쿼리 파라미터(`Astro.url.searchParams`)에서 `products` 값을 가져옵니다.
    *   값을 파싱하여 두 제품의 slug를 얻습니다.
    *   `getCollection('products')`를 사용하여 두 제품의 전체 데이터를 가져옵니다.

2.  **비교 UI 구현:**
    *   페이지를 2단으로 분할합니다.
    *   왼쪽과 오른쪽에 각각 제품의 `heroImage`를 표시합니다.
    *   그 아래에 각 제품의 `name`과 `shortDesc`를 표시합니다.
    *   `specs` 데이터를 테이블 형태로 나란히 비교하여 렌더링합니다.
        *   두 제품의 모든 `spec` 키를 합쳐서 전체 행을 구성하고, 각 제품에 해당 `spec`이 있으면 값을 표시하고 없으면 '-'로 표시하는 로직을 구현합니다.

3.  **영문 페이지 생성:**
        *   `src/pages/en/compare.astro`를 만들고 위와 동일한 로직을 영어 기준으로 구현합니다.

**[2025-08-20] 진행 상황: 완료**
*   `src/pages/ko/compare.astro` 및 `src/pages/en/compare.astro` 파일을 생성했습니다.
*   URL 쿼리 파라미터에서 제품 slug를 가져와 해당 제품 데이터를 조회하고, 두 제품의 이미지와 사양을 나란히 비교하는 UI를 구현했습니다.

---

# 제품 비교 기능 구현 최종 완료

**[2025-08-20] 최종 완료:**
*   제품 비교 기능의 모든 Task가 성공적으로 구현되었습니다.
*   제품 카드 호버 효과, 비교함 상태 관리, 비교 위젯 UI, 그리고 제품 비교 페이지가 모두 작동합니다.
*   빌드 오류 및 런타임 오류가 해결되었습니다.
