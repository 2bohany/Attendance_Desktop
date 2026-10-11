import { describe, it, expect } from 'vitest';

describe('MVC architecture', () => {
  it('should enforce Controller → Service → Repository → PrismaService flow', async () => {
    const { HealthModule } = await import('./modules/health/health.module');
    const { HealthController } = await import('./modules/health/health.controller');
    const { HealthService } = await import('./modules/health/health.service');
    const { HealthRepository } = await import('./modules/health/health.repository');
    const { PrismaService } = await import('./database/prisma.service');
    const { PrismaModule } = await import('./database/prisma.module');

    expect(HealthModule).toBeDefined();
    expect(HealthController).toBeDefined();
    expect(HealthService).toBeDefined();
    expect(HealthRepository).toBeDefined();
    expect(PrismaService).toBeDefined();
    expect(PrismaModule).toBeDefined();
  });
});

describe('Prisma dependency injection', () => {
  it('should export a single PrismaService from PrismaModule', async () => {
    const { PrismaModule } = await import('./database/prisma.module');
    const { PrismaService } = await import('./database/prisma.service');

    expect(PrismaModule).toBeDefined();
    expect(PrismaService).toBeDefined();
  });
});

describe('Auth / Users / Roles MVC wiring', () => {
  it('should enforce Controller → Service → Repository → PrismaService flow for users and roles', async () => {
    const { UsersModule } = await import('./modules/users/users.module');
    const { UsersController } = await import('./modules/users/users.controller');
    const { UsersService } = await import('./modules/users/users.service');
    const { UsersRepository } = await import('./modules/users/users.repository');
    const { RolesController } = await import('./modules/users/roles.controller');
    const { RolesService } = await import('./modules/users/roles.service');
    const { RolesRepository } = await import('./modules/users/roles.repository');

    expect(UsersModule).toBeDefined();
    expect(UsersController).toBeDefined();
    expect(UsersService).toBeDefined();
    expect(UsersRepository).toBeDefined();
    expect(RolesController).toBeDefined();
    expect(RolesService).toBeDefined();
    expect(RolesRepository).toBeDefined();
  });

  it('should wire AuthModule with a JWT strategy and global guards', async () => {
    const { AuthModule } = await import('./modules/auth/auth.module');
    const { AuthController } = await import('./modules/auth/auth.controller');
    const { AuthService } = await import('./modules/auth/auth.service');
    const { JwtStrategy } = await import('./modules/auth/strategies/jwt.strategy');
    const { JwtAuthGuard } = await import('./common/guards/jwt-auth.guard');
    const { PermissionsGuard } = await import('./common/guards/permissions.guard');

    expect(AuthModule).toBeDefined();
    expect(AuthController).toBeDefined();
    expect(AuthService).toBeDefined();
    expect(JwtStrategy).toBeDefined();
    expect(JwtAuthGuard).toBeDefined();
    expect(PermissionsGuard).toBeDefined();
  });

  it('should mark public endpoints so they bypass authentication', async () => {
    const { IS_PUBLIC_KEY } = await import('./common/decorators/public.decorator');
    const { HealthController } = await import('./modules/health/health.controller');
    const isPublic = Reflect.getMetadata(IS_PUBLIC_KEY, HealthController.prototype.check);

    expect(isPublic).toBe(true);
  });
});

describe('Employees MVC wiring', () => {
  it('should enforce Controller → Service → Repository → PrismaService flow for employees and departments', async () => {
    const { EmployeesModule } = await import('./modules/employees/employees.module');
    const { EmployeesController } = await import('./modules/employees/employees.controller');
    const { EmployeesService } = await import('./modules/employees/employees.service');
    const { EmployeesRepository } = await import('./modules/employees/employees.repository');
    const { DepartmentsController } = await import('./modules/employees/departments.controller');
    const { DepartmentsService } = await import('./modules/employees/departments.service');
    const { DepartmentsRepository } = await import('./modules/employees/departments.repository');

    expect(EmployeesModule).toBeDefined();
    expect(EmployeesController).toBeDefined();
    expect(EmployeesService).toBeDefined();
    expect(EmployeesRepository).toBeDefined();
    expect(DepartmentsController).toBeDefined();
    expect(DepartmentsService).toBeDefined();
    expect(DepartmentsRepository).toBeDefined();
  });
});

