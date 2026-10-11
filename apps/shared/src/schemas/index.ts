import { z } from 'zod';

export const backendRequestSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  path: z.string().min(1),
  body: z.unknown().optional(),
});

export type BackendRequestInput = z.infer<typeof backendRequestSchema>;

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const bootstrapAdminSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().optional().or(z.literal('')),
  fullName: z.string().min(1).max(100),
  password: z.string().min(8).max(72),
});

export type BootstrapAdminInput = z.infer<typeof bootstrapAdminSchema>;

export const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().optional().or(z.literal('')),
  fullName: z.string().min(1).max(100),
  password: z.string().min(8).max(72),
  roleId: z.string().min(1),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().optional().or(z.literal('')),
  fullName: z.string().min(1).max(100),
  password: z.string().min(8).max(72).optional().or(z.literal('')),
  roleId: z.string().min(1),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const createRoleSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional().or(z.literal('')),
  permissionKeys: z.array(z.string()),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

export const updateRolePermissionsSchema = z.object({
  permissionKeys: z.array(z.string()),
});

export type UpdateRolePermissionsInput = z.infer<typeof updateRolePermissionsSchema>;

export const createDepartmentSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(300).optional().or(z.literal('')),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;

export const updateDepartmentSchema = createDepartmentSchema;

export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;

export const employeeFormSchema = z.object({
  fullName: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  jobTitle: z.string().max(100).optional().or(z.literal('')),
  hireDate: z.string().min(1),
  notes: z.string().max(500).optional().or(z.literal('')),
  departmentId: z.string().optional().or(z.literal('')),
});

export type EmployeeFormInput = z.infer<typeof employeeFormSchema>;

export const checkInSchema = z.object({
  employeeId: z.string().min(1),
});

export type CheckInInput = z.infer<typeof checkInSchema>;

export const leaveTypeSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional().or(z.literal('')),
});

export type LeaveTypeInput = z.infer<typeof leaveTypeSchema>;

export const createLeaveSchema = z.object({
  employeeId: z.string().min(1),
  leaveTypeId: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  reason: z.string().max(500).optional().or(z.literal('')),
});

export type CreateLeaveInput = z.infer<typeof createLeaveSchema>;

export const updateLeaveStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
});

export type UpdateLeaveStatusInput = z.infer<typeof updateLeaveStatusSchema>;

export const holidaySchema = z.object({
  name: z.string().min(2).max(100),
  date: z.string().min(1),
  description: z.string().max(200).optional().or(z.literal('')),
});

export type HolidayInput = z.infer<typeof holidaySchema>;

export const updateSettingsSchema = z.object({
  companyName: z.string().max(150).optional().or(z.literal('')),
  defaultWorkStartTime: z.string().max(5).optional().or(z.literal('')),
  defaultWorkEndTime: z.string().max(5).optional().or(z.literal('')),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
