import { Module } from '@nestjs/common';
import { ClinicVetUserService } from './clinic-vet-user.service';
import { ClinicVetUserController } from './clinic-vet-user.controller';
import { UserService } from 'src/services/user/user.service';
import { AddressService } from 'src/services/address/address.service';
import ClinicVetUserRepository from './clinic-vet-user.respository';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClinicVetUserController],
  providers: [ClinicVetUserService, UserService, AddressService, ClinicVetUserRepository],
  exports: [ClinicVetUserService, UserService],
})
export class ClinicVetUserModule {}
