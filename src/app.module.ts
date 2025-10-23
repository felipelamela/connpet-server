import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './commom/prisma/prisma.module';
import { MetricsModule } from './commom/services/metrics.module';
import { MetricsInterceptor } from './commom/interceptors/metrics.interceptor';
import { ClinicVetModule } from './clinic-vet/clinic-vet.module';
import { PlansModule } from './plans/plans.module';
import { ConfigModule } from '@nestjs/config';
import { AddressModule } from './address/address.module';
import { PaymentsModule } from './payments/payments.module';
import { TutorModule } from './tutor/tutor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ClinicVetUserModule } from './clinic-vet/modules/clinic-vet-user/clinic-vet-user.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './commom/guardians/jwt-auth.guardian';
import { ExamModule } from './exam/exam.module';
import { InternationModule } from './internation/internation.module';
import { SecurityModule } from './security/security.module';
import { DDoSExceptionFilter } from './commom/filters/ddos-exception.filter';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MetricsModule, // Módulo de métricas do Prometheus
    SecurityModule, // Módulo de segurança e proteção DDoS
    AuthModule,
    PrismaModule,
    ClinicVetModule,
    PlansModule,
    AddressModule,
    PaymentsModule,
    TutorModule,
    AppointmentModule,
    ClinicVetUserModule,
    ExamModule,
    InternationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: DDoSExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class AppModule {}
