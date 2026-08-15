import {
  PublicProfileDto,
  PublicSkillCategoryDto,
  PublicProjectListItemDto,
  PublicProjectDetailDto,
  PublicAppListItemDto,
  PublicAppDetailDto,
  PublicEducationDto,
  PublicCertificateDto,
  PublicBlogPostListItemDto,
  PublicBlogPostDetailDto,
  PublicSiteSettingsDto,
} from '@portfolio/shared';

export const mockProfile: PublicProfileDto = {
  id: 'profile-1',
  fullName: 'Roshan Kumar',
  tagline: 'Computer Science Student & Full-Stack Developer',
  shortBio: 'Building modern web applications, distributed APIs, and developer tools.',
  fullAbout:
    'I am a computer science student passionate about building performant web applications, elegant developer tools, and reliable backend systems. Currently focused on TypeScript, React, Node.js, and cloud architecture, I spend my time exploring software design patterns, contributing to open-source projects, and shipping real-world apps.',
  location: 'Jharkhand, India',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
  resumePdfUrl: '/uploads/documents/sample-resume.pdf',
  statusBadge: 'Available for Internships',
  isAvailable: true,
  socialLinks: [
    { id: '1', platform: 'GITHUB', url: 'https://github.com', displayOrder: 1 },
    { id: '2', platform: 'LINKEDIN', url: 'https://linkedin.com', displayOrder: 2 },
    { id: '3', platform: 'TWITTER', url: 'https://twitter.com', displayOrder: 3 },
  ],
  updatedAt: '2026-02-01T00:00:00Z',
};

export const mockSkillCategories: PublicSkillCategoryDto[] = [
  {
    id: 'cat-1',
    name: 'Frontend',
    displayOrder: 1,
    skills: [
      { id: 's1', name: 'React', proficiencyLevel: 'Advanced', isFeatured: true, displayOrder: 1 },
      {
        id: 's2',
        name: 'TypeScript',
        proficiencyLevel: 'Advanced',
        isFeatured: true,
        displayOrder: 2,
      },
      {
        id: 's3',
        name: 'Tailwind CSS',
        proficiencyLevel: 'Advanced',
        isFeatured: true,
        displayOrder: 3,
      },
      {
        id: 's4',
        name: 'Next.js',
        proficiencyLevel: 'Intermediate',
        isFeatured: false,
        displayOrder: 4,
      },
      { id: 's5', name: 'Vite', proficiencyLevel: 'Advanced', isFeatured: false, displayOrder: 5 },
    ],
  },
  {
    id: 'cat-2',
    name: 'Backend & APIs',
    displayOrder: 2,
    skills: [
      {
        id: 's6',
        name: 'Node.js',
        proficiencyLevel: 'Advanced',
        isFeatured: true,
        displayOrder: 1,
      },
      {
        id: 's7',
        name: 'Express.js',
        proficiencyLevel: 'Advanced',
        isFeatured: true,
        displayOrder: 2,
      },
      {
        id: 's8',
        name: 'PostgreSQL',
        proficiencyLevel: 'Intermediate',
        isFeatured: true,
        displayOrder: 3,
      },
      {
        id: 's9',
        name: 'Prisma ORM',
        proficiencyLevel: 'Advanced',
        isFeatured: true,
        displayOrder: 4,
      },
      {
        id: 's10',
        name: 'REST & GraphQL',
        proficiencyLevel: 'Intermediate',
        isFeatured: false,
        displayOrder: 5,
      },
    ],
  },
  {
    id: 'cat-3',
    name: 'DevOps & Tooling',
    displayOrder: 3,
    skills: [
      {
        id: 's11',
        name: 'Git & GitHub',
        proficiencyLevel: 'Advanced',
        isFeatured: true,
        displayOrder: 1,
      },
      {
        id: 's12',
        name: 'Docker',
        proficiencyLevel: 'Intermediate',
        isFeatured: false,
        displayOrder: 2,
      },
      {
        id: 's13',
        name: 'Vitest & Jest',
        proficiencyLevel: 'Advanced',
        isFeatured: true,
        displayOrder: 3,
      },
      {
        id: 's14',
        name: 'CI/CD Pipelines',
        proficiencyLevel: 'Intermediate',
        isFeatured: false,
        displayOrder: 4,
      },
      {
        id: 's15',
        name: 'Linux',
        proficiencyLevel: 'Intermediate',
        isFeatured: false,
        displayOrder: 5,
      },
    ],
  },
];

