import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRentalUnitDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  address?: string;
}
