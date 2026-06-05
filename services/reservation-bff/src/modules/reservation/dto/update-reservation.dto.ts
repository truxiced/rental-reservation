import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateReservationDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  guestName?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
