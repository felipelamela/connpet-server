import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClinicVetUserService } from './clinic-vet-user.service';
import { CreateClinicVetUserDto } from './dto/create-clinic-vet-user.dto';
import { UpdateClinicVetUserDto } from './dto/update-clinic-vet-user.dto';

@Controller('clinic-vet-user')
export class ClinicVetUserController {
  constructor(private readonly clinicVetUserService: ClinicVetUserService) {}

  @Post()
  create(@Body() createClinicVetUserDto: CreateClinicVetUserDto) {
    return this.clinicVetUserService.create(createClinicVetUserDto);
  }

  @Get()
  findAll() {
    return this.clinicVetUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clinicVetUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClinicVetUserDto: UpdateClinicVetUserDto) {
    return this.clinicVetUserService.update(+id, updateClinicVetUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clinicVetUserService.remove(+id);
  }
}
