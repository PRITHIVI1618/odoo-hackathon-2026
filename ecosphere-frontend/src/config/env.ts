// Define environment variables with strict typing
export const env = {
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  MODE: import.meta.env.MODE || 'development',
  IS_DEV: import.meta.env.DEV || true,
}

// Add validation logic if required in the future
