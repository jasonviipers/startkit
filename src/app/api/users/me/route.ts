import { NextRequest, NextResponse } from 'next/server';
import { requireAuthFromHeaders } from '@/lib/auth/utils';
import { getUserById, updateUser } from '@/lib/db/queries';

export async function GET() {
  try {
    const authUser = await requireAuthFromHeaders();
    const user = await getUserById(authUser.id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authUser = await requireAuthFromHeaders();
    const body = await request.json();
    
    const { name, email } = body;
    
    const updatedUser = await updateUser(authUser.id, {
      name,
      email,
      updatedAt: new Date(),
    });
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

