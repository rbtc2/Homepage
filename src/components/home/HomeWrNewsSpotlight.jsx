import Link from 'next/link';
import Image from 'next/image';
import { getWrNewsPage } from '@/lib/wr-news';

const BASE = '/wr-news';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function excerptFromHtml(html, maxLen) {
  if (!html || typeof html !== 'string') return '';
  const plain = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen).trim()}…`;
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeaturedCard({ post }) {
  const href = `${BASE}/${post.id}`;
  const excerpt = excerptFromHtml(post.content, 160);
  const dateLabel = formatDate(post.createdAt);

  return (
    <Link href={href} className="hw-spotlight__lead">
      <div className="hw-spotlight__lead-visual">
        <div className="hw-spotlight__lead-media">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="hw-spotlight__lead-img"
              priority
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="hw-spotlight__lead-placeholder" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="4" y="8" width="32" height="25" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="14" cy="17" r="3.5" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M4 27l9-8 6 5 5-4 12 10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="hw-spotlight__lead-overlay">
          <h3 className="hw-spotlight__lead-title">{post.title}</h3>
          {excerpt ? <p className="hw-spotlight__lead-excerpt">{excerpt}</p> : null}
          <div className="hw-spotlight__lead-meta">
            <span>{post.author}</span>
            {dateLabel ? (
              <>
                <span className="hw-spotlight__meta-dot" aria-hidden="true" />
                <time dateTime={post.createdAt}>{dateLabel}</time>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

function SideCard({ post }) {
  const href = `${BASE}/${post.id}`;
  const excerpt = excerptFromHtml(post.content, 96);
  const dateLabel = formatDate(post.createdAt);

  return (
    <Link href={href} className="hw-spotlight__side">
      <div className="hw-spotlight__side-media">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="hw-spotlight__side-img"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="hw-spotlight__side-placeholder" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect x="3" y="6" width="26" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="11" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M3 22l7-6 5 4 4-3 10 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="hw-spotlight__side-body">
        <h3 className="hw-spotlight__side-title">{post.title}</h3>
        {excerpt ? <p className="hw-spotlight__side-excerpt">{excerpt}</p> : null}
        {dateLabel ? (
          <time className="hw-spotlight__side-date" dateTime={post.createdAt}>
            {dateLabel}
          </time>
        ) : null}
      </div>
    </Link>
  );
}

export default async function HomeWrNewsSpotlight() {
  const { items } = await getWrNewsPage({ page: 1, itemsPerPage: 3 });
  const [featured, ...rest] = items;
  const sidePosts = rest.slice(0, 2);

  return (
    <section className="hw-spotlight" aria-label="진행 예정 WR뉴스">
      <header className="hw-spotlight__head">
        <p className="hw-spotlight__eyebrow">WR News</p>
        <hr className="hw-spotlight__rule" />
        <Link href={BASE} className="hw-spotlight__more" aria-label="WR뉴스 전체보기">
          전체보기
          <ArrowIcon />
        </Link>
      </header>

      <h2 className="hw-spotlight__title">진행 예정</h2>

      {items.length === 0 ? (
        <p className="hw-spotlight__empty">
          등록된 WR뉴스가 없습니다.{' '}
          <Link href={BASE} className="hw-spotlight__empty-link">
            WR뉴스 목록
          </Link>
          을 확인해 주세요.
        </p>
      ) : (
        <div
          className={
            sidePosts.length === 0
              ? 'hw-spotlight__body hw-spotlight__body--single'
              : 'hw-spotlight__body'
          }
        >
          {featured ? <FeaturedCard post={featured} /> : null}
          {sidePosts.length > 0 ? (
            <div className="hw-spotlight__stack">
              {sidePosts.map((post) => (
                <SideCard key={post.id} post={post} />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
