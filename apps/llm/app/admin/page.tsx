"use client";

import { useState, useEffect, useCallback } from "react";

// ============================================================
// 타입 정의
// ============================================================

interface KnowledgeSource {
  url: string;
  title: string;
  category: string;
  type: "url" | "text";
  content?: string;
  indexingStatus: "indexed" | "not_indexed";
}

interface IndexResult {
  url: string;
  status: "success" | "failed" | "skipped";
  chunksCount?: number;
  error?: string;
}

// ============================================================
// 로그인 폼 컴포넌트
// ============================================================

function LoginForm({
  onLogin,
}: {
  onLogin: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        onLogin();
      } else {
        const data = await res.json();
        setError(data.error || "인증에 실패했습니다.");
      }
    } catch {
      setError("서버에 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-dvh items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-6 text-center text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          🔐 관리자 로그인
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디"
            className="rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
          {error && (
            <p className="text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !username.trim() || !password}
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// URL 소스 추가 폼
// ============================================================

function AddUrlForm({
  onAdd,
}: {
  onAdd: () => void;
}) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("blog");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "url", url, title, category }),
      });

      if (res.ok) {
        setUrl("");
        setTitle("");
        setCategory("blog");
        onAdd();
      } else {
        const data = await res.json();
        setError(data.error || "추가에 실패했습니다.");
      }
    } catch {
      setError("서버에 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        URL 소스 추가
      </h3>
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/post"
          className="flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="w-40 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="blog">blog</option>
          <option value="resume">resume</option>
          <option value="manual">manual</option>
        </select>
        <button
          type="submit"
          disabled={loading || !url.trim() || !title.trim()}
          className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {loading ? "추가 중..." : "추가"}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </form>
  );
}

// ============================================================
// 텍스트 소스 추가 폼
// ============================================================

