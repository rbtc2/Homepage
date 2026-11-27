import {
  getBoardCategoryState,
  getBoardCategoryStateAdmin,
  resolveBoardCategoryField,
  revalidateBoardCategories,
} from './board-categories';

export {
  CATEGORY_NAME_MAX,
  CATEGORY_NAME_EN_MAX,
  categoryLabel,
  visibleCategoryLabel,
  archivePublicPath,
  parseCategoryInput,
  duplicateCategoryMessage,
} from './archive-category-shared';

/** 공개 페이지용. 테이블이 아직 없으면 분류 없음으로 본다. */
export const getArchiveCategoryState = (options) => getBoardCategoryState('archive', options);

/** 관리자 저장 직후 조회. 글 수를 포함한다. */
export const getArchiveCategoryStateAdmin = () => getBoardCategoryStateAdmin('archive');

export const resolveArchiveCategoryField = (categoryId) =>
  resolveBoardCategoryField('archive', categoryId);

export const revalidateArchiveBoard = (id) => revalidateBoardCategories('archive', id);
