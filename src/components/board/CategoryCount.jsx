/** 분류 필터가 켜져 있을 때 BoardMeta 에 보여주는 "분류명 N건" 문구. */
export default function CategoryCount({ label, count, locale = 'ko' }) {
  if (!label) return null;
  return locale === 'en' ? (
    <>
      <strong>{label}</strong>
      {' · '}
      <strong>{count}</strong>
    </>
  ) : (
    <>
      <strong>{label}</strong>
      {' '}
      <strong>{count}</strong>
      건
    </>
  );
}
