import { NextRequest, NextResponse } from 'next/server';
import { requireAuthFromHeaders } from '@/lib/auth/utils';
import { uploadFile, validateFile } from '@/lib/r2/utils';
import { createFile } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuthFromHeaders();
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const organizationId = formData.get('organizationId') as string | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Validate file
    const validation = validateFile(file, {
      maxSize: 10 * 1024 * 1024, // 10MB
    });
    
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to R2
    const uploadResult = await uploadFile(buffer, {
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      userId: authUser.id,
      organizationId: organizationId || undefined,
    }, organizationId ? `org-${organizationId}` : `user-${authUser.id}`);
    
    // Save to database
    const fileRecord = await createFile({
      name: file.name.split('.')[0] || 'untitled',
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      key: uploadResult.key,
      url: uploadResult.url,
      userId: authUser.id,
      organizationId: organizationId || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return NextResponse.json(fileRecord, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

