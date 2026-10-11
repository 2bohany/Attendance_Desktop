import type {
  BootstrapAdminInput,
  LoginInput,
  LoginResponse,
  SetupStatusResponse,
} from '@attendance/shared';
import { apiRequest } from '@/services/api-client';

export async function getSetupStatus(): Promise<SetupStatusResponse> {
  const response = await apiRequest<SetupStatusResponse>({ method: 'GET', path: '/auth/setup-status' });
  if (!response.success || !response.data) {
    throw new Error(response.error ?? 'Failed to check setup status');
  }
  return response.data;
}

export async function bootstrapAdmin(input: BootstrapAdminInput): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>({
    method: 'POST',
    path: '/auth/setup',
    body: { ...input, email: input.email || undefined },
  });
  if (!response.success || !response.data) {
    throw new Error(response.error ?? 'Failed to create administrator account');
  }
  return response.data;
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>({
    method: 'POST',
    path: '/auth/login',
    body: input,
  });
  if (!response.success || !response.data) {
    throw new Error(response.error ?? 'Invalid username or password');
  }
  return response.data;
}
