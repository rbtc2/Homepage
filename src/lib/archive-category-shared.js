export const CATEGORY_NAME_MAX = 20;
export const CATEGORY_NAME_EN_MAX = 40;

export function categoryLabel(category, locale = 'ko') {
  if (!category) return '';
  if (locale === 'en') {
    const english = category.nameEn?.trim();
    if (english) return english;
  }
  return category.name?.trim() ?? '';
}

/** 토글이 꺼져 있거나 분류가 없으면 빈 문자열. */
export function visibleCategoryLabel(state, categoryId, locale = 'ko') {
  if (!state?.enabled || categoryId == null || categoryId === '') return '';
  const category = state.categories.find((item) => item.id === String(categoryId));
  return categoryLabel(category, locale);
}

export function archivePublicPath(locale) {
  return locale === 'en' ? '/en/archive' : '/archive';
}

export function parseCategoryInput({ name, nameEn }) {
  const trimmed = String(name ?? '').trim();
  const trimmedEn = String(nameEn ?? '').trim();
  if (!trimmed) return { error: '분류 이름을 입력해 주세요.' };
  if (trimmed.length > CATEGORY_NAME_MAX) {
    return { error: `분류 이름은 ${CATEGORY_NAME_MAX}자 이내로 입력해 주세요.` };
  }
  if (trimmedEn.length > CATEGORY_NAME_EN_MAX) {
    return { error: `영어 이름은 ${CATEGORY_NAME_EN_MAX}자 이내로 입력해 주세요.` };
  }
  return { name: trimmed, nameEn: trimmedEn };
}

export function duplicateCategoryMessage(categories, { name, nameEn, exceptId }) {
  const nameKey = name.toLowerCase();
  const enKey = nameEn.toLowerCase();
  for (const category of categories) {
    if (exceptId && category.id === String(exceptId)) continue;
    if (category.name.trim().toLowerCase() === nameKey) {
      return '같은 이름의 분류가 이미 있습니다.';
    }
    if (enKey && category.nameEn.trim().toLowerCase() === enKey) {
      return '같은 영어 이름의 분류가 이미 있습니다.';
    }
  }
  return '';
}
