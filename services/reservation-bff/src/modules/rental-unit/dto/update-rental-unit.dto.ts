import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateRentalUnitDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  address?: string;
}
