import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClinicVetUserService } from './clinic-vet-user.service';
import { CreateClinicVetUserDto } from './dto/create-clinic-vet-user.dto';
import { UpdateClinicVetUserDto } from './dto/update-clinic-vet-user.dto';

@Controller('clinic-vet-user')
export class ClinicVetUserController {
  constructor(private readonly clinicVetUserService: ClinicVetUserService) { }

  @Post()
  create(@Body() createClinicVetUserDto: CreateClinicVetUserDto) {
    return this.clinicVetUserService.create(createClinicVetUserDto);
  }
}
