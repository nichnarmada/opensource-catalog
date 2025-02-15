export const REPOSITORY_COLLECTION = "repositories" as const

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
] as const

export const BLOCKED_KEYWORDS = [
  "deprecated",
  "archived",
  "moved to",
  "no longer maintained",
] as const

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

export const REPOSITORIES_CONFIG = {
  blocked_repositories: BLOCKED_REPOSITORIES,
  blocked_keywords: BLOCKED_KEYWORDS,
  suspicious_keywords: SUSPICIOUS_KEYWORDS,
} as const
