# Shared Types Module

This directory contains TypeScript type definitions shared across the monorepo:
- **Frontend**: React/TypeScript application
- **Backend**: Express/TypeScript API
- **E2E Tests**: Integration test suite

## Purpose

Single source of truth for:
- API response formats (`ApiResponse`, `LoginResponse`)
- Pagination structures (`PageMeta`, `PagedResponse`)
- Common data contracts

## Usage

### Frontend
```typescript
import type { ApiResponse, LoginResponse } from '../../shared/types';
```

### Backend
```typescript
import type { ApiResponse, LoginResponse } from '../../shared/types';
```

### E2E Tests
```typescript
import type { ApiResponse, LoginResponse } from '../../../shared/types';
```

## Maintenance

When modifying these types:
1. Ensure changes are backward compatible
2. Update all three consuming modules if needed
3. Run tests to verify compatibility: `npm test` (backend), `npm run test:e2e` (backend)
