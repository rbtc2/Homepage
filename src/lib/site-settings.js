import { unstable_cache } from 'next/cache';
import { supabase } from './supabase';

/** DB 마이그레이션 전·오류 시 푸터 기본값 */
export const DEFAULT_SITE_FOOTER = {
  officeAddress: '서울특별시 송파구 중대로 150 백암빌딩 6층 602-A23호',
  representativeName: '김진영',
  mainPhone: '070-8018-9232',
  faxNumber: '0504-287-7334',
};

/** 회원가입 신청 URL — 미설정 시 빈 문자열(링크 비활성) */
export const DEFAULT_SIGNUP_APPLICATION_URL = '';

/** http(s) URL만 허용. 아니면 빈 문자열. */
export function resolveSignupApplicationHref(raw) {
  const s = String(raw ?? '').trim();
  if (!s) return '';
  try {
    const u = new URL(s);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    return u.href;
  } catch {
    return '';
  }
}

async function fetchSiteFooterFromDb() {
  const { data, error } = await supabase
    .from('site_settings')
    .select(
      'office_address, representative_name, main_phone, fax_number, signup_application_url'
    )
    .eq('id', 1)
    .maybeSingle();

  if (error || !data) {
    return {
      ...DEFAULT_SITE_FOOTER,
      signupApplicationUrl: DEFAULT_SIGNUP_APPLICATION_URL,
    };
  }

  const signupApplicationUrl = resolveSignupApplicationHref(data.signup_application_url);

  return {
    officeAddress:
      data.office_address != null ? String(data.office_address).trim() : DEFAULT_SITE_FOOTER.officeAddress,
    representativeName:
      data.representative_name != null
        ? String(data.representative_name).trim()
        : DEFAULT_SITE_FOOTER.representativeName,
    mainPhone: data.main_phone != null ? String(data.main_phone).trim() : DEFAULT_SITE_FOOTER.mainPhone,
    faxNumber: data.fax_number != null ? String(data.fax_number).trim() : DEFAULT_SITE_FOOTER.faxNumber,
    signupApplicationUrl,
  };
}

/**
 * 푸터에 쓰는 사이트 설정. 태그 무효화로 관리자 저장 후 전 페이지 일관 반영.
 */
export const getSiteFooterSettings = unstable_cache(
  fetchSiteFooterFromDb,
  ['site-footer-settings'],
  { tags: ['site-footer'] }
);
