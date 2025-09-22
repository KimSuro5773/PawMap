import { useMemo } from "react";
import { useCategoryCode } from "@/api/hooks/useTour";
import styles from "./CategoryTag.module.scss";

const CategoryTag = ({ cat1, cat2, cat3, className }) => {
  // cat3이 있으면 cat3으로, cat3이 없고 cat2가 있으면 cat2로, 그것도 없으면 cat1로 조회
  const targetCategory = cat3 || cat2 || cat1;
  const parentCategory = cat3 ? cat2 : cat2 ? cat1 : null;

  // API 파라미터 설정
  const categoryParams = useMemo(() => {
    if (!targetCategory) return null;

    const params = {};

    if (cat3) {
      // cat3을 조회하는 경우
      params.cat1 = cat1;
      params.cat2 = cat2;
    } else if (cat2) {
      // cat2를 조회하는 경우
      params.cat1 = cat1;
    }
    // cat1만 있는 경우는 파라미터 없이 조회

    return params;
  }, [cat1, cat2, cat3]);

  const { data: categoryData, isLoading } = useCategoryCode(categoryParams, {
    enabled: !!targetCategory,
  });

  // 카테고리 텍스트 추출
  const categoryText = useMemo(() => {
    if (isLoading) return "로딩중...";
    if (!categoryData?.response?.body?.items?.item) return "카테고리";

    const items = categoryData.response.body.items.item;
    const categoryList = Array.isArray(items) ? items : [items];

    console.log(categoryList);
    // 현재 타겟 카테고리와 매칭되는 항목 찾기
    const matchedCategory = categoryList.find((item) => {
      if (cat3) {
        return item.code === cat3;
      } else if (cat2) {
        return item.code === cat2;
      } else {
        return item.code === cat1;
      }
    });

    if (matchedCategory) {
      return matchedCategory.name || "카테고리";
    }

    return "카테고리";
  }, [categoryData, cat1, cat2, cat3, isLoading]);

  return (
    <div className={`${styles.categoryTag} ${className || ""}`}>
      {categoryText}
    </div>
  );
};

export default CategoryTag;
