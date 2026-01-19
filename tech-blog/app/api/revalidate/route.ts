import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * On-Demand ISR 재검증 API
 * Vercel 또는 외부 서비스에서 호출하여 특정 경로를 재검증
 *
 * POST /api/revalidate
 * Body: { path?: string, paths?: string[] }
 * Header: x-revalidate-token: <REVALIDATE_SECRET>
 */
export async function POST(request: NextRequest) {
  try {
    // 토큰 검증
    const token = request.headers.get("x-revalidate-token");
    const secret = process.env.REVALIDATE_SECRET;

    if (!secret) {
      return NextResponse.json(
        {
          success: false,
          error: "REVALIDATE_SECRET이 설정되지 않았습니다.",
        },
        { status: 500 }
      );
    }

    if (token !== secret) {
      return NextResponse.json(
        {
          success: false,
          error: "유효하지 않은 토큰입니다.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { path, paths } = body;

    if (!path && !paths) {
      return NextResponse.json(
        {
          success: false,
          error: "path 또는 paths가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const revalidatedPaths: string[] = [];

    // 단일 경로 재검증
    if (path) {
      revalidatePath(path);
      revalidatedPaths.push(path);
    }

    // 다중 경로 재검증
    if (paths && Array.isArray(paths)) {
      for (const p of paths) {
        revalidatePath(p);
        revalidatedPaths.push(p);
      }
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      paths: revalidatedPaths,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "재검증 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
