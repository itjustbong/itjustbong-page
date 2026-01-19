import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { getPostBySlug, getDraftById } from "@/lib/posts";
import { PostForm } from "@/components/admin/PostForm";

interface EditorPageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ draft?: string }>;
}

export default async function EditorPage({
  params,
  searchParams,
}: EditorPageProps) {
  // 인증 확인
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/admin");
  }

  const authResult = await verifyToken(token);
  if (!authResult.success) {
    redirect("/admin");
  }

  const { slug: slugArray } = await params;
  const { draft: draftId } = await searchParams;

  const slug = slugArray?.[0];

  // 기존 글 수정 모드
  if (slug) {
    const post = await getPostBySlug(slug);

    if (!post) {
      redirect("/admin/dashboard");
    }

    return (
      <div className="container py-8">
        <PostForm initialData={post} mode="edit" slug={slug} />
      </div>
    );
  }

  // 임시저장 불러오기
  if (draftId) {
    const draft = await getDraftById(draftId);

    if (draft) {
      return (
        <div className="container py-8">
          <PostForm initialData={draft} mode="create" draftId={draftId} />
        </div>
      );
    }
  }

  // 새 글 작성 모드
  return (
    <div className="container py-8">
      <PostForm mode="create" />
    </div>
  );
}
