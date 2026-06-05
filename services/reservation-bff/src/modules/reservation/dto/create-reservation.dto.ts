import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'endAfterStart', async: false })
class EndAfterStartConstraint implements ValidatorConstraintInterface {
  validate(endDate: string, args: ValidationArguments): boolean {
    const obj = args.object as CreateReservationDto;
    if (!obj.startDate || !endDate) return true;
    return endDate > obj.startDate;
  }

  defaultMessage(): string {
    return 'endDate must be after startDate';
  }
}

export class CreateReservationDto {
  @IsUUID()
  rentalUnitId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  guestName!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  @Validate(EndAfterStartConstraint)
  endDate!: string;
}
