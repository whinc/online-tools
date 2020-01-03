export const debugErr = (...args: any[]) =>
  process.env.NODE_ENV !== "production" && console.error(...args);
export const debugLog = (...args: any[]) =>
  process.env.NODE_ENV !== "production" && console.log(...args);
export const debugWarn = (...args: any[]) =>
  process.env.NODE_ENV !== "production" && console.warn(...args);
