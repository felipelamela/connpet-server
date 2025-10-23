import { IsString, IsUUID, IsOptional, MaxLength } from 'class-validator';

export class CreateResultExamDto {
  @IsUUID()
  examId: string;

  @IsOptional()
  @IsUUID()
  IssuedByVetId?: string;

  @IsOptional()
  @IsUUID()
  clinicId?: string;

  @IsString()
  @MaxLength(255)
  fileUrl: string;

  @IsOptional()
  @IsString()
  comments?: string;
}
