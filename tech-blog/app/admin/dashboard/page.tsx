"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PostMeta, Draft } from "@/types";
import {
  LayoutDashboard,
  FilePlus,
  Home,
  LogOut,
  FileText,
  FileEdit,
  ExternalLink,
  Edit,
  Trash2,
  Menu,
  X,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "drafts">("posts");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "post" | "draft";
    id: string;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [postsRes, draftsRes] = await Promise.all([
        fetch("/api/posts"),
        fetch("/api/drafts"),
      ]);

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData.posts || []);
      }

      if (draftsRes.ok) {
        const draftsData = await draftsRes.json();
        setDrafts(draftsData.drafts || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const url =
      deleteTarget.type === "post"
        ? `/api/posts/${deleteTarget.id}`
        : `/api/drafts/${deleteTarget.id}`;

    try {
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
    setDeleteTarget(null);
  };

  const categoryColors: Record<string, string> = {
    frontend: "bg-blue-100 text-blue-700",
    backend: "bg-green-100 text-green-700",
    docker: "bg-cyan-100 text-cyan-700",
    blockchain: "bg-purple-100 text-purple-700",
    ai: "bg-orange-100 text-orange-700",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      {/* Mobile Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          zIndex: 50,
        }}
        className="md:hidden"
      >
        <span style={{ fontWeight: 600 }}>Admin</span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ padding: 8 }}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: "white",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: sidebarOpen ? 0 : -240,
          zIndex: 40,
          transition: "left 0.3s",
        }}
        className="md:!relative md:!left-0"
      >
        {/* Logo */}
        <div
          style={{
            padding: 20,
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "#3b82f6",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileText size={18} color="white" />
          </div>
          <span style={{ fontWeight: 600, fontSize: 16 }}>Admin</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: 12 }}>
          <Link
            href="/admin/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 8,
              background: "#3b82f6",
              color: "white",
              textDecoration: "none",
              marginBottom: 4,
            }}
          >
            <LayoutDashboard size={18} />
            <span>대시보드</span>
          </Link>
          <Link
            href="/admin/editor"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 8,
              color: "#6b7280",
              textDecoration: "none",
            }}
          >
            <FilePlus size={18} />
            <span>새 글 작성</span>
          </Link>
        </nav>

        {/* Bottom */}
        <div style={{ padding: 12, borderTop: "1px solid #e5e7eb" }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 8,
              color: "#6b7280",
              textDecoration: "none",
            }}
          >
            <Home size={18} />
            <span>블로그로 이동</span>
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 8,
              color: "#ef4444",
              background: "none",
              border: "none",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
            }}
          >
            <LogOut size={18} />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 30,
          }}
          className="md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: 24,
          paddingTop: 80,
          marginLeft: 0,
        }}
        className="md:!ml-0 md:!pt-6"
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
                대시보드
              </h1>
              <p style={{ color: "#6b7280", marginTop: 4, fontSize: 14 }}>
                블로그 글을 관리하고 새로운 콘텐츠를 작성하세요.
              </p>
            </div>
            <Link
              href="/admin/editor"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                background: "#3b82f6",
                color: "white",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              <FilePlus size={18} />새 글 작성
            </Link>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                background: "white",
                padding: 20,
                borderRadius: 12,
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: "#dbeafe",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FileText size={24} color="#3b82f6" />
                </div>
                <div>
                  <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
                    발행된 글
                  </p>
                  <p style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
                    {posts.length}
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                background: "white",
                padding: 20,
                borderRadius: 12,
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: "#ffedd5",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FileEdit size={24} color="#f97316" />
                </div>
                <div>
                  <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
                    임시저장
                  </p>
                  <p style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
                    {drafts.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div
            style={{
              background: "white",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #e5e7eb",
                padding: "0 20px",
              }}
            >
              <button
                onClick={() => setActiveTab("posts")}
                style={{
                  padding: "16px 4px",
                  marginRight: 24,
                  background: "none",
                  border: "none",
                  borderBottom:
                    activeTab === "posts" ? "2px solid #3b82f6" : "none",
                  color: activeTab === "posts" ? "#3b82f6" : "#6b7280",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                발행된 글 ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab("drafts")}
                style={{
                  padding: "16px 4px",
                  background: "none",
                  border: "none",
                  borderBottom:
                    activeTab === "drafts" ? "2px solid #3b82f6" : "none",
                  color: activeTab === "drafts" ? "#3b82f6" : "#6b7280",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                임시저장 ({drafts.length})
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: 20 }}>
              {isLoading ? (
                <p
                  style={{ textAlign: "center", color: "#6b7280", padding: 40 }}
                >
                  로딩 중...
                </p>
              ) : activeTab === "posts" ? (
                posts.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 60 }}>
                    <FileText
                      size={48}
                      color="#d1d5db"
                      style={{ margin: "0 auto 16px" }}
                    />
                    <p style={{ color: "#6b7280" }}>발행된 글이 없습니다.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "12px 8px",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            제목
                          </th>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "12px 8px",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            카테고리
                          </th>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "12px 8px",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            작성일
                          </th>
                          <th
                            style={{
                              textAlign: "right",
                              padding: "12px 8px",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            작업
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts.map((post) => (
                          <tr
                            key={post.slug}
                            style={{ borderBottom: "1px solid #f3f4f6" }}
                          >
                            <td style={{ padding: "16px 8px" }}>
                              <div style={{ fontWeight: 500 }}>
                                {post.title}
                              </div>
                              <div
                                style={{
                                  fontSize: 13,
                                  color: "#6b7280",
                                  marginTop: 2,
                                }}
                              >
                                {post.description}
                              </div>
                            </td>
                            <td style={{ padding: "16px 8px" }}>
                              <span
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: 9999,
                                  fontSize: 12,
                                  fontWeight: 500,
                                }}
                                className={categoryColors[post.category] || ""}
                              >
                                {post.category}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: "16px 8px",
                                color: "#6b7280",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {new Date(post.createdAt).toLocaleDateString(
                                "ko-KR"
                              )}
                            </td>
                            <td
                              style={{
                                padding: "16px 8px",
                                textAlign: "right",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: 4,
                                  justifyContent: "flex-end",
                                }}
                              >
                                <Link
                                  href={`/posts/${post.slug}`}
                                  target="_blank"
                                  style={{
                                    padding: 8,
                                    color: "#6b7280",
                                    borderRadius: 6,
                                  }}
                                >
                                  <ExternalLink size={16} />
                                </Link>
                                <Link
                                  href={`/admin/editor/${post.slug}`}
                                  style={{
                                    padding: 8,
                                    color: "#6b7280",
                                    borderRadius: 6,
                                  }}
                                >
                                  <Edit size={16} />
                                </Link>
                                <button
                                  onClick={() =>
                                    setDeleteTarget({
                                      type: "post",
                                      id: post.slug,
                                    })
                                  }
                                  style={{
                                    padding: 8,
                                    color: "#ef4444",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    borderRadius: 6,
                                  }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : drafts.length === 0 ? (
                <div style={{ textAlign: "center", padding: 60 }}>
                  <FileEdit
                    size={48}
                    color="#d1d5db"
                    style={{ margin: "0 auto 16px" }}
                  />
                  <p style={{ color: "#6b7280" }}>임시저장된 글이 없습니다.</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "12px 8px",
                            fontWeight: 600,
                            color: "#374151",
                          }}
                        >
                          제목
                        </th>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "12px 8px",
                            fontWeight: 600,
                            color: "#374151",
                          }}
                        >
                          카테고리
                        </th>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "12px 8px",
                            fontWeight: 600,
                            color: "#374151",
                          }}
                        >
                          저장일
                        </th>
                        <th
                          style={{
                            textAlign: "right",
                            padding: "12px 8px",
                            fontWeight: 600,
                            color: "#374151",
                          }}
                        >
                          작업
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {drafts.map((draft) => (
                        <tr
                          key={draft.id}
                          style={{ borderBottom: "1px solid #f3f4f6" }}
                        >
                          <td style={{ padding: "16px 8px" }}>
                            <div style={{ fontWeight: 500 }}>
                              {draft.title || "제목 없음"}
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: "#6b7280",
                                marginTop: 2,
                              }}
                            >
                              {draft.description || "설명 없음"}
                            </div>
                          </td>
                          <td style={{ padding: "16px 8px" }}>
                            <span
                              style={{
                                padding: "4px 10px",
                                borderRadius: 9999,
                                fontSize: 12,
                                fontWeight: 500,
                              }}
                              className={categoryColors[draft.category] || ""}
                            >
                              {draft.category}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "16px 8px",
                              color: "#6b7280",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {new Date(draft.savedAt).toLocaleDateString(
                              "ko-KR"
                            )}
                          </td>
                          <td
                            style={{ padding: "16px 8px", textAlign: "right" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: 4,
                                justifyContent: "flex-end",
                              }}
                            >
                              <Link
                                href={`/admin/editor?draft=${draft.id}`}
                                style={{
                                  padding: 8,
                                  color: "#6b7280",
                                  borderRadius: 6,
                                }}
                              >
                                <Edit size={16} />
                              </Link>
                              <button
                                onClick={() =>
                                  setDeleteTarget({
                                    type: "draft",
                                    id: draft.id,
                                  })
                                }
                                style={{
                                  padding: 8,
                                  color: "#ef4444",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  borderRadius: 6,
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      {deleteTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 16,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 12,
              padding: 24,
              maxWidth: 400,
              width: "100%",
            }}
          >
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 600 }}>
              {deleteTarget.type === "post" ? "글" : "임시저장"}을
              삭제하시겠습니까?
            </h3>
            <p style={{ color: "#6b7280", margin: "0 0 20px" }}>
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div
              style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
            >
              <button
                onClick={() => setDeleteTarget(null)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: "#ef4444",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
