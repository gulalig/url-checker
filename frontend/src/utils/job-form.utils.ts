export const parseUrlsInput = (value: string): string[] =>
  value
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean);

export const normalizeUrlForComparison = (url: string): string =>
  url.trim().replace(/\/+$/, '').toLowerCase();

export const hasDuplicateUrls = (urls: string[]): boolean => {
  const normalizedUrls = urls.map(normalizeUrlForComparison);

  return new Set(normalizedUrls).size !== normalizedUrls.length;
};