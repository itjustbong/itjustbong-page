declare namespace NodeJS {
  interface ProcessEnv {
    // 관리자 인증
    ADMIN_USERNAME: string;
    ADMIN_PASSWORD: string;

    // Cloudflare Images
    CLOUDFLARE_ACCOUNT_ID: string;
    CLOUDFLARE_API_TOKEN: string;
    CLOUDFLARE_IMAGES_HASH: string;

    // Google AdSense (클라이언트 노출)
    NEXT_PUBLIC_ADSENSE_CLIENT_ID: string;

    // 사이트 설정 (클라이언트 노출)
    NEXT_PUBLIC_SITE_URL: string;
    NEXT_PUBLIC_SITE_NAME: string;

    // ISR 재검증
    REVALIDATE_SECRET: string;
  }
}
