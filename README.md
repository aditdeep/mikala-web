# Mikala Web - Frontend Monorepo

Complete Next.js 14 Turborepo monorepo for Mikala platform with 5 applications and shared packages.

## 📁 Project Structure

```
mikala-web/
├── apps/
│   ├── internal/     # Internal platform (Dashboard, Rekrutmen, Training, CC, Finance, Marketing)
│   ├── mitra/        # Mitra PWA app (Jobs, Payroll, Profile)
│   ├── klien/        # Klien PWA app (Layanan, Pasien, Tagihan)
│   ├── mgm/          # Public website - Mikala Garda Medika
│   └── mga/          # Public website - Mikala Garda Akademi
├── packages/
│   ├── ui/           # Shared UI components (Button, Card, Table, Modal, etc.)
│   ├── lib/          # Shared utilities (API client, auth, utils)
│   ├── hooks/        # Shared React hooks (useAuth, useNotifikasi)
│   ├── store/        # Shared Zustand stores (auth, notifications)
│   └── types/        # Shared TypeScript types
└── turbo.json        # Turborepo configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn
- Backend API running at `http://localhost:8000` (or set `NEXT_PUBLIC_API_URL`)

### Installation

```bash
# Clone and navigate to project
cd mikala-web

# Install dependencies
npm install

# Run all apps in development mode
npm run dev
```

### Run Individual Apps

```bash
# Internal platform (port 3000)
npm run internal

# Mitra PWA (port 3001)
npm run mitra

# Klien PWA (port 3002)
npm run klien

# MGM website (port 3003)
npm run mgm

# MGA website (port 3004)
npm run mga
```

## 🌐 Applications

### 1. Internal Platform (`apps/internal`)
**URL:** http://localhost:3000  
**Purpose:** Internal operations dashboard

**Features:**
- Dashboard with statistics and summaries
- Rekrutmen: Mitra recruitment management
- Training: Training program management
- Customer Care: Client and service order management
- Finance: Invoicing, payroll, and journal
- Marketing: Leads and partnership management
- Settings: User profile management

**Pages:**
- `/` - Dashboard home
- `/rekrutmen` - Mitra list
- `/training` - Training management
- `/customer-care` - CC hub
- `/finance` - Finance hub
- `/marketing` - Marketing hub
- `/settings` - Settings

**Auth:** Required (redirects to `/login` if not authenticated)

---

### 2. Mitra PWA (`apps/mitra`)
**URL:** http://localhost:3001  
**Purpose:** Mobile app for Mitra (caregivers)

**Features:**
- PWA-enabled (installable)
- Bottom navigation
- Dashboard with earnings stats
- Job listings and details
- Payroll history
- Profile management

**Pages:**
- `/` - Home/Dashboard
- `/jobs` - Available jobs
- `/payroll` - Payment history
- `/profile` - Profile settings
- `/auth/login` - Login page

**PWA:** Configured with manifest and service worker

---

### 3. Klien PWA (`apps/klien`)
**URL:** http://localhost:3002  
**Purpose:** Mobile app for Klien (clients)

**Features:**
- PWA-enabled (installable)
- Bottom navigation
- Dashboard with service overview
- Service management
- Patient management
- Invoice/billing
- Profile management

**Pages:**
- `/` - Home/Dashboard
- `/layanan` - Service orders
- `/pasien` - Patient list
- `/tagihan` - Invoices
- `/profile` - Profile settings
- `/auth/login` - Login page

**PWA:** Configured with manifest and service worker

---

### 4. MGM Website (`apps/mgm`)
**URL:** http://localhost:3003  
**Purpose:** Public website for Mikala Garda Medika (home care services)

**Features:**
- SEO-optimized landing pages
- Service information
- Contact form (submits to `/api/public/leads`)
- Responsive design

**Pages:**
- `/` - Homepage
- `/layanan` - Services listing
- `/tentang` - About us
- `/kontak` - Contact form

---

### 5. MGA Website (`apps/mga`)
**URL:** http://localhost:3004  
**Purpose:** Public website for Mikala Garda Akademi (training academy)

**Features:**
- SEO-optimized landing pages
- Training program information
- Registration form (submits to `/api/public/mga-registration`)
- Responsive design

**Pages:**
- `/` - Homepage
- `/program` - Program listing
- `/tentang` - About academy
- `/pendaftaran` - Registration form

## 📦 Shared Packages

### `@mikala/ui`
Reusable UI components built with Tailwind CSS:
- Button, Input, Card, Badge, Table, Avatar
- Select, Modal, Sidebar, Header, Spinner, Alert
- Utilities: `cn()` for className merging

### `@mikala/lib`
Core utilities and API integration:
- `apiClient` - Axios HTTP client with auth interceptors
- `authService` - Login, logout, token management
- Utility functions: `formatCurrency()`, `formatDate()`, `getStatusColor()`

### `@mikala/hooks`
Custom React hooks:
- `useAuth()` - Authentication state and methods
- `useNotifikasi()` - Notifications fetching
- `useOrder()`, `useBilling()` - Data fetching hooks

