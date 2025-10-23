import { FastifyRequest as OriginalFastifyRequest } from 'fastify';
import { RoleEnum } from '@prisma/client';

export interface FastifyRequestWithUser extends OriginalFastifyRequest {
  user?: {
    sub: string;
    email: string;
    name: string;
    role: RoleEnum | null;
    companyId?: string | null;
    iat?: number;
    exp?: number;
  };
}