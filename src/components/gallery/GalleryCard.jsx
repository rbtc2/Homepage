import Link from 'next/link';
import GalleryMedia from './GalleryMedia';

const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}/;

export default function GalleryCard({ post, basePath, priority = false }) {
  const dateTime = DATE_PREFIX.test(post.createdAt) ? post.createdAt : undefined;

  return (
    <Link href={`${basePath}/${post.id}`} className="gallery-card">
      <span className="gallery-card__frame">
        <GalleryMedia
          post={post}
          sizes="(max-width: 768px) 100vw, 560px"
          priority={priority}
        />
      </span>
      <span className="gallery-card__body">
        <p className="gallery-card__title">
          {post.isSecret ? '🔒 ' : ''}
          {post.title}
        </p>
        {post.createdAt ? (
          <time className="gallery-card__date" dateTime={dateTime}>
            {post.createdAt}
          </time>
        ) : null}
      </span>
    </Link>
  );
}
