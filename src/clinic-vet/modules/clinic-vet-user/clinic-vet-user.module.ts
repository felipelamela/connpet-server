import { Module } from '@nestjs/common';
import { ClinicVetUserService } from './clinic-vet-user.service';
import { ClinicVetUserController } from './clinic-vet-user.controller';
import { UserModule } from '../../../user/user.module';
import { UserService } from '../../../user/user.service';

@Module({
  imports: [UserModule],
  controllers: [ClinicVetUserController],
  providers: [ClinicVetUserService, UserService],
  exports: [ClinicVetUserService, UserService]
})
export class ClinicVetUserModule { }
