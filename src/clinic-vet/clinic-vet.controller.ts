import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClinicVetService } from './clinic-vet.service';
import { CreateClinicVetDto } from './dto/create-clinic-vet.dto';
import { UpdateClinicVetDto } from './dto/update-clinic-vet.dto';

@Controller('clinic-vet')
export class ClinicVetController {
  constructor(private readonly clinicVetService: ClinicVetService) {}

  @Post()
  create(@Body() createClinicVetDto: CreateClinicVetDto) {
    return this.clinicVetService.create(createClinicVetDto);
  }

  @Get()
  findAll() {
    return this.clinicVetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clinicVetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClinicVetDto: UpdateClinicVetDto) {
    return this.clinicVetService.update(+id, updateClinicVetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clinicVetService.remove(+id);
  }
}
