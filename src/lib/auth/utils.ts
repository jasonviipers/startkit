import { headers } from 'next/headers';
import { auth } from './config';
import { getUserById } from '../db/queries';

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return null;
    }

    // Get full user data from database
    const user = await getUserById(session.user.id);
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
}

export async function getUserFromHeaders() {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  const userEmail = headersList.get('x-user-email');

  if (!userId || !userEmail) {
    return null;
  }

  return {
    id: userId,
    email: userEmail,
  };
}

export async function requireAuthFromHeaders() {
  const user = await getUserFromHeaders();

  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
}

