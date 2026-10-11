import { SetMetadata } from '@nestjs/common';
import type { PermissionKey } from '@attendance/config';

export const PERMISSIONS_KEY = 'permissions';

export const RequirePermissions = (...permissions: PermissionKey[]): ReturnType<typeof SetMetadata> =>
  SetMetadata(PERMISSIONS_KEY, permissions);
