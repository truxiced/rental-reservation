import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { RentalUnitService } from "./rental-unit.service";
import { CreateRentalUnitDto } from "./dto/create-rental-unit.dto";
import { UpdateRentalUnitDto } from "./dto/update-rental-unit.dto";
import { ListRentalUnitsQueryDto } from "./dto/list-rental-units-query.dto";

@Controller("rental-units")
export class RentalUnitController {
  constructor(private readonly rentalUnitService: RentalUnitService) {}

  @Get()
  search(@Query() query: ListRentalUnitsQueryDto) {
    return this.rentalUnitService.search(query.search);
  }

  @Get(":id")
  get(@Param("id", ParseUUIDPipe) id: string) {
    return this.rentalUnitService.get(id);
  }

  @Post()
  create(@Body() dto: CreateRentalUnitDto) {
    return this.rentalUnitService.create(dto);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateRentalUnitDto,
  ) {
    return this.rentalUnitService.update(id, dto);
  }
}
