import { useQuery } from "@tanstack/react-query";

async function fetchData(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Custom hook for GET requests
 * @param {string} key - Unique query key
 * @param {string} url - API endpoint
 * @param {object} options - Extra options for react-query
 */
export function useFetchQuery(key, url, options = {}) {
  return useQuery({
    queryKey: [key, url], // unique key
    queryFn: () => fetchData(url),
    staleTime: 5 * 60 * 1000, // default 5 min caching
    ...options, // allow overriding react-query options
  });
}

export default useFetchQuery;