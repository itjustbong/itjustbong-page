export interface TechStack {
  category: string;
  icon: "code" | "server" | "container" | "sparkles";
  tags: string[];
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  period: string;
  url?: string;
  highlights: string[];
  image?: string;
}

export interface Experience {
  company: string;
  period: string;
  projects: {
    name: string;
    highlights: string[];
  }[];
  activities?: string[];
}

export interface Education {
  school: string;
  major: string;
  period: string;
  gpa?: string;
  note?: string;
}

export interface Community {
  name: string;
  period: string;
  description: string;
  activities: string[];
}

export interface Award {
  year: string;
  title: string;
}

export interface Article {
  title: string;
  date: string;
}

export interface Patent {
  title: string;
}

export const techStacks: TechStack[] = [
  {
    category: "Frontend",
    icon: "code",
    tags: ["React", "Next.js", "TypeScript", "TanStack Query", "Tailwind", "Storybook"],
    description:
      "**일관되고 효율적인 개발 경험(DX)**를 중요하게 생각힙니다. **AsyncBoundary(Suspense + ErrorBoundary)**를 활용하여 로딩·에러를 외부에 선언적으로 위임하여 비즈니스 로직에만 집중할 수 있는 컴포넌트 구성을 선호하며, FSD 구조를 통해 **요구사항 변경에 유연하게 대응 가능**한 설계를 선호합니다. 이 외에도 **반응형, 다국어 대응, 공통 컴포넌트 설계 및 개발** 등에 대한 경험이 있습니다.",
  },
  {
    category: "AI",
    icon: "sparkles",
    tags: ["Codex", "Claude code", "v0","Cursor", "Oh my opencode", "Kiro", "RAG"],
    description:
      "**AI를 통해 경험과 사고를 확장**하는 것을 즐기며, AI를 도구(IDE/Agents/Search 등)로서 다양한 **실무 활용**과 기본적인 **RAG** 구축/실험 경험이 있습니다.",
  },
  {
    category: "Backend",
    icon: "server",
    tags: ["Node.js", "NestJS", "REST API"],
    description:
      "사이드 프로젝트나 BFF를 위한 **Node.js/NestJS CRUD/REST API** 및 간단한 서버 로직 구현 경험이 다수 있습니다.",
  },
  {
    category: "DevOps",
    icon: "container",
    tags: ["Turborepo", "Docker", "Vercel", "AWS"],
    description:
      "모노레포·컨테이너 기반 **배포 환경(Vercel/AWS/홈서버)**을 구축·운영했습니다.",
  }
];

