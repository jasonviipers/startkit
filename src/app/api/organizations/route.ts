import { NextRequest, NextResponse } from 'next/server';
import { requireAuthFromHeaders } from '@/lib/auth/utils';
import { getUserOrganizations, createOrganization, addUserToOrganization } from '@/lib/db/queries';

export async function GET() {
  try {
    const authUser = await requireAuthFromHeaders();
    const organizations = await getUserOrganizations(authUser.id);
    
    return NextResponse.json(organizations);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuthFromHeaders();
    const body = await request.json();
    
    const { name, slug, description } = body;
    
    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }
    
    // Create organization
    const organization = await createOrganization({
      name,
      slug,
      description,
      plan: 'free',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // Add creator as owner
    await addUserToOrganization({
      organizationId: organization.id,
      userId: authUser.id,
      role: 'owner',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

