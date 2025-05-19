import { useQuery } from "@tanstack/react-query";

const fetchContacts = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

const useGetContacts = (url) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['contacts', url],
    queryFn: () => fetchContacts(url),
  });

  return {
    data,
    loading: isLoading,
    error: isError ? error.message : null,
    refetch,
  };
};

export default useGetContacts;
