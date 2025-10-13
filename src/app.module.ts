import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ClinicVetModule } from './clinic-vet/clinic-vet.module';
import { PlansModule } from './plans/plans.module';
import { ConfigModule } from '@nestjs/config';
import { AddressModule } from './address/address.module';
import { PaymentsModule } from './payments/payments.module';
import { PetModule } from './pet/pet.module';
import { TutorModule } from './tutor/tutor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ClinicVetUserModule } from './clinic-vet/modules/clinic-vet-user/clinic-vet-user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    PrismaModule,
    ClinicVetModule,
    PlansModule,
    AddressModule,
    PaymentsModule,
    PetModule,
    TutorModule,
    AppointmentModule,
    ClinicVetUserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
