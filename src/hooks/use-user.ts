import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/lib/auth/client';

// API functions
async function fetchCurrentUser() {
  const response = await fetch('/api/users/me');
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

async function updateUser(data: { name?: string; email?: string }) {
  const response = await fetch('/api/users/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  
  return response.json();
}

// Query hooks
export function useCurrentUser() {
  const { data: session } = useSession();
  
  return useQuery({
    queryKey: ['user', 'current'],
    queryFn: fetchCurrentUser,
    enabled: !!session,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'current'] });
    },
  });
}

