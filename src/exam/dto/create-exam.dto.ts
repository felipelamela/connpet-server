import { IsString, IsUUID, IsDateString, IsOptional } from 'class-validator';

export class CreateExamDto {
  @IsUUID()
  petId: string;

  @IsOptional()
  @IsUUID()
  requestedByVetId?: string;

  @IsString()
  name: string;

  @IsDateString()
  examDate: Date;

  @IsOptional()
  @IsUUID()
  clinicId?: string;

  @IsOptional()
  @IsString()
  comments?: string;
}
