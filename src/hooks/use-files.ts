import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
interface FileRecord {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  key: string;
  url: string;
  userId?: string;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

interface UploadFileData {
  file: File;
  organizationId?: string;
}

// API functions
async function fetchUserFiles(): Promise<FileRecord[]> {
  const response = await fetch('/api/files/user');
  if (!response.ok) {
    throw new Error('Failed to fetch user files');
  }
  return response.json();
}

async function fetchOrganizationFiles(organizationId: string): Promise<FileRecord[]> {
  const response = await fetch(`/api/files/organization/${organizationId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch organization files');
  }
  return response.json();
}

async function uploadFile(data: UploadFileData): Promise<FileRecord> {
  const formData = new FormData();
  formData.append('file', data.file);
  if (data.organizationId) {
    formData.append('organizationId', data.organizationId);
  }

  const response = await fetch('/api/files/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  return response.json();
}

async function deleteFile(id: string): Promise<void> {
  const response = await fetch(`/api/files/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete file');
  }
}

async function getPresignedUploadUrl(data: {
  fileName: string;
  contentType: string;
  organizationId?: string;
}): Promise<{ uploadUrl: string; key: string }> {
  const response = await fetch('/api/files/presigned-upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to get presigned upload URL');
  }

  return response.json();
}

async function getPresignedDownloadUrl(key: string): Promise<{ downloadUrl: string }> {
  const response = await fetch(`/api/files/presigned-download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ key }),
  });

  if (!response.ok) {
    throw new Error('Failed to get presigned download URL');
  }

  return response.json();
}

// Query hooks
export function useUserFiles() {
  return useQuery({
    queryKey: ['files', 'user'],
    queryFn: fetchUserFiles,
  });
}

export function useOrganizationFiles(organizationId: string) {
  return useQuery({
    queryKey: ['files', 'organization', organizationId],
    queryFn: () => fetchOrganizationFiles(organizationId),
    enabled: !!organizationId,
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadFile,
    onSuccess: (file) => {
      queryClient.invalidateQueries({ queryKey: ['files', 'user'] });
      if (file.organizationId) {
        queryClient.invalidateQueries({ 
          queryKey: ['files', 'organization', file.organizationId] 
        });
      }
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function usePresignedUploadUrl() {
  return useMutation({
    mutationFn: getPresignedUploadUrl,
  });
}

export function usePresignedDownloadUrl() {
  return useMutation({
    mutationFn: getPresignedDownloadUrl,
  });
}

