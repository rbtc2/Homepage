'use client';

import { useEffect } from 'react';

export default function ViewTracker({ table, id }) {
  useEffect(() => {
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, id }),
    }).catch(() => {});
  }, [table, id]);

  return null;
}
