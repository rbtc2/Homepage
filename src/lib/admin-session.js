import { SignJWT, jwtVerify } from 'jose';

/** httpOnly 쿠키 이름 (값은 서명된 JWT) */
export const ADMIN_SESSION_COOKIE = 'auth_token';

const MAX_AGE_SEC = 60 * 60 * 8;

function getSecretBytes() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) return null;
  return new TextEncoder().encode(s);
}

/**
 * 로그인 성공 시 쿠키에 넣을 JWT 생성
 * @throws {Error} ADMIN_SESSION_SECRET 미설정 시
 */
export async function signAdminSession() {
  const secret = getSecretBytes();
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET must be set (min 32 characters)');
  }
  return new SignJWT({ sub: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SEC}s`)
    .sign(secret);
}

/**
 * 미들웨어·API에서 쿠키 값 검증
 * @param {string|undefined} token
 */
export async function verifyAdminSession(token) {
  const secret = getSecretBytes();
  if (!secret || !token) return false;
  try {
    await jwtVerify(token, secret, { algorithms: ['HS256'] });
    return true;
  } catch {
    return false;
  }
}

export { MAX_AGE_SEC };
