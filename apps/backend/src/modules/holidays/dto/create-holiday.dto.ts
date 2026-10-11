import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateHolidayDto {
  @IsString()
  @Length(2, 100)
  name!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  description?: string;
}
