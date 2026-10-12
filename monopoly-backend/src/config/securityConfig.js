export const JWT_SECRET = process.env.JWT_SECRET || 'monopoly_jwt_secret_key_change_in_production'

export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 天