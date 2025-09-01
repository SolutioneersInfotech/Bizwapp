import { useQuery } from '@tanstack/react-query';


const fetchUser = async () => {
  const res = await fetch('https://api.bizwapp.com/api/auth/me', {
    method: 'GET',
    credentials: 'include', 
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }

  return res.json();
};

const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: false, 
    staleTime: 5 * 60 * 1000, 
  });
};

export default useUser;