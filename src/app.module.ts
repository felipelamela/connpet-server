import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ClinicVetModule } from './clinic-vet/clinic-vet.module';
import { PlansModule } from './plans/plans.module';
import { ConfigModule } from '@nestjs/config';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
        ConfigModule.forRoot({
      isGlobal: true, // ✅ garante que todas as partes leem o .env
    }),
    AuthModule, PrismaModule,PrismaModule, ClinicVetModule, PlansModule, AddressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
