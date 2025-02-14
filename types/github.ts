export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  languages?: string[]
  stargazers_count: number
  topics: string[]
  // Add other GitHub API fields as needed
}

export interface GitHubSearchResponse {
  total_count: number
  incomplete_results: boolean
  items: GitHubRepo[]
}

export const BLOCKED_REPOSITORIES = [
  // Programming Languages & Core Libraries
  "golang/go",
  "python/cpython",
  "nodejs/node",
  "rust-lang/rust",

  // UI Frameworks & Libraries
  "facebook/react",
  "facebook/react-native",
  "vuejs/vue",
  "twbs/bootstrap",
  "tailwindlabs/tailwindcss",
  "mui/material-ui",
  "ant-design/ant-design",
  "tensorflow/tensorflow",
  "flutter/flutter",
  "vercel/next.js",
  "expo/expo",
  "storybookjs/storybook",
  "storybookjs/storybook-design-system",
  "storybookjs/storybook-addon-design-assets",
  "preactjs/preact",
  "curl/curl",

  // Learning Resources
  "freeCodeCamp/freeCodeCamp",
  "codecademy/docs",
  "kamranahmedse/developer-roadmap",
  "getify/You-Dont-Know-JS",
  "FreeCodeCampChina/freecodecamp.cn",

  // Awesome Lists & Meta Repos
  "sindresorhus/awesome",
  "EbookFoundation/free-programming-books",
  "public-apis/public-apis",

  // Documentation & Guides
  "microsoft/TypeScript",
  "mdn/content",
  "docker/docs",
  "vuejs/docs",

  // Other
  "996icu/996.ICU",
  "CyC2018/CS-Notes",
  "TheAlgorithms/Python",
  "TheAlgorithms/Java",
  "TheAlgorithms/C",
  "TheAlgorithms/Cpp",
  "ossu/computer-science",
  "trekhleb/javascript-algorithms",
  "donnemartin/system-design-primer",
  "jwasham/coding-interview-university",
  "codecrafters-io/build-your-own-x",
  "jlevy/the-art-of-command-line",
  "Snailclimb/JavaGuide",
  "vinta/awesome-python",
  "labuladong/fucking-algorithm",
] as const

export type BlockedRepository = (typeof BLOCKED_REPOSITORIES)[number]

export function isBlockedRepository(fullName: string): boolean {
  return BLOCKED_REPOSITORIES.includes(fullName as BlockedRepository)
}

// Strict blocklist - always filter these out
export const BLOCKED_KEYWORDS = [
  "deprecated",
  "archived",
  "moved to",
  "no longer maintained",
] as const

// Suspicious keywords - filter if they appear in specific combinations
export const SUSPICIOUS_KEYWORDS = {
  LEARNING: ["course", "guide", "tutorial", "learn", "curriculum", "roadmap"],
  LIBRARIES: [
    "UI library",
    "UI framework",
    "UI components",
    "UI kit",
    "component library",
    "style guide",
    "design system",
    "design tokens",
    "design pattern",
    "design pattern library",
    "a list of",
    "a collection of",
    "a curated list of",
    "interview handbook",
    "interview preparation",
    "interview questions",
    "interview tips",
  ],
  META: [
    "awesome list",
    "collection of",
    "list of",
    "curated list",
    "template",
    "starter kit",
    "boilerplate",
    "starter",
    "starter project",
    "starter code",
    "starter template",
    "ChatGPT prompt",
  ],
} as const

export function shouldBlockRepository(repo: GitHubRepo): boolean {
  if (!repo.description) return false
  const description = repo.description.toLowerCase()

  // Always block if contains any blocked keywords
  if (
    BLOCKED_KEYWORDS.some((keyword) =>
      description.includes(keyword.toLowerCase())
    )
  ) {
    return true
  }

  // Block if contains multiple suspicious keywords
  const hasSuspiciousLearning = SUSPICIOUS_KEYWORDS.LEARNING.some((keyword) =>
    description.includes(keyword.toLowerCase())
  )
  const hasSuspiciousLibrary = SUSPICIOUS_KEYWORDS.LIBRARIES.some((keyword) =>
    description.includes(keyword.toLowerCase())
  )
  const hasSuspiciousMeta = SUSPICIOUS_KEYWORDS.META.some((keyword) =>
    description.includes(keyword.toLowerCase())
  )

  // Block if has multiple suspicious indicators
  const suspiciousCount = [
    hasSuspiciousLearning,
    hasSuspiciousLibrary,
    hasSuspiciousMeta,
  ].filter(Boolean).length

  return suspiciousCount >= 2
}
