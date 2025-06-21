import { useQuery } from '@tanstack/react-query';


const fetchUser = async () => {
  const res = await fetch('https://bizwapp-backend-2.onrender.com/api/auth/me', {
    method: 'GET',
    credentials: 'include', // sends cookies (important)
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
    retry: false, // optional: don't retry on fail
    staleTime: 5 * 60 * 1000, // cache for 5 mins
  });
};

export default useUser;