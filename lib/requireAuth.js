import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth';

export function getAuthPayload() {
  const cookieStore = cookies();
  const token = cookieStore.get('yutira_token')?.value;
  if (!token) return null;
  try {
    return verifyJwt(token);
  } catch {
    return null;
  }
}

export function requireAuth() {
  const payload = getAuthPayload();
  if (!payload) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
  return payload;
}

export function requireAdmin() {
  const payload = requireAuth();
  if (payload.role !== 'admin') {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  return payload;
}
