import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './database/prisma.module';
import { LoggingModule } from './common/logging/logging.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { LeavesModule } from './modules/leaves/leaves.module';
import { HolidaysModule } from './modules/holidays/holidays.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SettingsModule } from './modules/settings/settings.module';
import { BackupModule } from './modules/backup/backup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    AppConfigModule,
    PrismaModule,
    LoggingModule,
    HealthModule,
    AuthModule,
    UsersModule,
    EmployeesModule,
    AttendanceModule,
    LeavesModule,
    HolidaysModule,
    ReportsModule,
    SettingsModule,
    BackupModule,
  ],
})
export class AppModule {}