export const experiences: Experience[] = [
  {
    company: "LG전자",
    period: "2024.01 ~",
    projects: [
      {
        name: "BS통합관제 프로젝트",
        highlights: [
          "**공통 컴포넌트 재사용 기반을 구축**해 B2B 서비스별 중복 구현으로 증가한 유지보수 부담을 줄였고, **Storybook** 기반 **공통 라이브러리**로 배포 단위를 표준화했습니다.",
          "**Unity 화면 전환 시 메모리 점유 이슈를 통제**해 체감 끊김을 줄였고, 인스턴스 **생명주기 제어**와 FE-Unity **메시지 프로토콜**로 실행 컨텍스트를 동기화했습니다.",
        ],
      },
      {
        name: "교육용 태블릿 관제 프로젝트",
        highlights: [
          "**단방향 의존성 규칙(Pages → Features → Entities)**으로 핵심 로직을 격리해 요구사항에 따른 변경 범위를 제한하고 버그 발생을 줄였습니다.",
          "**Fetch/Mutation 에러 처리 전략을 분리**해 Fetch 에러는 원거리에서 일괄 처리하고 Mutation 에러는 액션 인접 컴포넌트에서 처리해 전역 에러 UX 일관성과 복구 가능성을 확보했습니다.",
        ],
      },
      {
        name: "의료용 모니터 관제 프로젝트",
        highlights: [
          "**API 호출을 UI에서 분리한 Query 레이어로 일원화**해 컴포넌트가 성공 케이스에 집중하도록 구성했고, 동일 엔티티 중복 호출 제거 + **TanStack Query** 캐싱/공유 + **2분 주기 재호출(revalidate) 정책**을 한 곳에서 관리하도록 표준화했습니다.",
          "**Suspense + ErrorBoundary로 로딩·에러를 선언적으로 위임**한 **AsyncBoundary** 패턴을 적용해 상태별 UI를 분리 렌더링했고, 초기 대시보드 화면 렌더 시간(**LCP**)을 **10초 이상에서 5초 내외**로 단축했습니다.",
          "**8개 국어 1,000+ key 리소스 변환을 자동화**해 검수/반영 병목을 줄였고, **JSON <-> 엑셀** 수작업을 **dot notation 평탄화 스크립트**로 대체했습니다.",
        ],
      },
    ],
    activities: [
      "**쉐도우 커미티 상반기·연간 우수 활동자**로 선정되었고, MS 본부 내 제품 기획/UX 개선 안건 발굴과 리뷰에 참여했습니다.",
      "**서비스플랫폼개발담당 공모전 우수상**을 수상했고, 자사 제품 개선 아이디어를 실행 가능한 안건으로 구체화했습니다.",
    ],
  },
  {
    company: "올바름",
    period: "2022.02 ~ 2023.02 (대학 재학 중)",
    projects: [
      {
        name: "조경수 플랫폼 유지보수 및 기능 개선",
        highlights: [
          "**서비스 중단 없이 기능 개선을 지속**해 안정성을 유지했고, 인프라 비용 점검으로 불필요 리소스를 정리했습니다.",
        ],
      },
      {
        name: "퍼널 마케팅 플랫폼 리드",
        highlights: [
          "**마케팅 퍼널 운영 체계를 구축**하기 위해 기획·디자인·개발·지원사업 대응을 단일 오너로 리드했습니다.",
          "**캠페인 리드타임을 단축**하기 위해 SMS 연동, 랜딩 페이지, 폼 기능을 구현해 반복 업무를 자동화했습니다.",
        ],
      },
    ],
  },
  {
    company: "소셜 그라운드",
    period: "2021.07 ~ 2022.01 (대학 재학 중 / 공동 창업)",
    projects: [
      {
        name: "초기 스타트업 실무 담당",
        highlights: [
          "**초기 서비스 운영 체계를 정착**시키기 위해 개발팀 운영, 지원사업 대응, 외주 관리, 특허 출원을 주도했습니다.",
          "**학생-기업 매칭 서비스 기본 흐름을 구축**하기 위해 ESG 매칭 플랫폼 요구사항 정의와 핵심 화면/기능 구현을 담당했습니다.",
        ],
      },
    ],
  },
  {
    company: "밀레코리아",
    period: "2020.12 ~ 2021.06 (대학 재학 중)",
    projects: [
      {
        name: "사내 업무 자동화 프로그램 개발",
        highlights: [
          "**정산·최저가 스크래핑·재고 관리를 자동화**해 반복 수작업과 오류를 줄이고 운영 흐름을 표준화했습니다.",
        ],
      },
      {
        name: "패밀리몰/CS 시스템 구축",
        highlights: [
          "**약 3만 명 사용자와 3억 원 이상 매출이 발생하는 온라인 채널을 구축**해 패밀리몰 운영 기반을 마련했습니다.",
          "**고객 문의를 단일 채널로 통합**하기 위해 카카오톡 연계 CS 시스템을 구축했습니다.",
        ],
      },
    ],
  },
];

