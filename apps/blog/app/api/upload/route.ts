import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getDirectUploadUrl, getCloudflareImageUrl } from "@/lib/cloudflare";

// POST /api/upload - Direct Upload URL 발급
export async function POST(request: NextRequest) {
  // 인증 확인
  const authResult = await verifyAuth(request);
  if (!authResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "AUTH_ERROR",
          message: "인증에 실패했습니다.",
        },
      },
      { status: 401 }
    );
  }

  try {
    const result = await getDirectUploadUrl();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UPLOAD_URL_ERROR",
            message: result.error || "업로드 URL 발급에 실패했습니다.",
          },
        },
        { status: 500 }
      );
    }

    // 이미지 URL 미리 생성 (업로드 완료 후 사용할 URL)
    const imageUrl = result.imageId
      ? getCloudflareImageUrl(result.imageId)
      : undefined;

    return NextResponse.json({
      success: true,
      uploadURL: result.uploadURL,
      imageId: result.imageId,
      imageUrl,
    });
  } catch (error) {
    console.error("Upload URL 발급 오류:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "서버 오류가 발생했습니다.",
        },
      },
      { status: 500 }
    );
  }
}
