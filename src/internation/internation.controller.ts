import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InternationService } from './internation.service';
import { CreateInternationDto } from './dto/create-internation.dto';
import { UpdateInternationDto } from './dto/update-internation.dto';

@Controller('internation')
export class InternationController {
  constructor(private readonly internationService: InternationService) {}

  @Post()
  create(@Body() createInternationDto: CreateInternationDto) {
    return this.internationService.create(createInternationDto);
  }

  @Get()
  findAll() {
    return this.internationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.internationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInternationDto: UpdateInternationDto) {
    return this.internationService.update(+id, updateInternationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.internationService.remove(+id);
  }
}
