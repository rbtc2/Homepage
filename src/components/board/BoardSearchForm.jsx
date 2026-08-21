export default function BoardSearchForm({
  basePath,
  ariaLabel,
  defaultValue,
  locale = 'ko',
  placeholder,
  submitLabel,
}) {
  const ph = placeholder ?? (locale === 'en' ? 'Search titles or content' : '제목 또는 내용으로 검색');
  const submit = submitLabel ?? (locale === 'en' ? 'Search' : '검색');
  return (
    <form
      method="get"
      action={basePath}
      className="notice-search"
      role="search"
      aria-label={ariaLabel}
    >
      <div className="notice-search__field">
        <svg
          className="notice-search__icon"
          width="16" height="16" viewBox="0 0 16 16"
          fill="none" aria-hidden="true"
        >
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          name="q"
          className="notice-search__input"
          placeholder={ph}
          defaultValue={defaultValue}
          autoComplete="off"
        />
      </div>
      <button type="submit" className="notice-search__btn">{submit}</button>
    </form>
  );
}
