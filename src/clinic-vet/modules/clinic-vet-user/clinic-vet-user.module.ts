import { Module } from '@nestjs/common';
import { ClinicVetUserService } from './clinic-vet-user.service';
import { ClinicVetUserController } from './clinic-vet-user.controller';

@Module({
  controllers: [ClinicVetUserController],
  providers: [ClinicVetUserService],
})
export class ClinicVetUserModule {}
