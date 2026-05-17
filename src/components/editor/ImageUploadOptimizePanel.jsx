'use client';

import { useCallback, useEffect, useState } from 'react';
import { formatFileSize, formatReductionPercent } from '@/lib/format-file-size';
import {
  IMAGE_QUALITY_OPTIONS,
  isOptimizableImage,
  optimizeImageFile,
} from '@/lib/optimize-image-client';
import { uploadEditorImageFile } from '@/lib/upload-editor-image-client';

export default function ImageUploadOptimizePanel({
  file,
  folder,
  applyLabel = '업로드 후 적용',
  onSuccess,
  onCancel,
}) {
  const [preset, setPreset] = useState('medium');
  const [readyFile, setReadyFile] = useState(null);
  const [optimizeInfo, setOptimizeInfo] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const canOptimize = isOptimizableImage(file);
  const isOriginalPreset = preset === 'original';
  const busy = optimizing || uploading;

  useEffect(() => {
    setPreset('medium');
    setReadyFile(null);
    setOptimizeInfo(null);
    setError(null);
  }, [file]);

  const handlePresetChange = useCallback((next) => {
    setPreset(next);
    setReadyFile(null);
    setOptimizeInfo(null);
    setError(null);
  }, []);

  const handleOptimize = useCallback(async () => {
    setError(null);
    setOptimizing(true);
    try {
      const result = await optimizeImageFile(file, preset);
      setReadyFile(result.file);
      setOptimizeInfo({
        originalBytes: result.originalBytes,
        resultBytes: result.resultBytes,
        percent: formatReductionPercent(result.originalBytes, result.resultBytes),
        isOriginal: result.skipped,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : '최적화에 실패했습니다.';
      setError(msg);
    } finally {
      setOptimizing(false);
    }
  }, [file, preset]);

  const handleUpload = useCallback(async () => {
    setError(null);
    const toUpload = isOriginalPreset ? file : readyFile;
    if (!toUpload) {
      setError('먼저 「최적화」를 눌러 주세요.');
      return;
    }

    setUploading(true);
    try {
      const res = await uploadEditorImageFile(toUpload, folder);
      if (res.ok) {
        onSuccess(res.url);
      } else {
        setError(res.message);
      }
    } catch {
      setError('업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setUploading(false);
    }
  }, [file, folder, isOriginalPreset, readyFile, onSuccess]);

  const uploadDisabled =
    busy || (!isOriginalPreset && !readyFile) || (isOriginalPreset && !file);

  return (
    <div className="iop" aria-live="polite">
      <p className="iop__file" title={file.name}>
        <span className="iop__file-name">{file.name}</span>
        <span className="iop__file-size">{formatFileSize(file.size)}</span>
      </p>

      {!canOptimize ? (
        <p className="iop__note">GIF는 최적화하지 않고 원본 그대로 업로드됩니다.</p>
      ) : null}

      <fieldset className="iop__presets" disabled={busy}>
        <legend className="iop__presets-legend">업로드 방식</legend>
        {IMAGE_QUALITY_OPTIONS.map((opt) => {
          const disabled = !canOptimize && opt.id !== 'original';
          return (
            <label
              key={opt.id}
              className={`iop__preset${disabled ? ' iop__preset--disabled' : ''}`}
            >
              <input
                type="radio"
                name="image-quality-preset"
                value={opt.id}
                checked={preset === opt.id}
                disabled={disabled || busy}
                onChange={() => handlePresetChange(opt.id)}
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </fieldset>

      {canOptimize && !isOriginalPreset ? (
        <button
          type="button"
          className="iop__btn iop__btn--secondary"
          disabled={busy}
          onClick={handleOptimize}
        >
          {optimizing ? '최적화 중…' : '최적화'}
        </button>
      ) : null}

      {optimizeInfo && !optimizeInfo.isOriginal && optimizeInfo.percent > 0 ? (
        <p className="iop__result iop__result--ok">
          {formatFileSize(optimizeInfo.originalBytes)} → {formatFileSize(optimizeInfo.resultBytes)}{' '}
          <strong>(약 {optimizeInfo.percent}% 감소)</strong>
        </p>
      ) : null}

      {optimizeInfo && optimizeInfo.isOriginal && !isOriginalPreset ? (
        <p className="iop__result">이미 웹에 적합한 크기라 용량 변화가 거의 없습니다.</p>
      ) : null}

      {error ? <p className="iop__hint iop__hint--err">{error}</p> : null}

      <div className="iop__actions">
        {onCancel ? (
          <button type="button" className="iop__btn iop__btn--ghost" disabled={busy} onClick={onCancel}>
            취소
          </button>
        ) : null}
        <button
          type="button"
          className="iop__btn iop__btn--primary"
          disabled={uploadDisabled}
          onClick={handleUpload}
        >
          {uploading ? '업로드 중…' : applyLabel}
        </button>
      </div>
    </div>
  );
}
