/**
 * E2E Test Type Imports
 *
 * This file consolidates type imports for E2E tests:
 * - API response types from shared module (source of truth)
 * - Entity types from frontend (User, Admin, Teacher, Group)
 */

// Import shared API response types
import type { ApiResponse, LoginResponse } from "../../../shared/types";

// Import entity types from frontend
import type { User, Teacher, Group, Admin } from "../../../frontend/src/api/types";

// Import AxiosResponse from axios for HTTP response typing
import type { AxiosResponse } from "axios";

// Re-export everything for convenience
export type { ApiResponse, LoginResponse, User, Teacher, Group, Admin, AxiosResponse };