export const personalProjects: Project[] = [
  {
    id: "lemme-blind-date",
    name: "Lemme Blind Date",
    description: "**모바일 우선 UX와 권한 안전성**을 검증한 지인 네트워크 기반 매칭 서비스",
    period: "2026.02 ~",
    url: "https://lemmeblind.date",
    highlights: [
      "**Next.js 16 App Router 기능(Server Components + Server Actions)을 적극 활용**해 API 레이어를 단순화하고 화면/비즈니스 로직 수정 속도를 높였습니다.",
      "**권한 오용을 방지하는 데이터 접근 규칙을 명시**해 매칭/등록 플로우의 안전성을 확보했고, **Supabase RLS 정책**과 방장/등록자 권한 분리로 애플리케이션·DB 이중 검증을 구현했습니다.",
      "**Next.js 16 기반 i18n/캐싱 기능(next-intl + IP 로케일 감지, React cache() + unstable_cache())을 적극 적용**해 다국어 진입을 자동화하고 DB 부하를 줄였습니다.",
    ],
    image: "/projects/lemme-blind-date.png",
  },
  {
    id: "whales-wallet",
    name: "What's in Whale's Wallet?",
    description: "**SEC 13F** 데이터 기반으로 기관 포트폴리오를 탐색하는 FE 중심 분석 서비스",
    period: "2026.01 ~",
    url: "https://whales-wallet.com",
    highlights: [
      "**백엔드(NestJS)와 프론트엔드(Next.js)를 Turborepo 모노레포로 통합**해 API/타입 변경을 공유 패키지로 동기화했고, 타입 불일치와 중복 구현을 줄여 개발 효율성을 높였습니다.",
      "**재사용 가능한 프론트엔드 레이어를 정착**해 화면 추가 시 중복 구현을 줄였고, **FSD 구조**(entities/features/widgets), **i18n**, 공유 패키지(**@repo/ui**, **@repo/api-client**)로 API 연동 규칙을 표준화했습니다.",
    ],
    image: "/projects/whales-wallet.png",
  },
  {
    id: "itjustbong-platform",
    name: "itjustbong 플랫폼",
    description: "**Turborepo 모노레포** 기반으로 콘텐츠·이력서·LLM 서비스를 운영하는 개인 플랫폼",
    period: "2025.12 ~",
    url: "https://itjustbong.com",
    highlights: [
      "**모노레포 아키텍처**: **Turborepo + pnpm workspace** 기반 apps(blog/resume/llm) + packages(ui/shared/config) 구조를 설계하고, 공유 패키지로 여러 **Next.js** 앱 간 재사용성과 개발 효율을 높였습니다.",
      "**blog**: **MDX** 파일 시스템 기반 콘텐츠 관리, **sitemap/robots/JSON-LD/동적 OG 이미지** 등 **SEO** 최적화, **Mermaid** 다이어그램과 관리자 에디터를 지원했습니다.",
      "**resume**: 데이터 기반 이력서 웹앱을 구현하고, **html-to-image + jsPDF** 기반 PDF 다운로드, 다크/라이트 모드, 반응형 레이아웃을 제공했습니다.",
      "**llm**: **Gemini + Qdrant** 기반 **RAG** 답변 서비스를 구축해 블로그/이력서 콘텐츠를 벡터 검색하고, 출처가 포함된 스트리밍 답변을 제공했으며 **Docker Compose**로 배포했습니다.",
    ],
    image: "/projects/log-itjustbong.png",
  },
  {
    id: "pickiverse",
    name: "피키버스",
    description: "이상형 월드컵 제작/공유 서비스에서 **성능·비용·다국어 UX를 검증한 크로스 플랫폼**",
    period: "2025.01 ~",
    url: "https://pickiverse.com",
    highlights: [
      "**월 이미지 비용을 $32+에서 $5 수준으로 절감**해 트래픽 증가 구간의 운영 부담을 낮췄고, **AWS S3**를 **Cloudflare Images**로 전환하며 10MB 업로드 제한과 **image variant**를 적용했습니다.",
      "**초기 렌더링 체감 속도와 다국어 진입 경험을 개선**해 이탈 구간을 줄였고, **Next.js SSR + 스켈레톤 로딩**과 **locale middleware** 기반 자동 리다이렉션을 구현했습니다.",
      "**전체 인프라 비용을 10% 이상 절감**해 서비스 지속 운영 여력을 확보했고, **Vercel(프론트엔드) + Supabase(DB)** 구조에서 백엔드 **ARM** 전환과 **certbot/nginx HTTPS** 구성으로 **ALB** 비용을 제거했습니다.",
    ],
    image: "/projects/pickiverse.png",
  },
];

