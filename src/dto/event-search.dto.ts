import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class EventSearchDto {
  @IsOptional()
  @IsString()
  keyword?: string; // Search keyword for name or description

  @IsOptional()
  @IsNumber()
  eventTypeId?: number; // Filter by event type

  @IsOptional()
  @IsDateString()
  startDate?: string; // Filter by event start date

  @IsOptional()
  @IsDateString()
  endDate?: string; // Filter by event end date

  @IsOptional()
  @IsNumber()
  page?: number; // Pagination: page number

  @IsOptional()
  @IsNumber()
  limit?: number; // Pagination: number of items per page
}
