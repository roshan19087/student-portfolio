# Full-Stack Student Developer Portfolio & Admin Hub

A modern, scalable monorepo for a personal developer portfolio and content management system.

## Monorepo Structure

```
student-portfolio/
├── package.json          # Root workspace configuration & scripts
├── tsconfig.base.json    # Shared base TypeScript configuration
├── eslint.config.js      # Monorepo-wide ESLint configuration
├── .prettierrc           # Monorepo-wide Prettier formatting rules
├── .env.example          # Environment variables template
├── shared/               # Shared types, Zod schemas, and API contracts
├── server/               # Node.js + Express + TypeScript REST API
└── client/               # React + TypeScript + Vite + Tailwind CSS frontend
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in necessary configuration:

```bash
cp .env.example .env
```

### 3. Create Admin Account

Run the interactive admin creation CLI:

```bash
npm run admin:create
```

### 4. Development Mode

Run all workspaces concurrently:

```bash
npm run dev
```

- Client runs on: `http://localhost:5173`
- Server API runs on: `http://localhost:5000`
- Server Health endpoint: `http://localhost:5000/health`
- Static Uploads directory: `http://localhost:5000/uploads/...`

### 5. Media & Storage Architecture (Phase 6)

The application features a provider-agnostic storage abstraction (`StorageService`) supporting both local filesystem storage (development) and Cloudinary (production media).

#### Storage Providers

- **Local Storage (`STORAGE_PROVIDER=local`)**: Files are stored in `server/uploads/` partitioned into `images/`, `documents/`, and `releases/`. Served statically through `/uploads/...` with directory traversal protection.
- **Cloudinary (`STORAGE_PROVIDER=cloudinary`)**: Direct upload to Cloudinary CDN in production. Requires `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.

#### Upload Categories & Limits

| Category    | Max Size | Allowed Extensions               | Validation / Signature                                                |
| :---------- | :------- | :------------------------------- | :-------------------------------------------------------------------- |
| **IMAGE**   | 5 MB     | `.jpg`, `.jpeg`, `.png`, `.webp` | Magic-byte inspection (JPEG, PNG, WebP). **SVG strictly prohibited.** |
| **PDF**     | 10 MB    | `.pdf`                           | Binary header inspection (`%PDF-`). Safe for resume documents.        |
| **RELEASE** | 100 MB   | `.apk`, `.exe`, `.dmg`, `.zip`   | Validated executable/archive binary signatures.                       |

#### Protected Storage Endpoints (ADMIN only)

- `POST /api/v1/admin/media/upload` (multipart/form-data: `file` + `category`)
- `DELETE /api/v1/admin/media/:storageKey`

### 6. Build, Test & Quality Checks

```bash
npm run format
npm run format:check
npm run typecheck
npm run lint
npm run test
npm run build
```
