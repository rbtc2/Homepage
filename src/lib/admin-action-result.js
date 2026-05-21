/** Server Action → 클라이언트 직렬화용 (throw 대신 사용하면 프로덕션에서도 메시지 전달) */
export function actionOk() {
  return { ok: true };
}

export function actionFail(error) {
  const message =
    typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : '저장에 실패했습니다.';
  return { ok: false, error: message || '저장에 실패했습니다.' };
}
