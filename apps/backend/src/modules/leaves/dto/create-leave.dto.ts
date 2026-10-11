import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateLeaveDto {
  @IsString()
  employeeId!: string;

  @IsString()
  leaveTypeId!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  reason?: string;
}
