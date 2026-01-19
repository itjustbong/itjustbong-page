import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";

// Use nodejs runtime to access file system
export const runtime = "nodejs";
export const alt = "Tech Blog Post";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const categoryColors: Record<string, string> = {
  frontend: "#3B82F6",
  backend: "#10B981",
  docker: "#06B6D4",
  blockchain: "#8B5CF6",
  ai: "#F59E0B",
};

const categoryLabels: Record<string, string> = {
  frontend: "프론트엔드",
  backend: "백엔드",
  docker: "도커",
  blockchain: "블록체인",
  ai: "AI",
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    // Return a default image if post not found
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAFAFA",
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#171717",
          }}
        >
          Tech Blog
        </div>
      </div>,
      {
        ...size,
      }
    );
  }

  const bgColor = categoryColors[post.category] || "#3B82F6";
  const categoryLabel = categoryLabels[post.category] || post.category;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(135deg, ${bgColor}15 0%, #FAFAFA 100%)`,
        padding: "60px",
      }}
    >
      {/* Category Badge */}
      <div
        style={{
          fontSize: 24,
          color: bgColor,
          marginBottom: 20,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontWeight: 600,
        }}
      >
        {categoryLabel}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#171717",
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: "900px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {post.title}
      </div>

      {/* Site Name */}
      <div
        style={{
          fontSize: 20,
          color: "#737373",
          marginTop: 40,
          fontWeight: 500,
        }}
      >
        {process.env.NEXT_PUBLIC_SITE_NAME || "Tech Blog"}
      </div>
    </div>,
    {
      ...size,
    }
  );
}
