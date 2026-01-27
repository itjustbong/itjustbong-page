import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getPostBySlug, updatePost, deletePost } from "@/lib/posts";
import { revalidatePath } from "next/cache";

// GET /api/posts/[slug] - 특정 글 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "글을 찾을 수 없습니다.",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_ERROR",
          message: "글을 불러오는데 실패했습니다.",
        },
      },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[slug] - 글 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
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
    const { slug } = await params;
    const body = await request.json();

    // 글 존재 확인
    const existingPost = await getPostBySlug(slug);
    if (!existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "글을 찾을 수 없습니다.",
          },
        },
        { status: 404 }
      );
    }

    // 글 수정
    await updatePost(slug, body);

    // ISR 재검증
    revalidatePath("/");
    revalidatePath(`/posts/${slug}`);
    if (body.category) {
      revalidatePath(`/category/${body.category}`);
    }
    if (existingPost.category !== body.category) {
      revalidatePath(`/category/${existingPost.category}`);
    }

    return NextResponse.json({
      success: true,
      message: "글이 성공적으로 수정되었습니다.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UPDATE_ERROR",
          message: "글 수정에 실패했습니다.",
        },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[slug] - 글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
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
    const { slug } = await params;

    // 글 존재 확인
    const existingPost = await getPostBySlug(slug);
    if (!existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "글을 찾을 수 없습니다.",
          },
        },
        { status: 404 }
      );
    }

    // 글 삭제
    await deletePost(slug);

    // ISR 재검증
    revalidatePath("/");
    revalidatePath(`/posts/${slug}`);
    revalidatePath(`/category/${existingPost.category}`);

    return NextResponse.json({
      success: true,
      message: "글이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DELETE_ERROR",
          message: "글 삭제에 실패했습니다.",
        },
      },
      { status: 500 }
    );
  }
}
