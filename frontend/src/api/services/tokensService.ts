import apiClient from '../config';
import type { ClearExpiredTokensDto, InvalidateUserTokensDto } from '../types';

/**
 * Tokens API Service
 * Handles all token management API calls
 */
class TokensService {
  /**
   * Clear expired tokens
   * POST /api/v1/token-api/clear-expired
   */
  async clearExpiredTokens(data?: ClearExpiredTokensDto): Promise<void> {
    await apiClient.post('/token-api/clear-expired', data);
  }

  /**
   * Invalidate user tokens
   * POST /api/v1/token-api/invalidate-user-tokens
   */
  async invalidateUserTokens(data: InvalidateUserTokensDto): Promise<void> {
    await apiClient.post('/token-api/invalidate-user-tokens', data);
  }
}

export default new TokensService();
