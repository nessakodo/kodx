import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// HTTP fetch wrapper
export async function apiRequest<T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // Check if the response is ok (status in the range 200-299)
  if (!response.ok) {
    // Try to parse error message from response
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    } catch (e) {
      // If we can't parse the error, just throw a generic one
      throw new Error(`API error: ${response.status}`);
    }
  }

  // For 204 No Content responses, return null
  if (response.status === 204) {
    return null as T;
  }

  // Parse JSON response
  const data = await response.json();
  return data as T;
}