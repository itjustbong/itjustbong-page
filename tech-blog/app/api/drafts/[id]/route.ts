import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getDraftById, deleteDraft } from "@/lib/posts";

// GET /api/drafts/[id] - 특정 임시저장 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const draft = await getDraftById(id);

    if (!draft) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "임시저장을 찾을 수 없습니다.",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      draft,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_ERROR",
          message: "임시저장을 불러오는데 실패했습니다.",
        },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/drafts/[id] - 임시저장 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    // 임시저장 존재 확인
    const existingDraft = await getDraftById(id);
    if (!existingDraft) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "임시저장을 찾을 수 없습니다.",
          },
        },
        { status: 404 }
      );
    }

    // 임시저장 삭제
    await deleteDraft(id);

    return NextResponse.json({
      success: true,
      message: "임시저장이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DELETE_ERROR",
          message: "임시저장 삭제에 실패했습니다.",
        },
      },
      { status: 500 }
    );
  }
}
