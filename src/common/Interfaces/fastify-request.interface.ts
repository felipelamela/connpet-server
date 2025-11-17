import { FastifyRequest as OriginalFastifyRequest } from 'fastify';
import { PanelTypeEnum, RoleEnum } from '@prisma/client';

export interface FastifyRequestWithUser extends OriginalFastifyRequest {
  user?: {
    sub: string;
    email: string;
    name: string;
    role: RoleEnum | null;
    companyId?: string | null;
    panelId?: string | null;
    panelType?: PanelTypeEnum | null;
    iat?: number;
    exp?: number;
  };
}
