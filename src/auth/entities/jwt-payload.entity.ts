import { PanelTypeEnum, RoleEnum } from '@prisma/client';

export class JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: RoleEnum | null;
  companyId?: string | null;
  panelId?: string | null;
  panelType?: PanelTypeEnum | null;
  panels?: {id:string, type:PanelTypeEnum}[] | null;
  iat?: number;
  exp?: number;
  constructor(partial: Partial<JwtPayload>) {
    Object.assign(this, partial);
  }
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: RoleEnum | null;
    companyId?: string | null;
    panelId?: string | null;
    panelType?: PanelTypeEnum | null;
    panels?: {id:string, type:PanelTypeEnum}[] | null;
  };
}
