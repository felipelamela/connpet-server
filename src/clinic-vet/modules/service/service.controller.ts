import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ErrorResponse } from '../../../commom/response/errorResponse';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) { }

  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    try {
      return await this.serviceService.create(createServiceDto);

    } catch (error) {
      throw new ErrorResponse(error)
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.serviceService.findAll();

    } catch (error) {
      throw new ErrorResponse(error)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.serviceService.findOne(+id);

    } catch (error) {
      throw new ErrorResponse(error)
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    try {
      return await this.serviceService.update(+id, updateServiceDto);

    } catch (error) {
      throw new ErrorResponse(error)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.serviceService.remove(+id);

    } catch (error) {
      throw new ErrorResponse(error)
    }
  }
}
