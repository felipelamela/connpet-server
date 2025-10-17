import { Module } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { TutorController } from './tutor.controller';
import TutorRepository from './tutor.repository';
import { AddressModule } from '../address/address.module';
import { UserModule } from '../user/user.module';
import { PetService } from '../pet/pet.service';
import { PetModule } from '../pet/pet.module';

@Module({
  imports: [AddressModule, UserModule, PetModule],
  controllers: [TutorController],
  providers: [TutorService, TutorRepository, PetService],
})
export class TutorModule {}
