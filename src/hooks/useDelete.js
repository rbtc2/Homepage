'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 게시물 삭제 공통 로직 훅.
 * @param {(id: number) => Promise<void>} deleteFn - 도메인 삭제 Server Action
 * @returns {{ deleteTarget, setDeleteTarget, deleting, handleDelete }}
 */
export function useDelete(deleteFn) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && deleteTarget) setDeleteTarget(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [deleteTarget]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteFn(deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      console.error('[useDelete]', err);
      const msg =
        err instanceof Error && err.message
          ? err.message
          : '삭제에 실패했습니다. 다시 시도해 주세요.';
      alert(msg);
    } finally {
      setDeleting(false);
    }
  };

  return { deleteTarget, setDeleteTarget, deleting, handleDelete };
}
