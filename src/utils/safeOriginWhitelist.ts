/**
 * Safe origin whitelist constant for WebView components
 * This ensures the correct array type is always used, preventing
 * "expected dynamic type 'array', but had type 'string'" errors
 */
export const SAFE_ORIGIN_WHITELIST: string[] = ['*']; 