import { Injectable } from '@nestjs/common';
import { CreateInternationDto } from './dto/create-internation.dto';
import { UpdateInternationDto } from './dto/update-internation.dto';

@Injectable()
export class InternationService {
  create(createInternationDto: CreateInternationDto) {
    return 'This action adds a new internation';
  }

  findAll() {
    return `This action returns all internation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} internation`;
  }

  update(id: number, updateInternationDto: UpdateInternationDto) {
    return `This action updates a #${id} internation`;
  }

  remove(id: number) {
    return `This action removes a #${id} internation`;
  }
}
