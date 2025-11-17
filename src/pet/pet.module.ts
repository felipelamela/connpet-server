import { Global, Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import PetHandler from './pet.handlers';
import PetRepository from './pet.repository';

@Global()
@Module({
  controllers: [PetController],
  providers: [PetService, PetHandler, PetRepository],
  exports: [PetService, PetHandler, PetRepository],
})
export class PetModule {}
