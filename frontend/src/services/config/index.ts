const getRequiredEnv = (key: keyof ImportMetaEnv): string => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const apiConfig = {
  baseUrl: getRequiredEnv('VITE_API_BASE_URL'),
  timeoutMs: 15_000,
} as const;