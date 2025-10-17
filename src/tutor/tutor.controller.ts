import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TutorService } from './tutor.service';
import { CreateTutorDTO } from './dto/create-tutor.dto';
import { SuccessResponse } from '../commom/response/successResponse';
import { ErrorResponse } from '../commom/response/errorResponse';
import { CreateTutorWithPetDto } from './dto/create-tutor-with-pet.dto';

@Controller('tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Post()
  async create(@Body() createTutorDto: CreateTutorDTO) {
    try {
      const tutor = await this.tutorService.create(createTutorDto);
      return new SuccessResponse('Tutor criado com sucesso', tutor);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Post('with-pet')
  async createTutorWithPet(@Body() createTutorWithPet: CreateTutorWithPetDto) {
    try {
      const tutor =
        await this.tutorService.createTutorWithPet(createTutorWithPet);
      return new SuccessResponse('Tutor criado com sucesso', tutor);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const tutor = await this.tutorService.findOne(id);
      return new SuccessResponse('Tutor criado com sucesso', tutor);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }
}
