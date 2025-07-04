import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/lib/auth/client';

// Types
interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  plan: string;
  role: string;
  joinedAt: string;
}

interface CreateOrganizationData {
  name: string;
  slug: string;
  description?: string;
}

// API functions
async function fetchUserOrganizations(): Promise<Organization[]> {
  const response = await fetch('/api/organizations');
  if (!response.ok) {
    throw new Error('Failed to fetch organizations');
  }
  return response.json();
}

async function fetchOrganization(id: string) {
  const response = await fetch(`/api/organizations/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch organization');
  }
  return response.json();
}

async function createOrganization(data: CreateOrganizationData) {
  const response = await fetch('/api/organizations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create organization');
  }
  
  return response.json();
}

async function updateOrganization(id: string, data: Partial<CreateOrganizationData>) {
  const response = await fetch(`/api/organizations/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update organization');
  }
  
  return response.json();
}

// Query hooks
export function useUserOrganizations() {
  const { data: session } = useSession();
  
  return useQuery({
    queryKey: ['organizations', 'user'],
    queryFn: fetchUserOrganizations,
    enabled: !!session,
  });
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: () => fetchOrganization(id),
    enabled: !!id,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations', 'user'] });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateOrganizationData> }) =>
      updateOrganization(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['organizations', id] });
      queryClient.invalidateQueries({ queryKey: ['organizations', 'user'] });
    },
  });
}

