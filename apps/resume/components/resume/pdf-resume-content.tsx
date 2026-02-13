"use client";

import { forwardRef } from "react";
import { profile, techStacks, experiences, personalProjects, education, communities, awards, articles, patents } from "@/lib/resume-data";
import { PdfHighlightText } from "@/lib/pdf-highlight-text";

// PDF용 색상 상수 (html2canvas가 oklch를 지원하지 않으므로 hex 사용)
const colors = {
  background: "#ffffff",
  foreground: "#1a1a1a",
  muted: "#666666",
  mutedLight: "#555555",
  accent: "#0891b2",
  border: "#e5e5e5",
  cardBg: "#f8f8f8",
  codeBg: "#f0f0f0",
};

/**
 * PDF 페이지 브레이크 마커
 * 이 컴포넌트가 위치한 지점에서 새 페이지가 시작됨
 */
function PageBreak() {
  return <div data-page-break style={{ height: 0, width: "100%" }} />;
}

export const PdfResumeContent = forwardRef<HTMLDivElement>(
  function PdfResumeContent(_, ref) {
    // Group awards by year
    const awardsByYear = awards.reduce(
      (acc, award) => {
        if (!acc[award.year]) {
          acc[award.year] = [];
        }
        acc[award.year].push(award.title);
        return acc;
      },
      {} as Record<string, string[]>
    );
    const sortedYears = Object.keys(awardsByYear).sort((a, b) => Number(b) - Number(a));

    return (
      <div
        ref={ref}
        className="pdf-content"
        style={{
          width: "896px",
          backgroundColor: colors.background,
          color: colors.foreground,
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: "11px",
          lineHeight: "1.5",
          padding: "20px 28px",
          colorScheme: "light",
        }}
      >
        {/* Profile Section */}
        <section style={{ marginBottom: "12px"}}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
              <h1 style={{ fontSize: "28px", fontWeight: 700, margin: 0, color: colors.foreground }}>
                {profile.name}
              </h1>
              <span style={{ fontSize: "16px", color: colors.muted }}>{profile.title}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
              <div style={{ display: "flex", gap: "16px", fontSize: "11px", color: colors.muted }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                  {profile.links.github.replace("https://github.com/", "")}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                  {profile.links.linkedin.replace("https://www.linkedin.com/in/", "").replace("/", "")}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {profile.links.email}
                </span>
              </div>
              <span style={{ fontSize: "9px", color: colors.muted, lineHeight: 1 }}>
                https://resume.itjustbong.com/ 주소에서 볼 수 있습니다.
              </span>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section style={{ marginBottom: "12px" }}>
          <SectionTitle>Tech Stack</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {techStacks.map((stack) => (
              <div
                key={stack.category}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <h3 style={{ 
                  fontSize: "12px", 
                  fontWeight: 600, 
                  margin: 0, 
                  color: colors.foreground, 
                  width: "60px",
                  flexShrink: 0,
                }}>
                  {stack.category}
                </h3>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
                  {/* Tags - 첫 번째 줄 */}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "2px" }}>
                    {stack.tags.map((tag, tagIndex) => (
                      <span key={tag} style={{ display: "inline-flex", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", color: colors.accent, fontWeight: 500 }}>
                          {tag}
                        </span>
                        {tagIndex < stack.tags.length - 1 && (
                          <span style={{ color: "#ccc", margin: "0 3px" }}>·</span>
                        )}
                      </span>
                    ))}
                  </div>
                  {/* Description - 두 번째 줄 */}
                  <p style={{ fontSize: "11px", color: colors.mutedLight, margin: 0, lineHeight: "1.5" }}>
                    <PdfHighlightText text={stack.description} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section style={{ marginBottom: "14px" }}>
          <SectionTitle>Experience</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {experiences.map((exp, index) => {
              // "대학 재학 중"이 포함된 첫 번째 경험의 인덱스 찾기
              const firstUndergraduateIndex = experiences.findIndex((e) =>
                e.period.includes("대학 재학 중")
              );
              const showGraduationDivider =
                index === firstUndergraduateIndex && firstUndergraduateIndex > 0;

              return (
                <div key={exp.company}>
                  {/* 졸업 구분선 */}
                  {showGraduationDivider && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "12px",
                      }}
                    >
                      <div style={{ flex: 1, height: "1px", backgroundColor: colors.border }} />
                      <span style={{ fontSize: "10px", color: colors.muted, whiteSpace: "nowrap" }}>
                        대학 졸업
                      </span>
                      <div style={{ flex: 1, height: "1px", backgroundColor: colors.border }} />
                    </div>
                  )}
                  <div
                    style={{
                      paddingLeft: "14px",
                      borderLeft: `3px solid ${colors.accent}`,
                    }}
                  >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, margin: 0, color: colors.foreground }}>
                    {exp.company}
                  </h3>
                  <span style={{ fontSize: "11px", color: colors.muted, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                    {exp.period}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {exp.projects.map((project) => (
                    <div key={project.name}>
                      <h4 style={{ fontSize: "12px", fontWeight: 600, margin: "0 0 6px 0", color: "#333" }}>
                        {project.name}
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: "16px", listStyle: "disc" }}>
                        {project.highlights.map((highlight, i) => (
                          <li key={i} style={{ fontSize: "11px", color: colors.mutedLight, marginBottom: "4px", lineHeight: "1.5" }}>
                            <PdfHighlightText text={highlight} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {exp.activities && (
                  <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #eee" }}>
                    <h4 style={{ fontSize: "11px", fontWeight: 500, margin: "0 0 6px 0", color: colors.muted }}>
                      Activities
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: "16px", listStyle: "disc" }}>
                      {exp.activities.map((activity, i) => (
                        <li key={i} style={{ fontSize: "11px", color: colors.mutedLight, marginBottom: "3px" }}>
                          <PdfHighlightText text={activity} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 페이지 브레이크: Experience 이후, Personal Projects 전 */}
        <PageBreak />

        {/* Personal Projects Section */}
        <section style={{ marginBottom: "28px" }}>
          <SectionTitle>Personal Projects</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {personalProjects.map((project) => (
              <div
                key={project.id}
                style={{
                  padding: "12px 14px",
                  backgroundColor: colors.cardBg,
                  borderRadius: "6px",
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <h3 style={{ fontSize: "13px", fontWeight: 600, margin: 0, color: colors.foreground, display: "inline" }}>
                      {project.name}
                    </h3>
                    {project.url && (
                      <span style={{ fontSize: "10px", color: colors.accent, marginLeft: "8px" }}>
                        {project.url}
                      </span>
                    )}
                    <p style={{ fontSize: "11px", color: colors.muted, margin: "4px 0 0 0" }}>
                      <PdfHighlightText text={project.description} />
                    </p>
                  </div>
                  <span style={{ fontSize: "10px", color: colors.muted, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                    {project.period}
                  </span>
                </div>
                <ul style={{ margin: 0, paddingLeft: "16px", listStyle: "disc" }}>
                  {project.highlights.map((highlight, i) => (
                    <li key={i} style={{ fontSize: "11px", color: colors.mutedLight, marginBottom: "4px", lineHeight: "1.5" }}>
                      <PdfHighlightText text={highlight} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section style={{ marginBottom: "28px" }}>
          <SectionTitle>Education</SectionTitle>
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: colors.cardBg,
              borderRadius: "6px",
              border: `1px solid ${colors.border}`,
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 600, margin: 0, color: colors.foreground }}>
                {education.school}
              </h3>
              <span style={{ fontSize: "11px", color: colors.muted, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                {education.period}
              </span>
            </div>
            <p style={{ fontSize: "11px", color: colors.mutedLight, margin: "4px 0 0 0" }}>{education.major}</p>
            <div style={{ display: "flex", gap: "16px", marginTop: "6px", fontSize: "11px" }}>
              {education.gpa && <span style={{ color: colors.accent }}>GPA: {education.gpa}</span>}
              {education.note && <span style={{ color: colors.muted }}>{education.note}</span>}
            </div>
          </div>

          <h3 style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 10px 0", color: colors.foreground }}>
            Community
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {communities.map((community) => (
              <div
                key={community.name}
                style={{
                  padding: "12px 14px",
                  backgroundColor: colors.cardBg,
                  borderRadius: "6px",
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <h4 style={{ fontSize: "12px", fontWeight: 600, margin: 0, color: colors.foreground }}>
                    {community.name}
                  </h4>
                  <span style={{ fontSize: "10px", color: colors.muted, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                    {community.period}
                  </span>
                </div>
                <p style={{ fontSize: "11px", color: colors.muted, margin: "0 0 6px 0" }}>
                  <PdfHighlightText text={community.description} />
                </p>
                <ul style={{ margin: 0, paddingLeft: "16px", listStyle: "disc" }}>
                  {community.activities.map((activity, i) => (
                    <li key={i} style={{ fontSize: "10px", color: colors.mutedLight, marginBottom: "2px" }}>
                      <PdfHighlightText text={activity} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        
        <PageBreak />

        {/* Awards Section */}
        <section style={{ marginBottom: "24px" }}>
          <SectionTitle>Awards</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
            {sortedYears.map((year) => (
              <div
                key={year}
                style={{
                  padding: "10px 12px",
                  backgroundColor: colors.cardBg,
                  borderRadius: "6px",
                  border: `1px solid ${colors.border}`,
                }}
              >
                <span style={{ fontSize: "12px", fontWeight: 600, color: colors.accent, fontFamily: "monospace" }}>
                  {year}
                </span>
                <ul style={{ margin: "6px 0 0 0", padding: 0, listStyle: "none" }}>
                  {awardsByYear[year].map((title, i) => (
                    <li key={i} style={{ fontSize: "10px", color: colors.mutedLight, marginBottom: "2px" }}>
                      {title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <h3 style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 10px 0", color: colors.foreground }}>
                Articles & Media
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {articles.map((article, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "10px",
                      padding: "6px 10px",
                      backgroundColor: colors.cardBg,
                      borderRadius: "4px",
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <span style={{ fontSize: "10px", color: colors.muted, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                      {article.date}
                    </span>
                    <span style={{ fontSize: "10px", color: "#333" }}>{article.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 10px 0", color: colors.foreground }}>
                Patents
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {patents.map((patent, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "6px 10px",
                      backgroundColor: colors.cardBg,
                      borderRadius: "4px",
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <span style={{ fontSize: "10px", color: "#333" }}>{patent.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
);

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 600, margin: 0, color: "#1a1a1a" }}>
        {children}
      </h2>
      <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e5e5" }} />
    </div>
  );
}
