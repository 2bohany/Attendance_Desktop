import { IsArray, IsOptional, IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @Length(2, 50)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  description?: string;

  @IsArray()
  @IsString({ each: true })
  permissionKeys!: string[];
}
