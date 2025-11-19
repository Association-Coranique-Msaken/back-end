/**
 * Token Management Utility
 * Handles storing, retrieving, and refreshing authentication tokens
 */

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  userTokenExpiration?: string;
}

interface UserData {
  id: string;
  username?: string;
  role?: string;
  type: 'admin' | 'teacher' | 'user';
}

class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly USER_DATA_KEY = 'userData';
  private static readonly TOKEN_EXPIRY_KEY = 'tokenExpiry';

  /**
   * Store authentication tokens and user data
   */
  static setTokens(tokens: TokenData, userData: UserData): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    
    // Calculate expiry time from expiresIn or userTokenExpiration
    let expiryTime: number;
    if (tokens.userTokenExpiration) {
      // Parse ISO date string
      expiryTime = new Date(tokens.userTokenExpiration).getTime();
    } else if (tokens.expiresIn) {
      // Calculate from expiresIn seconds
      expiryTime = Date.now() + tokens.expiresIn * 1000;
    } else {
      // Default to 1 hour
      expiryTime = Date.now() + 3600 * 1000;
    }
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  /**
   * Get access token
   */
  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get stored user data
   */
  static getUserData(): UserData | null {
    const data = localStorage.getItem(this.USER_DATA_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data) as UserData;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired or about to expire (within 5 minutes)
   */
  static isTokenExpired(): boolean {
    const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;

    const expiry = parseInt(expiryTime, 10);
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    return now >= expiry - fiveMinutes;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const userData = this.getUserData();
    return !!accessToken && !!userData && !this.isTokenExpired();
  }

  /**
   * Update access token after refresh
   */
  static updateAccessToken(accessToken: string, expiresIn: number): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  /**
   * Clear all authentication data
   */
  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  /**
   * Get user role
   */
  static getUserRole(): string | null {
    const userData = this.getUserData();
    return userData?.role || null;
  }

  /**
   * Get user type
   */
  static getUserType(): 'admin' | 'teacher' | 'user' | null {
    const userData = this.getUserData();
    return userData?.type || null;
  }
}

export default TokenManager;