function AddTextForm({
  onAdd,
}: {
  onAdd: () => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("manual");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    setError("");

    const url = `text://${title.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "text", url, title, category, content }),
      });

      if (res.ok) {
        setTitle("");
        setContent("");
        setCategory("manual");
        onAdd();
      } else {
        const data = await res.json();
        setError(data.error || "추가에 실패했습니다.");
      }
    } catch {
      setError("서버에 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        텍스트 직접 입력
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="manual">manual</option>
          <option value="blog">blog</option>
          <option value="resume">resume</option>
        </select>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="마크다운 텍스트를 입력하세요..."
        rows={5}
        className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
      />
      <button
        type="submit"
        disabled={loading || !title.trim() || !content.trim()}
        className="self-end rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {loading ? "추가 중..." : "텍스트 추가"}
      </button>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </form>
  );
}


// ============================================================
// 소스 목록 테이블
// ============================================================

function SourceTable({
  sources,
  onDelete,
  onReindex,
  onReindexSingle,
  deletingUrl,
  indexingUrl,
}: {
  sources: KnowledgeSource[];
  onDelete: (url: string) => void;
  onReindex: () => void;
  onReindexSingle: (url: string) => void;
  deletingUrl: string | null;
  indexingUrl: string | null;
}) {
  if (sources.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        등록된 지식 소스가 없습니다.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="px-3 py-2 font-medium text-zinc-600 dark:text-zinc-400">
              제목
            </th>
            <th className="px-3 py-2 font-medium text-zinc-600 dark:text-zinc-400">
              URL
            </th>
            <th className="px-3 py-2 font-medium text-zinc-600 dark:text-zinc-400">
              카테고리
            </th>
            <th className="px-3 py-2 font-medium text-zinc-600 dark:text-zinc-400">
              타입
            </th>
            <th className="px-3 py-2 font-medium text-zinc-600 dark:text-zinc-400">
              상태
            </th>
            <th className="px-3 py-2 font-medium text-zinc-600 dark:text-zinc-400">
              작업
            </th>
          </tr>
        </thead>
        <tbody>
          {sources.map((source) => (
            <tr
              key={source.url}
              className="border-b border-zinc-100 dark:border-zinc-800"
            >
              <td className="max-w-[200px] truncate px-3 py-2.5 text-zinc-900 dark:text-zinc-100">
                {source.title}
              </td>
              <td className="max-w-[250px] truncate px-3 py-2.5">
                {source.type === "url" ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {source.url}
                  </a>
                ) : (
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {source.url}
                  </span>
                )}
              </td>
              <td className="px-3 py-2.5">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {source.category}
                </span>
              </td>
              <td className="px-3 py-2.5 text-zinc-500 dark:text-zinc-400">
                {source.type}
              </td>
              <td className="px-3 py-2.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    source.indexingStatus === "indexed"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {source.indexingStatus === "indexed"
                    ? "완료"
                    : "미처리"}
                </span>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onReindexSingle(source.url)}
                    disabled={indexingUrl === source.url}
                    className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-40 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {indexingUrl === source.url
                      ? "인덱싱 중..."
                      : "인덱싱"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(source.url)}
                    disabled={deletingUrl === source.url}
                    className="text-xs text-red-600 hover:text-red-800 disabled:opacity-40 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {deletingUrl === source.url
                      ? "삭제 중..."
                      : "삭제"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onReindex}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          전체 재인덱싱
        </button>
      </div>
    </div>
  );
}

// ============================================================
// 관리 대시보드 컴포넌트
// ============================================================

function Dashboard() {
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [indexing, setIndexing] = useState(false);
  const [indexingUrl, setIndexingUrl] = useState<string | null>(null);
  const [indexResults, setIndexResults] = useState<IndexResult[] | null>(null);
  const [fetchError, setFetchError] = useState("");

  const fetchSources = useCallback(async () => {
    try {
      setFetchError("");
      const res = await fetch("/api/knowledge");
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setSources(data.sources);
      } else {
        setFetchError("소스 목록을 불러올 수 없습니다.");
      }
    } catch {
      setFetchError("서버에 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const handleDelete = async (url: string) => {
    setDeletingUrl(url);
    try {
      const res = await fetch("/api/knowledge", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        await fetchSources();
      }
    } catch {
      // 에러 무시
    } finally {
      setDeletingUrl(null);
    }
  };

  const handleReindex = async () => {
    setIndexing(true);
    setIndexResults(null);
    try {
      const res = await fetch("/api/index", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setIndexResults(data.results);
        await fetchSources();
      }
    } catch {
      // 에러 무시
    } finally {
      setIndexing(false);
    }
  };

  const handleReindexSingle = async (url: string) => {
    setIndexingUrl(url);
    setIndexResults(null);
    try {
      const res = await fetch("/api/index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, force: true }),
      });
      if (res.ok) {
        const data = await res.json();
        setIndexResults(data.results);
        await fetchSources();
      }
    } catch {
      // 에러 무시
    } finally {
      setIndexingUrl(null);
    }
  };

  return (
    <div className="min-h-dvh bg-zinc-50 dark:bg-zinc-950">
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-3 dark:border-zinc-800">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          📚 지식 베이스 관리
        </h1>
        <a
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← 채팅으로 돌아가기
        </a>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-6">
        {/* 소스 추가 영역 */}
        <div className="mb-8 space-y-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <AddUrlForm onAdd={fetchSources} />
          <hr className="border-zinc-200 dark:border-zinc-700" />
          <AddTextForm onAdd={fetchSources} />
        </div>

        {/* 소스 목록 */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              등록된 소스 ({sources.length}개)
            </h2>
            {indexing && (
              <span className="text-sm text-blue-600 dark:text-blue-400">
                인덱싱 진행 중...
              </span>
            )}
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              불러오는 중...
            </p>
          ) : fetchError ? (
            <p className="py-8 text-center text-sm text-red-600 dark:text-red-400">
              {fetchError}
            </p>
          ) : (
            <SourceTable
              sources={sources}
              onDelete={handleDelete}
              onReindex={handleReindex}
              onReindexSingle={handleReindexSingle}
              deletingUrl={deletingUrl}
              indexingUrl={indexingUrl}
            />
          )}

          {/* 인덱싱 결과 */}
          {indexResults && (
            <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <h3 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                인덱싱 결과
              </h3>
              <ul className="space-y-1 text-sm">
                {indexResults.map((result) => (
                  <li key={result.url} className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        result.status === "success"
                          ? "bg-green-500"
                          : result.status === "skipped"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    <span className="truncate text-zinc-700 dark:text-zinc-300">
                      {result.url}
                    </span>
                    <span className="shrink-0 text-zinc-500 dark:text-zinc-400">
                      {result.status === "success"
                        ? `성공 (${result.chunksCount ?? 0}청크)`
                        : result.status === "skipped"
                          ? "건너뜀"
                          : `실패: ${result.error ?? "알 수 없는 오류"}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 메인 페이지 컴포넌트
// ============================================================

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);

  return authenticated ? (
    <Dashboard />
  ) : (
    <LoginForm onLogin={() => setAuthenticated(true)} />
  );
}
