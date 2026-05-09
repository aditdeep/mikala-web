# ✅ Mikala Web - Verification Checklist

Run these commands to verify the build is complete:

## 1. Structure Verification
```bash
# Check all apps exist
ls -la apps/
# Should show: internal, klien, mga, mgm, mitra

# Check all packages exist  
ls -la packages/
# Should show: hooks, lib, store, types, ui

# Count TypeScript files
find apps packages -name "*.tsx" -o -name "*.ts" | grep -v node_modules | wc -l
# Should show: 78+
```

## 2. Dependency Installation
```bash
# Install all dependencies
npm install

# Verify no errors in package resolution
npm ls --depth=0
```

## 3. TypeScript Compilation
```bash
# Check TypeScript in all workspaces
npm run build --workspaces
```

## 4. Development Server Test
```bash
# Run all apps simultaneously
npm run dev

# Or run individually:
npm run internal  # Port 3000
npm run mitra     # Port 3001
npm run klien     # Port 3002
npm run mgm       # Port 3003
npm run mga       # Port 3004
```

## 5. App-Specific Checks

### Internal App
- [ ] Navigate to http://localhost:3000
- [ ] Login page loads (/login)
- [ ] Dashboard loads (/)
- [ ] Sidebar navigation works
- [ ] All menu items accessible

### Mitra App  
- [ ] Navigate to http://localhost:3001
- [ ] Login page loads
- [ ] Bottom navigation visible
- [ ] All 4 nav items work (Home, Jobs, Payroll, Profile)

### Klien App
- [ ] Navigate to http://localhost:3002
- [ ] Login page loads
- [ ] Bottom navigation visible
- [ ] All 5 nav items work (Home, Layanan, Pasien, Tagihan, Profile)

### MGM Website
- [ ] Navigate to http://localhost:3003
- [ ] Homepage loads with hero section
- [ ] Navigation works (/layanan, /tentang, /kontak)
- [ ] Contact form renders

### MGA Website
- [ ] Navigate to http://localhost:3004
- [ ] Homepage loads with hero section
- [ ] Navigation works (/program, /tentang, /pendaftaran)
- [ ] Registration form renders

## 6. Shared Package Verification
```bash
# Check UI components export
cat packages/ui/src/index.ts

# Check lib utilities export
cat packages/lib/index.ts

# Check types export
cat packages/types/index.ts
```

## 7. PWA Configuration Check
```bash
# Check Mitra manifest
cat apps/mitra/public/manifest.json

# Check Klien manifest
cat apps/klien/public/manifest.json

# Check next-pwa config
cat apps/mitra/next.config.ts
cat apps/klien/next.config.ts
```

## 8. Documentation Check
```bash
# README exists and is comprehensive
wc -l README.md
# Should be 400+ lines

# Completion report exists
wc -l COMPLETION_REPORT.md
# Should be 400+ lines
```

## 9. Production Build Test
```bash
# Build all apps
npm run build

# Check build output
ls -la apps/*/,next/

# Start production server
npm run start
```

## 10. API Integration Check

### Verify API client configuration:
```bash
# Check apiClient setup
cat packages/lib/api.ts | grep -A 10 "apiClient ="

# Check auth service
cat packages/lib/auth.ts | grep -A 5 "login"
```

### Test endpoints (requires backend):
- POST /api/auth/login
- GET /api/auth/me
- GET /api/internal/dashboard/summary
- GET /api/mitra/dashboard
- GET /api/klien/dashboard
- POST /api/public/leads
- POST /api/public/mga-registration

## Expected Results ✅

All checks should pass:
- ✅ All 5 apps accessible
- ✅ No TypeScript errors
- ✅ No build errors  
- ✅ All pages load
- ✅ Navigation functional
- ✅ Shared packages working
- ✅ PWA configured
- ✅ Documentation complete

## If Issues Occur

### Module not found
```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
```

### Build errors
```bash
# Clear Next.js cache
rm -rf apps/*/.next
npm run build
```

### Port conflicts
```bash
# Change port in package.json or kill process
lsof -ti:3000 | xargs kill -9
```

---

**Last Updated:** May 9, 2026
**Status:** All systems operational ✅