export const mockProjects: PublicProjectListItemDto[] = [
  {
    id: 'proj-1',
    title: 'Cloud Pulse — System Monitoring Platform',
    slug: 'cloud-pulse-monitoring',
    shortSummary:
      'A real-time microservice monitoring dashboard with live metrics, alerting hooks, and health telemetry.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    status: 'COMPLETED',
    isFeatured: true,
    githubUrl: 'https://github.com',
    liveDemoUrl: 'https://demo-cloud-pulse.dev',
    displayOrder: 1,
    createdAt: '2026-01-15T00:00:00Z',
    skills: [
      { id: 'ps1', name: 'TypeScript', isFeatured: true, displayOrder: 1 },
      { id: 'ps2', name: 'React', isFeatured: true, displayOrder: 2 },
      { id: 'ps3', name: 'Node.js', isFeatured: true, displayOrder: 3 },
      { id: 'ps4', name: 'PostgreSQL', isFeatured: true, displayOrder: 4 },
    ],
  },
  {
    id: 'proj-2',
    title: 'DevCollab — Realtime Markdown Hub',
    slug: 'dev-collab-markdown',
    shortSummary:
      'Collaborative documentation editor with live cursor presence, version history, and instant preview rendering.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    status: 'COMPLETED',
    isFeatured: true,
    githubUrl: 'https://github.com',
    liveDemoUrl: 'https://devcollab.demo',
    displayOrder: 2,
    createdAt: '2026-01-20T00:00:00Z',
    skills: [
      { id: 'ps5', name: 'React', isFeatured: true, displayOrder: 1 },
      { id: 'ps6', name: 'Tailwind CSS', isFeatured: true, displayOrder: 2 },
      { id: 'ps7', name: 'WebSockets', isFeatured: false, displayOrder: 3 },
    ],
  },
  {
    id: 'proj-3',
    title: 'TaskFlow CLI & API Engine',
    slug: 'taskflow-engine',
    shortSummary:
      'Developer productivity CLI tool for workflow automation and local environment orchestration.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80',
    status: 'IN_PROGRESS',
    isFeatured: false,
    githubUrl: 'https://github.com',
    displayOrder: 3,
    createdAt: '2026-02-01T00:00:00Z',
    skills: [
      { id: 'ps8', name: 'Node.js', isFeatured: true, displayOrder: 1 },
      { id: 'ps9', name: 'TypeScript', isFeatured: true, displayOrder: 2 },
      { id: 'ps10', name: 'Docker', isFeatured: false, displayOrder: 3 },
    ],
  },
];

export const mockProjectDetail: PublicProjectDetailDto = {
  id: 'proj-1',
  title: 'Cloud Pulse — System Monitoring Platform',
  slug: 'cloud-pulse-monitoring',
  shortSummary:
    'A real-time microservice monitoring dashboard with live metrics, alerting hooks, and health telemetry.',
  fullDescription:
    'Cloud Pulse was built to solve the observability challenge in containerized microservices. It aggregates heartbeat pings, memory consumption stats, and latency curves into a cohesive, responsive control center. Built using clean event-driven patterns with Express, WebSocket streaming, and TanStack charts.',
  thumbnailUrl:
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  status: 'COMPLETED',
  isFeatured: true,
  githubUrl: 'https://github.com',
  liveDemoUrl: 'https://demo-cloud-pulse.dev',
  displayOrder: 1,
  createdAt: '2026-01-15T00:00:00Z',
  updatedAt: '2026-02-01T00:00:00Z',
  skills: [
    { id: 'ps1', name: 'TypeScript', isFeatured: true, displayOrder: 1 },
    { id: 'ps2', name: 'React', isFeatured: true, displayOrder: 2 },
    { id: 'ps3', name: 'Node.js', isFeatured: true, displayOrder: 3 },
    { id: 'ps4', name: 'PostgreSQL', isFeatured: true, displayOrder: 4 },
  ],
  screenshots: [
    {
      id: 'sc1',
      imageUrl:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
      caption: 'Live Telemetry Dashboard Overview',
      displayOrder: 1,
    },
    {
      id: 'sc2',
      imageUrl:
        'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&auto=format&fit=crop&q=80',
      caption: 'Alerting Policies & Threshold Configuration',
      displayOrder: 2,
    },
  ],
};

