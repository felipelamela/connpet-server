import { Module } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { TutorController } from './tutor.controller';
import TutorRepository from './tutor.repository';
import { AddressModule } from '../address/address.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AddressModule, UserModule],
  controllers: [TutorController],
  providers: [TutorService, TutorRepository],
})
export class TutorModule { }