### `@mikala/store`
Zustand state management:
- `useAuthStore` - Global auth state
- `useNotifStore` - Notifications state
- `useUiStore` - UI state (modals, sidebars)

### `@mikala/types`
TypeScript type definitions:
- User, Mitra, Klien, Order, Tagihan types
- API response types with pagination

## 🔧 Configuration

### Environment Variables

Create `.env.local` in each app directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Tailwind Configuration

All apps use Tailwind CSS v4. Styles are imported from `@mikala/ui/src/styles/globals.css`.

### TypeScript

Monorepo uses shared `tsconfig.json` at root, extended by each app.

## 🏗️ Build & Deploy

### Build All Apps

```bash
npm run build
```

### Build Individual App

```bash
# Build internal app
cd apps/internal
npm run build

# Build mitra app
cd apps/mitra
npm run build
```

### Production Server

```bash
# Start all apps in production mode
npm run start

# Start individual app
cd apps/internal
npm start
```

## 🧪 Testing

### Development

All apps support hot-reload during development:

```bash
npm run dev
```

### API Integration Testing

1. Start backend API: `http://localhost:8000`
2. Start frontend apps: `npm run dev`
3. Test authentication flow:
   - Login at `/login`
   - Verify token storage
   - Access protected routes
   - Test logout
4. Test API calls:
   - Dashboard data fetching
   - CRUD operations
   - Error handling

### PWA Testing (Mitra & Klien)

1. Build the app: `npm run build`
2. Start production server: `npm start`
3. Open in browser (Chrome recommended)
4. Check for install prompt
5. Install and test offline functionality
6. Run Lighthouse audit (should score 90+)

## 📱 PWA Details

### Manifest Configuration

Both Mitra and Klien apps have `public/manifest.json`:
- Standalone display mode
- Theme colors (blue for Mitra, green for Klien)
- Icons in 192x192 and 512x512 sizes

### Service Worker

Configured via `next-pwa`:
- Automatically generated during build
- Disabled in development mode
- Caches static assets and API responses

### Install Prompts

- Appears on supported browsers after engagement
- Users can add to home screen
- Works offline after installation

## 🎨 Design System

### Colors

- **Primary (Blue):** `#4F46E5` - Internal, Mitra, MGM
- **Success (Green):** `#10B981` - Klien
- **Warning (Orange/Yellow):** Pending states
- **Danger (Red):** Errors, destructive actions
- **Purple:** `#7C3AED` - MGA (Academy)

### Typography

- Font: System fonts (default Next.js)
- Headings: Bold weights
- Body: Regular weight

### Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔐 Authentication Flow

1. User enters credentials at `/login`
2. Frontend calls `POST /api/auth/login`
3. Backend returns `{ token, user }`
4. Frontend stores token in `localStorage`
5. API client adds token to all requests via interceptor
6. Protected routes check `authService.isAuthenticated()`
7. On 401 response, auto-logout and redirect to login

## 📊 State Management

### Local State
- React `useState` for component state
- React `useEffect` for side effects

### Global State (Zustand)
- Auth state: current user, authentication status
- Notification state: unread count, notification list
- UI state: modal visibility, sidebar collapsed state

### Server State
- Fetch data in `useEffect` or custom hooks
- Store in component state
- Handle loading and error states

## 🚀 Performance

### Optimization Features
- Next.js 14 App Router with automatic code splitting
- Image optimization via `next/image`
- Font optimization via `next/font`
- Static generation for public sites (MGM, MGA)
- Dynamic imports for large components

### Bundle Size
- Shared packages reduce duplication
- Tree-shaking removes unused code
- Production builds are minified

## 🐛 Troubleshooting

### "Module not found" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
npm install
```

### Port already in use
```bash
# Kill process on port
lsof -ti:3000 | xargs kill -9

# Or change port in package.json scripts
"dev": "next dev -p 3001"
```

### API connection issues
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify backend is running
- Check browser console for CORS errors
- Ensure auth token is being sent

### PWA not installing
- Build app: `npm run build`
- Use production mode: `npm start`
- Check browser supports PWA
- Verify manifest.json is accessible
- Check service worker registration

## 📝 Development Guidelines

### Adding New Page
1. Create file in `app/` directory
2. Export default React component
3. Add to navigation if needed
4. Update this README

### Creating New Component
1. Add to `packages/ui/src/components/`
2. Export from `packages/ui/src/index.ts`
3. Use in apps: `import { Component } from '@mikala/ui'`

### Adding API Endpoint Integration
1. Use `apiClient` from `@mikala/lib`
2. Handle loading and error states
3. Use try-catch for error handling
4. Update types in `@mikala/types` if needed

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Build to verify: `npm run build`
5. Submit pull request

## 📄 License

Proprietary - Mikala 2026

## 📞 Support

For issues or questions:
- Email: dev@mikala.id
- Documentation: `/docs` (TBD)

---

**Built with ❤️ by Mikala Team**
