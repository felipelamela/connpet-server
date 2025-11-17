import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminRepository } from './admin.repository';
import { AdminHandlers } from './admin.handlers';
import { UserService } from 'src/services/user/user.service';
import { ServiceService } from 'src/services/service/service.service';
import { ProductService } from 'src/services/product/product.service';
import { ClinicVetUserModule } from './admin-users/clinic-vet-user.module';
import { PetModule } from 'src/pet/pet.module';
import { PaymentsService } from 'src/services/payments/payments.service';

@Module({
  imports: [ClinicVetUserModule, PetModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminRepository,
    AdminHandlers,
    ServiceService,
    ProductService,
    UserService,
    PaymentsService,
  ],
})
export class AdminModule {}
