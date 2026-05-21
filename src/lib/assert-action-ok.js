/** Editor onSave에서 Server Action 결과 확인 */
export function assertActionOk(result) {
  if (result && typeof result === 'object' && result.ok === false) {
    throw new Error(result.error || '저장에 실패했습니다.');
  }
}
