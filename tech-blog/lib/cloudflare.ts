/**
 * Cloudflare Images Direct Upload 유틸리티
 * https://developers.cloudflare.com/images/upload-images/direct-creator-upload/
 */

interface DirectUploadResponse {
  success: boolean;
  result?: {
    id: string;
    uploadURL: string;
  };
  errors?: Array<{ code: number; message: string }>;
}

interface UploadResult {
  success: boolean;
  imageId?: string;
  imageUrl?: string;
  error?: string;
}

/**
 * Cloudflare Images Direct Upload URL 발급
 * 서버 사이드에서만 호출 가능
 */
export async function getDirectUploadUrl(): Promise<{
  success: boolean;
  uploadURL?: string;
  imageId?: string;
  error?: string;
}> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    return {
      success: false,
      error: "Cloudflare 설정이 누락되었습니다.",
    };
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requireSignedURLs: false,
          metadata: {
            source: "tech-blog",
            uploadedAt: new Date().toISOString(),
          },
        }),
      }
    );

    const data: DirectUploadResponse = await response.json();

    if (!data.success || !data.result) {
      return {
        success: false,
        error: data.errors?.[0]?.message || "업로드 URL 발급에 실패했습니다.",
      };
    }

    return {
      success: true,
      uploadURL: data.result.uploadURL,
      imageId: data.result.id,
    };
  } catch (error) {
    console.error("Cloudflare Direct Upload URL 발급 오류:", error);
    return {
      success: false,
      error: "업로드 URL 발급 중 오류가 발생했습니다.",
    };
  }
}

/**
 * Cloudflare Images URL 생성
 */
export function getCloudflareImageUrl(
  imageId: string,
  variant: string = "public"
): string {
  const imagesHash = process.env.CLOUDFLARE_IMAGES_HASH;

  if (!imagesHash) {
    console.warn("CLOUDFLARE_IMAGES_HASH가 설정되지 않았습니다.");
    return "";
  }

  return `https://imagedelivery.net/${imagesHash}/${imageId}/${variant}`;
}

/**
 * 이미지 삭제
 */
export async function deleteCloudflareImage(
  imageId: string
): Promise<UploadResult> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    return {
      success: false,
      error: "Cloudflare 설정이 누락되었습니다.",
    };
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data.errors?.[0]?.message || "이미지 삭제에 실패했습니다.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Cloudflare 이미지 삭제 오류:", error);
    return {
      success: false,
      error: "이미지 삭제 중 오류가 발생했습니다.",
    };
  }
}
