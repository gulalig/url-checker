export const parseUrlsInput = (value: string): string[] =>
  value
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean);