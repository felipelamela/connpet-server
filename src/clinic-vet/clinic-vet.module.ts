import { Module } from '@nestjs/common';
import { ClinicVetService } from './clinic-vet.service';
import { ClinicVetController } from './clinic-vet.controller';
import { clinicVetRepository } from './clinic-vet.repository';
import { ClinicVetHandlers } from './clinic-vet.handlers';
import { ProductModule } from './modules/product/product.module';
import { ServiceModule } from './modules/service/service.module';
import { ClinicVetUserModule } from './modules/clinic-vet-user/clinic-vet-user.module';

@Module({
  imports: [ProductModule, ServiceModule, ClinicVetUserModule],
  controllers: [ClinicVetController],
  providers: [ClinicVetService, clinicVetRepository, ClinicVetHandlers],
})
export class ClinicVetModule { }
