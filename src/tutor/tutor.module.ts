import { Module } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { TutorController } from './tutor.controller';
import TutorRepository from './tutor.repository';
import { PetService } from '../pet/pet.service';
import { PetModule } from '../pet/pet.module';
import { AddressService } from 'src/services/address/address.service';
import { UserService } from 'src/services/user/user.service';
import PetRepository from 'src/pet/pet.repository';

@Module({
  imports: [PetModule],
  controllers: [TutorController],
  providers: [
    TutorService,
    TutorRepository,
    AddressService,
    UserService,
    PetRepository
  ],
})
export class TutorModule {}