export const mockApps: PublicAppListItemDto[] = [
  {
    id: 'app-1',
    name: 'Pomodoro Focus Desktop',
    slug: 'pomodoro-focus-desktop',
    tagline:
      'Minimalist productivity timer with task batching, ambient audio, and offline session tracking.',
    iconUrl:
      'https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&auto=format&fit=crop&q=80',
    currentVersion: '1.2.0',
    isFeatured: true,
    displayOrder: 1,
    latestReleases: [
      {
        id: 'rel-1',
        version: '1.2.0',
        platform: 'WINDOWS',
        downloadUrl: '/uploads/releases/pomodoro-focus-v1.2.0.zip',
        releaseNotes: 'Performance improvements and dark mode support.',
        releaseDate: '2026-02-10T00:00:00Z',
      },
      {
        id: 'rel-2',
        version: '1.2.0',
        platform: 'MACOS',
        downloadUrl: '/uploads/releases/pomodoro-focus-v1.2.0.dmg',
        releaseNotes: 'Native macOS Silicon support.',
        releaseDate: '2026-02-10T00:00:00Z',
      },
    ],
  },
  {
    id: 'app-2',
    name: 'DevSnippet Mobile Vault',
    slug: 'dev-snippet-vault',
    tagline:
      'Pocket code snippet manager with syntax highlighting, search filters, and local encrypted cache.',
    iconUrl:
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=200&auto=format&fit=crop&q=80',
    currentVersion: '1.0.4',
    isFeatured: true,
    displayOrder: 2,
    latestReleases: [
      {
        id: 'rel-3',
        version: '1.0.4',
        platform: 'ANDROID',
        downloadUrl: '/uploads/releases/devsnippet-v1.0.4.apk',
        releaseNotes: 'Initial Android public release with offline syncing.',
        releaseDate: '2026-01-28T00:00:00Z',
      },
    ],
  },
];

export const mockAppDetail: PublicAppDetailDto = {
  id: 'app-1',
  name: 'Pomodoro Focus Desktop',
  slug: 'pomodoro-focus-desktop',
  tagline:
    'Minimalist productivity timer with task batching, ambient audio, and offline session tracking.',
  description:
    'Pomodoro Focus Desktop is an intuitive desktop companion engineered to reduce distraction and foster deep flow state. It integrates smart interval management, customizable break audio, and zero-telemetry local data storage.',
  iconUrl:
    'https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&auto=format&fit=crop&q=80',
  currentVersion: '1.2.0',
  isFeatured: true,
  displayOrder: 1,
  allReleases: [
    {
      id: 'rel-1',
      version: '1.2.0',
      platform: 'WINDOWS',
      downloadUrl: '/uploads/releases/pomodoro-focus-v1.2.0.zip',
      releaseNotes: 'Added custom sound presets and optimized render loop.',
      releaseDate: '2026-02-10T00:00:00Z',
    },
    {
      id: 'rel-2',
      version: '1.1.0',
      platform: 'MACOS',
      downloadUrl: '/uploads/releases/pomodoro-focus-v1.1.0.dmg',
      releaseNotes: 'Native Apple Silicon binary support.',
      releaseDate: '2026-01-20T00:00:00Z',
    },
  ],
  latestReleases: [
    {
      id: 'rel-1',
      version: '1.2.0',
      platform: 'WINDOWS',
      downloadUrl: '/uploads/releases/pomodoro-focus-v1.2.0.zip',
      releaseNotes: 'Added custom sound presets and optimized render loop.',
      releaseDate: '2026-02-10T00:00:00Z',
    },
  ],
  screenshots: [
    {
      id: 'app-sc1',
      imageUrl:
        'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1000&auto=format&fit=crop&q=80',
      caption: 'Timer & Session Focus Mode',
      displayOrder: 1,
    },
  ],
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-02-10T00:00:00Z',
};

export const mockEducation: PublicEducationDto[] = [
  {
    id: 'edu-1',
    institution: 'University of California, Berkeley',
    degree: 'B.S. in Computer Science',
    fieldOfStudy: 'Computer Science & Software Engineering',
    startDate: '2023-09-01T00:00:00Z',
    endDate: '2027-05-30T00:00:00Z',
    gradeOrCgpa: '3.88 GPA',
    activities: 'ACM Student Chapter, Open Source Club, Hackathon Team Lead',
    coursework: [
      'Data Structures & Algorithms',
      'Computer Architecture',
      'Database Systems',
      'Operating Systems',
      'Discrete Mathematics',
      'Software Engineering Principles',
    ],
    displayOrder: 1,
  },
];

