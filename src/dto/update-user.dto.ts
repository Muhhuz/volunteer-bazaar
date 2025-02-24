// src/users/dto/update-user.dto.ts
import { IsOptional, IsString, IsNumber, IsInt } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()  // Optional because the field may not be updated
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  city_id?: number;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  degree_id?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  field_id?: number;
}
