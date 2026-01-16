import { PostMeta } from "@/types";
import { PostRow } from "./PostRow";

interface PostListProps {
  posts: PostMeta[];
  showPagination?: boolean;
}

export function PostList({ posts, showPagination = false }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">검색 결과가 없습니다.</p>
          <p className="text-muted-foreground mt-2 text-sm">
            다른 검색어나 카테고리를 시도해보세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="divide-border divide-y">
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} />
        ))}
      </div>
      {showPagination && (
        <div className="mt-8 flex justify-center">
          {/* Pagination can be added here in the future */}
        </div>
      )}
    </div>
  );
}
