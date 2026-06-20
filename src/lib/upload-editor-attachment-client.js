/**
 * @param {File} file
 * @param {string} [displayName]
 * @returns {Promise<{ ok: true, url: string, fileName: string } | { ok: false, message: string }>}
 */
export async function uploadEditorAttachmentFile(file, displayName = '') {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('folder', 'editor-attachments');
  if (displayName.trim()) {
    fd.append('displayName', displayName.trim());
  }

  let res;
  try {
    res = await fetch('/api/admin/upload-attachment', {
      method: 'POST',
      body: fd,
      credentials: 'include',
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : '';
    return {
      ok: false,
      message: msg
        ? `네트워크 오류: ${msg}`
        : '서버에 연결하지 못했습니다. 개발 서버가 실행 중인지 확인해 주세요.',
    };
  }

  let data;
  try {
    data = await res.json();
  } catch {
    return {
      ok: false,
      message:
        res.status === 413
          ? '파일이 너무 큽니다. 20MB 이하 파일을 사용해 주세요.'
          : res.status === 400
            ? '업로드 요청이 올바르지 않습니다. 표시 파일명·파일 형식을 확인해 주세요.'
            : `업로드 응답을 처리하지 못했습니다. (HTTP ${res.status})`,
    };
  }

  if (!data || typeof data.ok !== 'boolean') {
    return { ok: false, message: '업로드 응답 형식이 올바르지 않습니다.' };
  }

  if (!data.ok && res.status === 401) {
    return { ok: false, message: data.message || '관리자로 로그인한 뒤 다시 시도해 주세요.' };
  }

  return data;
}