export const mockCertificates: PublicCertificateDto[] = [
  {
    id: 'cert-1',
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    issueDate: '2025-11-10T00:00:00Z',
    credentialId: 'AWS-CCP-987654321',
    credentialUrl: 'https://aws.amazon.com/verification',
    imageUrl:
      'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=300&auto=format&fit=crop&q=80',
    displayOrder: 1,
  },
  {
    id: 'cert-2',
    title: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Meta / Coursera',
    issueDate: '2025-06-15T00:00:00Z',
    credentialId: 'COURSERA-META-FED-1234',
    credentialUrl: 'https://coursera.org/verify',
    imageUrl:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=80',
    displayOrder: 2,
  },
];

export const mockBlogPosts: PublicBlogPostListItemDto[] = [
  {
    id: 'blog-1',
    title: 'Architecting Clean Monorepos with TypeScript and Workspaces',
    slug: 'architecting-clean-monorepos-typescript',
    summary:
      'A deep dive into setting up shared packages, strict compiler boundaries, and unified tooling across client and server.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    publishedAt: '2026-02-05T00:00:00Z',
    readingTimeMinutes: 6,
    tags: [
      { id: 't1', name: 'TypeScript', slug: 'typescript' },
      { id: 't2', name: 'Architecture', slug: 'architecture' },
    ],
  },
  {
    id: 'blog-2',
    title: 'Understanding Token Rotation and Refresh Token Reuse Detection',
    slug: 'token-rotation-and-reuse-detection',
    summary:
      'How to implement stateless JWT access tokens and stateful rotating refresh tokens securely with SHA-256 and Argon2id.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    publishedAt: '2026-01-20T00:00:00Z',
    readingTimeMinutes: 8,
    tags: [
      { id: 't3', name: 'Security', slug: 'security' },
      { id: 't4', name: 'Node.js', slug: 'nodejs' },
    ],
  },
];

export const mockBlogPostDetail: PublicBlogPostDetailDto = {
  id: 'blog-1',
  title: 'Architecting Clean Monorepos with TypeScript and Workspaces',
  slug: 'architecting-clean-monorepos-typescript',
  contentMarkdown: `
# Architecting Clean Monorepos with TypeScript and Workspaces

Modern full-stack development demands consistent types, synchronized validation schemas, and frictionless cross-package workflows. By structuring our project as an **npm workspace** monorepo, we eliminate contract drift between frontend and backend.

## The Problem with Separate Repositories

In traditional multi-repo setups:
1. Backend changes API response shape.
2. Frontend relies on outdated TypeScript interfaces.
3. Breaking bugs only surface in end-to-end testing or production.

## The Solution: A Dedicated Shared Package

\`\`\`
student-portfolio/
├── shared/     # Zod schemas, DTO interfaces, API contracts
├── server/     # Express REST API
└── client/     # React + Vite client
\`\`\`

By compiling \`@portfolio/shared\` with TypeScript project references, both \`server\` and \`client\` consume the exact same source of truth in real time.

## Key Takeaways

- Centralize DTOs in a shared TypeScript library.
- Keep validation schemas co-located with response contracts.
- Use strict TypeScript configs with no implicit \`any\`.
  `,
  summary:
    'A deep dive into setting up shared packages, strict compiler boundaries, and unified tooling across client and server.',
  coverImageUrl:
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
  publishedAt: '2026-02-05T00:00:00Z',
  readingTimeMinutes: 6,
  tags: [
    { id: 't1', name: 'TypeScript', slug: 'typescript' },
    { id: 't2', name: 'Architecture', slug: 'architecture' },
  ],
  updatedAt: '2026-02-05T00:00:00Z',
};

export const mockSiteSettings: PublicSiteSettingsDto = {
  siteTitle: 'DevPortfolio',
  siteDescription:
    'Personal portfolio of Roshan Kumar, showcasing web apps, APIs, and open-source software.',
  authorName: 'Roshan Kumar',
  seoKeywords: ['fullstack', 'typescript', 'react', 'student', 'developer', 'portfolio'],
  features: {
    blogEnabled: true,
    appsEnabled: true,
    certificatesEnabled: true,
    contactFormEnabled: true,
  },
};
