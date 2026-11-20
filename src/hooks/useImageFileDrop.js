'use client';

import { useCallback, useRef, useState } from 'react';
import { pickAcceptedImageFile } from '@/lib/image-file-accept';

/**
 * 이미지 파일 드래그 앤 드롭 영역용 핸들러.
 *
 * @param {{
 *   disabled?: boolean
 *   onFile: (file: File) => void
 *   onInvalid?: () => void
 * }} options
 */
export function useImageFileDrop({ disabled = false, onFile, onInvalid }) {
  const [isDragging, setIsDragging] = useState(false);
  const depthRef = useRef(0);

  const resetDrag = useCallback(() => {
    depthRef.current = 0;
    setIsDragging(false);
  }, []);

  const onDragEnter = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      if (![...e.dataTransfer.types].includes('Files')) return;
      depthRef.current += 1;
      setIsDragging(true);
    },
    [disabled]
  );

  const onDragOver = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      e.dataTransfer.dropEffect = 'copy';
    },
    [disabled]
  );

  const onDragLeave = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      depthRef.current = Math.max(0, depthRef.current - 1);
      if (depthRef.current === 0) setIsDragging(false);
    },
    [disabled]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      resetDrag();
      if (disabled) return;

      const file = pickAcceptedImageFile(e.dataTransfer.files);
      if (!file) {
        onInvalid?.();
        return;
      }
      onFile(file);
    },
    [disabled, onFile, onInvalid, resetDrag]
  );

  return {
    isDragging,
    dropZoneProps: {
      onDragEnter,
      onDragOver,
      onDragLeave,
      onDrop,
    },
  };
}
