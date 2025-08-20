## 2025-08-20 (재수정)

- **완료**: 제품 비교 페이지 데이터 조회 오류 재수정
  - 현상: 이전 수정 이후, 비교 페이지에서 제품 정보를 전혀 불러오지 못하는 문제 발생 (`Please select two products to compare` 메시지 표시)
  - 원인: `id`를 기준으로 컨텐츠를 필터링하고, `product.slug`를 `replace(\.en$/, '')`와 같이 잘못된 정규식으로 처리하여 URL 파라미터와 슬러그가 불일치함.
  - 해결: `[slug].astro` 페이지와 동일한 방식으로, MDX frontmatter의 `lang` 속성을 기준으로 컨텐츠를 필터링 (`data.lang === 'en'`). 이후 Astro에서 생성된 슬러그(예: `cg320en`)의 언어 코드만 제거(`replace(/en$/, '')`)하도록 수정하여 문제를 해결함.