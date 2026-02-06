import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  collectFromUrl,
  htmlToText,
  extractTitle,
  removeUnwantedElements,
  generateContentHash,
  decodeHtmlEntities,
} from "./collector";

// ============================================================
// htmlToText
// ============================================================

describe("htmlToText", () => {
  it("기본 HTML 태그를 제거하고 텍스트만 반환한다", () => {
    const html = "<p>안녕하세요</p><p>반갑습니다</p>";
    const result = htmlToText(html);
    expect(result).toContain("안녕하세요");
    expect(result).toContain("반갑습니다");
    expect(result).not.toContain("<p>");
    expect(result).not.toContain("</p>");
  });

  it("script 태그와 내용을 제거한다", () => {
    const html = `
      <div>본문 텍스트</div>
      <script>console.log("제거되어야 함");</script>
      <div>추가 텍스트</div>
    `;
    const result = htmlToText(html);
    expect(result).toContain("본문 텍스트");
    expect(result).toContain("추가 텍스트");
    expect(result).not.toContain("console.log");
    expect(result).not.toContain("제거되어야 함");
  });

  it("style 태그와 내용을 제거한다", () => {
    const html = `
      <div>본문</div>
      <style>.class { color: red; }</style>
    `;
    const result = htmlToText(html);
    expect(result).toContain("본문");
    expect(result).not.toContain("color");
    expect(result).not.toContain(".class");
  });

  it("nav, footer, header 요소를 제거한다", () => {
    const html = `
      <header><a href="/">홈</a></header>
      <nav><ul><li>메뉴1</li><li>메뉴2</li></ul></nav>
      <main><p>본문 내용입니다.</p></main>
      <footer><p>저작권 정보</p></footer>
    `;
    const result = htmlToText(html);
    expect(result).toContain("본문 내용입니다.");
    expect(result).not.toContain("메뉴1");
    expect(result).not.toContain("저작권 정보");
    expect(result).not.toContain("홈");
  });

  it("중첩된 HTML 태그를 올바르게 처리한다", () => {
    const html = `
      <div>
        <h1>제목</h1>
        <div>
          <p><strong>굵은</strong> 텍스트와 <em>기울임</em> 텍스트</p>
        </div>
      </div>
    `;
    const result = htmlToText(html);
    expect(result).toContain("제목");
    expect(result).toContain("굵은");
    expect(result).toContain("텍스트와");
    expect(result).toContain("기울임");
    expect(result).not.toContain("<strong>");
    expect(result).not.toContain("<em>");
  });

  it("HTML 엔티티를 디코딩한다", () => {
    const html = "<p>A &amp; B &lt; C &gt; D &quot;E&quot;</p>";
    const result = htmlToText(html);
    expect(result).toContain('A & B < C > D "E"');
  });

  it("연속된 공백과 줄바꿈을 정리한다", () => {
    const html = "<p>첫째   줄</p><p></p><p></p><p>둘째 줄</p>";
    const result = htmlToText(html);
    // 연속된 빈 줄이 3개 이상이면 2개로 축소
    const lines = result.split("\n").filter((l) => l.length > 0);
    expect(lines).toContain("첫째 줄");
    expect(lines).toContain("둘째 줄");
  });

  it("빈 HTML은 빈 문자열을 반환한다", () => {
    expect(htmlToText("")).toBe("");
    expect(htmlToText("   ")).toBe("");
  });

  it("태그 없는 순수 텍스트는 그대로 반환한다", () => {
    const text = "태그 없는 순수 텍스트입니다.";
    expect(htmlToText(text)).toBe(text);
  });

  it("noscript 태그를 제거한다", () => {
    const html = `
      <div>본문</div>
      <noscript>JavaScript를 활성화하세요</noscript>
    `;
    const result = htmlToText(html);
    expect(result).toContain("본문");
    expect(result).not.toContain("JavaScript를 활성화하세요");
  });

  it("svg 태그를 제거한다", () => {
    const html = `
      <div>본문</div>
      <svg xmlns="http://www.w3.org/2000/svg"><circle r="10"/></svg>
    `;
    const result = htmlToText(html);
    expect(result).toContain("본문");
    expect(result).not.toContain("circle");
  });

  it("iframe 태그를 제거한다", () => {
    const html = `
      <div>본문</div>
      <iframe src="https://example.com">내용</iframe>
    `;
    const result = htmlToText(html);
    expect(result).toContain("본문");
    expect(result).not.toContain("내용");
  });

  it("결과에 HTML 태그가 포함되지 않는다", () => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head><title>테스트</title></head>
      <body>
        <header><nav>메뉴</nav></header>
        <main>
          <h1>제목</h1>
          <p>본문 <a href="#">링크</a></p>
          <script>alert("xss")</script>
          <style>body{margin:0}</style>
        </main>
        <footer>푸터</footer>
      </body>
      </html>
    `;
    const result = htmlToText(html);
    expect(result).not.toMatch(/<[^>]*>/);
  });
});

// ============================================================
// extractTitle
// ============================================================

describe("extractTitle", () => {
  it("title 태그에서 제목을 추출한다", () => {
    const html = "<html><head><title>페이지 제목</title></head></html>";
    expect(extractTitle(html)).toBe("페이지 제목");
  });

  it("title 태그가 없으면 null을 반환한다", () => {
    const html = "<html><head></head><body>본문</body></html>";
    expect(extractTitle(html)).toBeNull();
  });

  it("title 태그의 앞뒤 공백을 제거한다", () => {
    const html = "<title>  공백 있는 제목  </title>";
    expect(extractTitle(html)).toBe("공백 있는 제목");
  });

  it("title 태그에 속성이 있어도 추출한다", () => {
    const html = '<title lang="ko">한국어 제목</title>';
    expect(extractTitle(html)).toBe("한국어 제목");
  });
});

// ============================================================
// removeUnwantedElements
// ============================================================

describe("removeUnwantedElements", () => {
  it("script 태그와 내용을 제거한다", () => {
    const html = '<p>텍스트</p><script type="text/javascript">var x = 1;</script>';
    const result = removeUnwantedElements(html);
    expect(result).toContain("<p>텍스트</p>");
    expect(result).not.toContain("script");
    expect(result).not.toContain("var x");
  });

  it("여러 불필요한 요소를 동시에 제거한다", () => {
    const html = `
      <nav>네비게이션</nav>
      <main>본문</main>
      <footer>푸터</footer>
      <style>.x{}</style>
    `;
    const result = removeUnwantedElements(html);
    expect(result).toContain("<main>본문</main>");
    expect(result).not.toContain("네비게이션");
    expect(result).not.toContain("푸터");
    expect(result).not.toContain(".x{}");
  });
});

// ============================================================
// generateContentHash
// ============================================================

describe("generateContentHash", () => {
  it("동일한 텍스트에 대해 동일한 해시를 반환한다", () => {
    const text = "동일한 텍스트";
    const hash1 = generateContentHash(text);
    const hash2 = generateContentHash(text);
    expect(hash1).toBe(hash2);
  });

  it("다른 텍스트에 대해 다른 해시를 반환한다", () => {
    const hash1 = generateContentHash("텍스트 A");
    const hash2 = generateContentHash("텍스트 B");
    expect(hash1).not.toBe(hash2);
  });

  it("SHA-256 해시 형식(64자 hex)을 반환한다", () => {
    const hash = generateContentHash("테스트");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("빈 문자열도 유효한 해시를 반환한다", () => {
    const hash = generateContentHash("");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });
});

// ============================================================
// decodeHtmlEntities
// ============================================================

describe("decodeHtmlEntities", () => {
  it("기본 HTML 엔티티를 디코딩한다", () => {
    expect(decodeHtmlEntities("&amp;")).toBe("&");
    expect(decodeHtmlEntities("&lt;")).toBe("<");
    expect(decodeHtmlEntities("&gt;")).toBe(">");
    expect(decodeHtmlEntities("&quot;")).toBe('"');
    expect(decodeHtmlEntities("&#39;")).toBe("'");
    expect(decodeHtmlEntities("&nbsp;")).toBe(" ");
  });

  it("숫자 엔티티를 디코딩한다", () => {
    expect(decodeHtmlEntities("&#65;")).toBe("A");
    expect(decodeHtmlEntities("&#44032;")).toBe("가");
  });

  it("16진수 엔티티를 디코딩한다", () => {
    expect(decodeHtmlEntities("&#x41;")).toBe("A");
    expect(decodeHtmlEntities("&#xAC00;")).toBe("가");
  });

  it("엔티티가 없는 텍스트는 그대로 반환한다", () => {
    expect(decodeHtmlEntities("일반 텍스트")).toBe("일반 텍스트");
  });
});

// ============================================================
// collectFromUrl
// ============================================================

describe("collectFromUrl", () => {
  const MOCK_HTML = `
    <!DOCTYPE html>
    <html>
    <head><title>테스트 페이지</title></head>
    <body>
      <header><nav>메뉴</nav></header>
      <main>
        <h1>본문 제목</h1>
        <p>본문 내용입니다.</p>
      </main>
      <footer>푸터 내용</footer>
      <script>console.log("test");</script>
    </body>
    </html>
  `;

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve(MOCK_HTML),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("URL에서 콘텐츠를 수집하고 CollectedContent를 반환한다", async () => {
    const result = await collectFromUrl("https://example.com");

    expect(result.url).toBe("https://example.com");
    expect(result.title).toBe("테스트 페이지");
    expect(result.text).toContain("본문 제목");
    expect(result.text).toContain("본문 내용입니다.");
    expect(result.contentHash).toMatch(/^[0-9a-f]{64}$/);
    expect(result.collectedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
    );
  });

  it("불필요한 요소(nav, footer, script)를 제거한다", async () => {
    const result = await collectFromUrl("https://example.com");

    expect(result.text).not.toContain("메뉴");
    expect(result.text).not.toContain("푸터 내용");
    expect(result.text).not.toContain("console.log");
  });

  it("결과 텍스트에 HTML 태그가 포함되지 않는다", async () => {
    const result = await collectFromUrl("https://example.com");
    expect(result.text).not.toMatch(/<[^>]*>/);
  });

  it("title 태그가 없으면 URL을 제목으로 사용한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () =>
          Promise.resolve("<html><body><p>내용</p></body></html>"),
      })
    );

    const result = await collectFromUrl("https://example.com/page");
    expect(result.title).toBe("https://example.com/page");
  });

  it("HTTP 오류 응답 시 URL 정보를 포함한 오류를 발생시킨다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      })
    );

    await expect(
      collectFromUrl("https://example.com/not-found")
    ).rejects.toThrow("https://example.com/not-found");
    await expect(
      collectFromUrl("https://example.com/not-found")
    ).rejects.toThrow("HTTP 404");
  });

  it("네트워크 오류 시 URL 정보를 포함한 오류를 발생시킨다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("네트워크 오류"))
    );

    await expect(
      collectFromUrl("https://unreachable.example.com")
    ).rejects.toThrow("https://unreachable.example.com");
    await expect(
      collectFromUrl("https://unreachable.example.com")
    ).rejects.toThrow("네트워크 오류");
  });

  it("수집 시각이 ISO 8601 형식이다", async () => {
    const result = await collectFromUrl("https://example.com");
    const date = new Date(result.collectedAt);
    expect(date.toISOString()).toBe(result.collectedAt);
  });

  it("동일한 콘텐츠에 대해 동일한 해시를 생성한다", async () => {
    const result1 = await collectFromUrl("https://example.com");
    const result2 = await collectFromUrl("https://example.com");
    expect(result1.contentHash).toBe(result2.contentHash);
  });
});
