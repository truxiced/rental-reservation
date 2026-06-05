import { IsOptional, IsString, MaxLength } from "class-validator";

export class ListRentalUnitsQueryDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  search: string | undefined;
}
