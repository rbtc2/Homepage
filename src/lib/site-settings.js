import { unstable_cache } from 'next/cache';
import { supabase } from './supabase';

/** DB 마이그레이션 전·오류 시 푸터 기본값 */
export const DEFAULT_SITE_FOOTER = {
  officeAddress: '서울특별시 송파구 중대로 150 백암빌딩 6층 602-A23호',
  representativeName: '김진영',
  mainPhone: '070-8018-9232',
  faxNumber: '0504-287-7334',
};

/** 회원가입 신청 버튼(단체 후원 안내 페이지) 외부 URL 기본값 */
export const DEFAULT_SIGNUP_APPLICATION_URL = 'https://example.com';

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

  const rawSignup =
    data.signup_application_url != null
      ? String(data.signup_application_url).trim()
      : '';
  const signupApplicationUrl =
    rawSignup.length > 0 ? rawSignup : DEFAULT_SIGNUP_APPLICATION_URL;

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
