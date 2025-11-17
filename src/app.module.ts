import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { MetricsModule } from './common/services/metrics.module';
import { AdminModule } from './admin/admin.module';
import { PlansModule } from './plans/plans.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule } from './payments/payments.module';
import { TutorModule } from './tutor/tutor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { GroomingModule } from './grooming/grooming.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './common/guardians/jwt-auth.guardian';
import { ExamModule } from './exam/exam.module';
import { InternationModule } from './internation/internation.module';
import { SecurityModule } from './security/security.module';
import { DDoSExceptionFilter } from './common/filters/ddos-exception.filter';
import { MetricsInterceptor } from './common/interceptors/metrics.interceptor';

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
    AdminModule,
    PlansModule,
    PaymentsModule,
    TutorModule,
    AppointmentModule,
    GroomingModule,
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
