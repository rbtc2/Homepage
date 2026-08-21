import { mergeAttributes, Node } from '@tiptap/core';

const YT_ID = /^[A-Za-z0-9_-]{11}$/;

export function parseYoutubeId(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return null;
  if (YT_ID.test(raw)) return raw;

  const withProto = /^(https?:)?\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProto);
    const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '');
    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0] ?? '';
      return YT_ID.test(id) ? id : null;
    }
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const v = url.searchParams.get('v');
      if (v && YT_ID.test(v)) return v;
      const parts = url.pathname.split('/').filter(Boolean);
      const embedAt = parts.indexOf('embed');
      if (embedAt >= 0 && YT_ID.test(parts[embedAt + 1] ?? '')) return parts[embedAt + 1];
      const shortsAt = parts.indexOf('shorts');
      if (shortsAt >= 0 && YT_ID.test(parts[shortsAt + 1] ?? '')) return parts[shortsAt + 1];
      const liveAt = parts.indexOf('live');
      if (liveAt >= 0 && YT_ID.test(parts[liveAt + 1] ?? '')) return parts[liveAt + 1];
    }
  } catch {
    return null;
  }
  return null;
}

export function youtubeEmbedSrc(videoId) {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

function readVideoId(el) {
  if (!(el instanceof HTMLElement)) return null;
  const fromData = el.getAttribute('data-youtube-id');
  if (fromData) return parseYoutubeId(fromData);
  const iframe = el.tagName === 'IFRAME' ? el : el.querySelector('iframe');
  const src = iframe?.getAttribute('src');
  return src ? parseYoutubeId(src) : null;
}

export const EditorYoutube = Node.create({
  name: 'editorYoutube',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      videoId: {
        default: null,
        parseHTML: (el) => readVideoId(el),
        renderHTML: (attrs) =>
          attrs.videoId ? { 'data-youtube-id': attrs.videoId } : {},
      },
    };
  },

  parseHTML() {
    return [
      { tag: 'div.ep-yt-block' },
      { tag: 'iframe[src*="youtube"]' },
      { tag: 'iframe[src*="youtube-nocookie"]' },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const videoId = parseYoutubeId(node.attrs.videoId);
    if (!videoId) {
      return ['div', { class: 'ep-yt-block ep-yt-block--empty' }];
    }
    return [
      'div',
      mergeAttributes({ class: 'ep-yt-block' }, HTMLAttributes),
      [
        'iframe',
        {
          class: 'ep-yt-block__frame',
          src: youtubeEmbedSrc(videoId),
          title: 'YouTube video',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          allowfullscreen: 'true',
          referrerpolicy: 'strict-origin-when-cross-origin',
          loading: 'lazy',
        },
      ],
    ];
  },

  addCommands() {
    return {
      setYoutubeVideo:
        (url) =>
        ({ commands }) => {
          const videoId = parseYoutubeId(url);
          if (!videoId) return false;
          return commands.insertContent({
            type: this.name,
            attrs: { videoId },
          });
        },
    };
  },
});
