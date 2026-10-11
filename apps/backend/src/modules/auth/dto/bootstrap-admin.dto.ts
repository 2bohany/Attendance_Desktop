import { IsEmail, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class BootstrapAdminDto {
  @IsString()
  @Length(3, 50)
  username!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @Length(1, 100)
  fullName!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