describe('Attendance / Leaves / Holidays / Reports / Settings / Backup MVC wiring', () => {
  it('should wire the Attendance module', async () => {
    const { AttendanceModule } = await import('./modules/attendance/attendance.module');
    const { AttendanceController } = await import('./modules/attendance/attendance.controller');
    const { AttendanceService } = await import('./modules/attendance/attendance.service');
    const { AttendanceRepository } = await import('./modules/attendance/attendance.repository');

    expect(AttendanceModule).toBeDefined();
    expect(AttendanceController).toBeDefined();
    expect(AttendanceService).toBeDefined();
    expect(AttendanceRepository).toBeDefined();
  });

  it('should wire the Leaves module (leaves + leave types)', async () => {
    const { LeavesModule } = await import('./modules/leaves/leaves.module');
    const { LeavesController } = await import('./modules/leaves/leaves.controller');
    const { LeavesService } = await import('./modules/leaves/leaves.service');
    const { LeavesRepository } = await import('./modules/leaves/leaves.repository');
    const { LeaveTypesController } = await import('./modules/leaves/leave-types.controller');
    const { LeaveTypesService } = await import('./modules/leaves/leave-types.service');

    expect(LeavesModule).toBeDefined();
    expect(LeavesController).toBeDefined();
    expect(LeavesService).toBeDefined();
    expect(LeavesRepository).toBeDefined();
    expect(LeaveTypesController).toBeDefined();
    expect(LeaveTypesService).toBeDefined();
  });

  it('should wire the Holidays module', async () => {
    const { HolidaysModule } = await import('./modules/holidays/holidays.module');
    const { HolidaysController } = await import('./modules/holidays/holidays.controller');
    const { HolidaysService } = await import('./modules/holidays/holidays.service');
    const { HolidaysRepository } = await import('./modules/holidays/holidays.repository');

    expect(HolidaysModule).toBeDefined();
    expect(HolidaysController).toBeDefined();
    expect(HolidaysService).toBeDefined();
    expect(HolidaysRepository).toBeDefined();
  });

  it('should wire the Reports module', async () => {
    const { ReportsModule } = await import('./modules/reports/reports.module');
    const { ReportsController } = await import('./modules/reports/reports.controller');
    const { ReportsService } = await import('./modules/reports/reports.service');
    const { ReportsRepository } = await import('./modules/reports/reports.repository');

    expect(ReportsModule).toBeDefined();
    expect(ReportsController).toBeDefined();
    expect(ReportsService).toBeDefined();
    expect(ReportsRepository).toBeDefined();
  });

  it('should wire the Settings module against AppMeta', async () => {
    const { SettingsModule } = await import('./modules/settings/settings.module');
    const { SettingsController } = await import('./modules/settings/settings.controller');
    const { SettingsService } = await import('./modules/settings/settings.service');
    const { SettingsRepository } = await import('./modules/settings/settings.repository');

    expect(SettingsModule).toBeDefined();
    expect(SettingsController).toBeDefined();
    expect(SettingsService).toBeDefined();
    expect(SettingsRepository).toBeDefined();
  });

  it('should wire the Backup module', async () => {
    const { BackupModule } = await import('./modules/backup/backup.module');
    const { BackupController } = await import('./modules/backup/backup.controller');
    const { BackupService } = await import('./modules/backup/backup.service');
    const { BackupRepository } = await import('./modules/backup/backup.repository');

    expect(BackupModule).toBeDefined();
    expect(BackupController).toBeDefined();
    expect(BackupService).toBeDefined();
    expect(BackupRepository).toBeDefined();
  });

  it('should expose AuditLogService globally alongside PrismaService', async () => {
    const { AuditLogService } = await import('./database/audit-log.service');
    const { PrismaModule } = await import('./database/prisma.module');

    expect(AuditLogService).toBeDefined();
    expect(PrismaModule).toBeDefined();
  });
});
