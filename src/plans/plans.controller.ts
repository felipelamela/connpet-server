import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { ErrorResponse } from '../commom/response/errorResponse';
import { ErrorEnum } from '../commom/enum/error.enum';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) { }

  @Post()
  async create(@Body() createPlanDto: CreatePlanDto) {
    try {
      return await this.plansService.create(createPlanDto);
    } catch (error) {
      return new ErrorResponse(error)
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.plansService.findAll();
    } catch (error) {
      return new ErrorResponse(error)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.plansService.findOne(id);
    } catch (error) {
      return new ErrorResponse(error)
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    try {
      return await this.plansService.update(id, updatePlanDto);
    } catch (error) {
      return new ErrorResponse(error)
    }
  }

  @Put('change-status/:id')
  async remove(@Param('id') id: string) {
    try {
      return await this.plansService.changeStatus(id, false);
    } catch (error) {
      return new ErrorResponse(error)
    }
  }
}
