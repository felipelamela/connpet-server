import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { CreateTutorDTO } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';

@Controller('tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) { }

  @Post()
  create(@Body() createTutorDto: CreateTutorDTO) {
    return this.tutorService.create(createTutorDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tutorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTutorDto: UpdateTutorDto) {
    return this.tutorService.update(+id, updateTutorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tutorService.remove(+id);
  }
}
