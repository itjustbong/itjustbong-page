import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import type { Post, PostMeta, Category } from "@/types";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export async function getAllPosts(): Promise<PostMeta[]> {
  try {
    const files = await fs.readdir(POSTS_DIR);
    const posts = await Promise.all(
      files
        .filter((file) => file.endsWith(".mdx"))
        .map(async (file) => {
          const filePath = path.join(POSTS_DIR, file);
          const content = await fs.readFile(filePath, "utf-8");
          const { data } = matter(content);

          return {
            slug: file.replace(".mdx", ""),
            title: data.title,
            description: data.description,
            category: data.category as Category,
            tags: data.tags || [],
            thumbnail: data.thumbnail,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            published: data.published,
          } as PostMeta;
        }),
    );

    return posts
      .filter((post) => post.published !== false)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title,
      description: data.description,
      content,
      category: data.category as Category,
      tags: data.tags || [],
      thumbnail: data.thumbnail,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt || data.createdAt,
      published: data.published ?? true,
    };
  } catch {
    return null;
  }
}

export async function getPostsByCategory(
  category: Category,
): Promise<PostMeta[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

export function getPostThumbnail(post: PostMeta): string {
  if (post.thumbnail) {
    return post.thumbnail;
  }
  // 썸네일이 없으면 동적 OG 이미지 URL 반환
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${siteUrl}/posts/${post.slug}/opengraph-image`;
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(POSTS_DIR);
    return files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(".mdx", ""));
  } catch {
    return [];
  }
}

export async function createPost(
  slug: string,
  postData: Omit<Post, "slug">,
): Promise<void> {
  const frontmatter = {
    title: postData.title,
    description: postData.description,
    category: postData.category,
    tags: postData.tags,
    thumbnail: postData.thumbnail,
    createdAt: postData.createdAt,
    updatedAt: postData.updatedAt,
    published: postData.published,
  };

  const fileContent = matter.stringify(postData.content, frontmatter);
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);

  await fs.writeFile(filePath, fileContent, "utf-8");
}

export async function updatePost(
  slug: string,
  postData: Partial<Omit<Post, "slug">>,
): Promise<void> {
  const existingPost = await getPostBySlug(slug);
  if (!existingPost) {
    throw new Error(`Post not found: ${slug}`);
  }

  const updatedPost = {
    ...existingPost,
    ...postData,
    updatedAt: new Date().toISOString().split("T")[0],
  };

  await createPost(slug, updatedPost);
}

export async function deletePost(slug: string): Promise<void> {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  await fs.unlink(filePath);
}
