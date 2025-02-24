import { IsOptional, IsString, IsNumber, IsInt } from 'class-validator';

export class UserQueryDto {
  @IsOptional()
  @IsNumber()
  @IsInt()
  user_id?: number;

  @IsOptional()
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
  rating?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  degree_id?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  field_id?: number;

  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsString()
  employment_status?: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  referral_count?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  hours_completed?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  cause_id?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  event_type_id?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  skill_id?: number;

  // Pagination parameters
  @IsOptional()
  @IsNumber()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  limit?: number;
}
