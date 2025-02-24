import { IsOptional, IsString, IsNumber, IsInt } from 'class-validator';

export class EventSearchDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumber()
  eventTypeId?: number;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsInt()
  page?: number; // Ensure this is an integer

  @IsOptional()
  @IsInt()
  limit?: number; // Ensure this is an integer
}
