export const COOKIE_NAME = 'access_token';
export const REFRESH_COOKIE_NAME = 'refresh_token';

export const ACCESS_TTL_S = 15 * 60;            // 15 minutes
export const REFRESH_TTL_S = 7 * 24 * 60 * 60;  // 7 days

// the access cookie goes to every endpoint; the refresh cookie only to /auth.
// If a Coolify proxy mounts the API under a prefix (e.g. /api), change the refresh path to '/api/auth'.
export const ACCESS_COOKIE_PATH = '/';
export const REFRESH_COOKIE_PATH = '/auth';