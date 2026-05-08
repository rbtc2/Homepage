import crypto from 'node:crypto';

const KEY_LENGTH = 64;

function normalizePassword(password) {
  return String(password ?? '').trim();
}

export function hashSecretPassword(password) {
  const normalized = normalizePassword(password);
  if (!normalized) throw new Error('비밀번호를 입력해 주세요.');

  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(normalized, salt, KEY_LENGTH).toString('hex');
  return `scrypt$${salt}$${derivedKey}`;
}

export function verifySecretPassword(password, storedHash) {
  const normalized = normalizePassword(password);
  if (!normalized || !storedHash) return false;

  const [algorithm, salt, expectedHash] = String(storedHash).split('$');
  if (algorithm !== 'scrypt' || !salt || !expectedHash) return false;

  const actualHash = crypto.scryptSync(normalized, salt, KEY_LENGTH).toString('hex');
  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  const actualBuffer = Buffer.from(actualHash, 'hex');
  if (expectedBuffer.length !== actualBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}
