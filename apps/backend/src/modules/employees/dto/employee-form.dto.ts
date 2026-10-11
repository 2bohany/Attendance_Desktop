import { IsDateString, IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class EmployeeFormDto {
  @IsString()
  @Length(1, 100)
  fullName!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  jobTitle?: string;

  @IsDateString()
  hireDate!: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;
}