export const education: Education = {
  school: "숭실대학교",
  major: "AI융합학부",
  period: "2017.03 ~ 2024.02",
  gpa: "4.17",
  note: "창업, 성적, 비전 장학금 및 수상",
};

export const communities: Community[] = [
  {
    name: "Google Developer Group",
    period: "2022.09 ~ 2024.02",
    description: "프론트엔드 실험과 프로젝트 협업을 통해 **기술 선택 근거를 축적한** 대학 개발자 커뮤니티",
    activities: [
      "**여러 FE 스택 비교 기준을 정리**해 기술 선택 근거를 만들었고, 프레임워크 유무별 투두앱 구현과 세미나/코드잼을 운영했습니다.",
      "**팀 프로젝트 협업 경험을 구조화**하기 위해 구글 솔루션 챌린지 **SSUNG DELIVERY**와 GDSC 페스티벌 **WOW meet**에서 역할 분담과 결과 공유를 진행했습니다.",
    ],
  },
  {
    name: "GDXC",
    period: "2024.06 ~ 진행 중",
    description: "재학생-졸업생 연결을 통해 **실무 지식 전파 구조를 만든** 개발자 커뮤니티 창립 멤버",
    activities: [
      "**네트워킹 접점을 정례화**해 재학생과 졸업생 간 정보 교류 채널을 운영했습니다.",
      "**기술 Q&A 기반 지식 순환 구조를 운영**해 실무 이슈 해결 사례를 커뮤니티에 확산했습니다.",
    ],
  },
];

export const awards: Award[] = [
  { year: "2018", title: "메이커톤 위드캠프 1위" },
  { year: "2018", title: "메이커페어 전시회 참여" },
  { year: "2018", title: "교내 경진대회 장려상" },
  { year: "2021", title: "두드림 프로그램 우수상" },
  { year: "2021", title: "캠퍼스 CEO 캡스톤 어워즈 종합대상" },
  { year: "2021", title: "예비창업패키지 선정" },
  { year: "2021", title: "숭실대학교 Pre스타트업 선정 (매에컴퍼니)" },
  { year: "2021", title: "스타트업 in 동작 선정" },
  { year: "2022", title: "숭실대학교 Pre 스타트업 선정 (플로지다)" },
  { year: "2023", title: "숭실대학교 소프트웨어공모전 총장상" },
  { year: "2023", title: "Pre 스타트업 선정 (Sendee)" },
  { year: "2023", title: "카카오 관광데이터 활용 공모전 장려상" },
  { year: "2023", title: "창업유망팀 300 경진대회 성장트랙 선정" },
  { year: "2025", title: "LG전자 SI 공모전 우수상 수상" },
];

export const articles: Article[] = [
  { title: "캠퍼스 CEO 육성사업 제2회 캡스톤어워즈", date: "2021.07" },
  { title: "한큐플랜트 플랫폼 런칭", date: "2021.12" },
  { title: "GDSC LMS 개선 프로젝트 세미나 발표", date: "2022.11" },
  {
    title: "ESG 관련 역량과 실무 ... 스타트업 '소셜그라운드'",
    date: "2022.12",
  },
];

export const patents: Patent[] = [
  {
    title:
      "Method For Providing Local Advertisement Including Advertiser Business Place",
  },
  { title: "Mixed Beverage Manufacturing and Ordering Service Delivery System" },
  { title: "Beverage Dispensing System" },
];

export const profile = {
  name: "봉승우",
  title: "Frontend Engineer",
  tagline: "", // 선택사항: 없으면 undefined 또는 삭제
  links: {
    github: "https://github.com/itjustbong",
    linkedin: "https://www.linkedin.com/in/itjustbong/",
    email: "qhdgkdbs@gmail.com",
  },
};
