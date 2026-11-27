import Link from 'next/link';
import GalleryMedia from './GalleryMedia';

const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}/;

export default function GalleryLead({ post, basePath }) {
  const dateTime = DATE_PREFIX.test(post.createdAt) ? post.createdAt : undefined;

  return (
    <Link href={`${basePath}/${post.id}`} className="gallery-lead">
      <span className="gallery-lead__frame">
        <GalleryMedia
          post={post}
          sizes="(max-width: 768px) 100vw, 590px"
          priority
        />
      </span>
      <span className="gallery-lead__body">
        <h2 className="gallery-lead__title">
          {post.isSecret ? '🔒 ' : ''}
          {post.title}
        </h2>
        {post.createdAt ? (
          <time className="gallery-lead__date" dateTime={dateTime}>
            {post.createdAt}
          </time>
        ) : null}
      </span>
    </Link>
  );
}
