import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  @Length(0, 150)
  companyName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 5)
  defaultWorkStartTime?: string;

  @IsOptional()
  @IsString()
  @Length(0, 5)
  defaultWorkEndTime?: string;
}
