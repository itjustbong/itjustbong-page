import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getAllDrafts, saveDraft } from "@/lib/posts";
import { Draft } from "@/types";

// GET /api/drafts - 모든 임시저장 목록 조회
export async function GET(request: NextRequest) {
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
    const drafts = await getAllDrafts();
    return NextResponse.json({
      success: true,
      drafts,
      total: drafts.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_ERROR",
          message: "임시저장 목록을 불러오는데 실패했습니다.",
        },
      },
      { status: 500 }
    );
  }
}

// POST /api/drafts - 임시저장
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
    const body = await request.json();
    const { id, title, description, content, category, tags, thumbnail } = body;

    // 필수 필드 검증
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "카테고리는 필수입니다.",
          },
        },
        { status: 400 }
      );
    }

    const draft: Draft = {
      id: id || `draft-${Date.now()}`,
      title: title || "",
      description: description || "",
      content: content || "",
      category,
      tags: tags || [],
      thumbnail: thumbnail || undefined,
      savedAt: new Date().toISOString(),
    };

    await saveDraft(draft);

    return NextResponse.json({
      success: true,
      message: "임시저장되었습니다.",
      draft,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SAVE_ERROR",
          message: "임시저장에 실패했습니다.",
        },
      },
      { status: 500 }
    );
  }
}
