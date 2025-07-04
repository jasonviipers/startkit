import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
}

interface CreateProjectData {
  name: string;
  description?: string;
  organizationId: string;
}

// API functions
async function fetchOrganizationProjects(organizationId: string): Promise<Project[]> {
  const response = await fetch(`/api/organizations/${organizationId}/projects`);
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
}

async function fetchProject(id: string): Promise<Project> {
  const response = await fetch(`/api/projects/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch project');
  }
  return response.json();
}

async function createProject(data: CreateProjectData): Promise<Project> {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create project');
  }
  
  return response.json();
}

async function updateProject(id: string, data: Partial<CreateProjectData>): Promise<Project> {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update project');
  }
  
  return response.json();
}

async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete project');
  }
}

// Query hooks
export function useOrganizationProjects(organizationId: string) {
  return useQuery({
    queryKey: ['projects', 'organization', organizationId],
    queryFn: () => fetchOrganizationProjects(organizationId),
    enabled: !!organizationId,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => fetchProject(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProject,
    onSuccess: (project) => {
      queryClient.invalidateQueries({ 
        queryKey: ['projects', 'organization', project.organizationId] 
      });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProjectData> }) =>
      updateProject(id, data),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects', project.id] });
      queryClient.invalidateQueries({ 
        queryKey: ['projects', 'organization', project.organizationId] 
      });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.removeQueries({ queryKey: ['projects', id] });
    },
  });
}

