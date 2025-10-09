import { Module } from '@nestjs/common';
import { ClinicVetService } from './clinic-vet.service';
import { ClinicVetController } from './clinic-vet.controller';
import { clinicVetRepository } from './clinic-vet.repository';
import { ClinicVetHandlers } from './clinic-vet.handlers';

@Module({
  controllers: [ClinicVetController],
  providers: [ClinicVetService, clinicVetRepository, ClinicVetHandlers],
})
export class ClinicVetModule {}
