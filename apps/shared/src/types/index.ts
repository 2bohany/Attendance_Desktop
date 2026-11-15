export type AppInfo = {
  name: string;
  version: string;
  environment: string;
};

export type DatabaseInfo = {
  path: string;
  exists: boolean;
  initialized: boolean;
};

export type HealthCheckResponse = {
  status: 'ok' | 'error';
  timestamp: string;
  database: {
    connected: boolean;
  };
};

export type IpcChannel =
  | 'app:get-info'
  | 'app:get-database-info'
  | 'backend:request'
  | 'auth:set-token'
  | 'auth:clear-token';

export type BackendRequest = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
};

export type BackendResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
};

export type ThemeMode = 'light' | 'dark' | 'system';

export type Direction = 'ltr' | 'rtl';

export type Locale = 'en' | 'ar';

export type Permission = {
  id: string;
  key: string;
  description: string | null;
};

export type Role = {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: Permission[];
};

export type AuthUser = {
  id: string;
  username: string;
  email: string | null;
  fullName: string;
  isActive: boolean;
  role: Role;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type SetupStatusResponse = {
  needsSetup: boolean;
};

export type UserListItem = {
  id: string;
  username: string;
  email: string | null;
  fullName: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  role: {
    id: string;
    name: string;
  };
};

export type Department = {
  id: string;
  name: string;
  description: string | null;
  employeeCount: number;
};

export type Employee = {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  jobTitle: string | null;
  hireDate: string;
  isActive: boolean;
  notes: string | null;
  department: { id: string; name: string } | null;
};

export type AttendanceStatus = 'PRESENT' | 'INCOMPLETE' | 'ABSENT';

export type AttendanceRecord = {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  notes: string | null;
  status: AttendanceStatus;
  employee: { id: string; employeeCode: string; fullName: string };
};

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type LeaveType = {
  id: string;
  name: string;
  description: string | null;
};

export type Leave = {
  id: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  status: LeaveStatus;
  createdAt: string;
  employee: { id: string; employeeCode: string; fullName: string };
  leaveType: { id: string; name: string };
};

export type Holiday = {
  id: string;
  name: string;
  date: string;
  description: string | null;
};

export type ReportsSummary = {
  totalEmployees: number;
  activeEmployees: number;
  presentToday: number;
  onLeaveToday: number;
  upcomingHolidays: Holiday[];
  employeesByDepartment: { department: string; count: number }[];
};

export type AppSettings = {
  companyName: string;
  defaultWorkStartTime: string;
  defaultWorkEndTime: string;
};

export type BackupFile = {
  fileName: string;
  sizeBytes: number;
  createdAt: string;
};

export type BackupExport = {
  format: 'attendance-backup';
  version: number;
  exportedAt: string;
  fileName: string;
  sizeBytes: number;
  data: Record<string, unknown[]>;
};
