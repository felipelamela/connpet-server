import { IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum GroomingItemType {
  SERVICE = 'SERVICE',
  PRODUCT = 'PRODUCT',
}

export class AddGroomingItemDto {
  @ApiProperty({
    description: 'Tipo do item (SERVICE ou PRODUCT)',
    enum: GroomingItemType,
    example: GroomingItemType.SERVICE,
  })
  @IsEnum(GroomingItemType, {
    message: 'type deve ser SERVICE ou PRODUCT',
  })
  type: GroomingItemType;

  @ApiProperty({
    description: 'ID do item (serviço ou produto)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(undefined, { message: 'itemId deve ser um UUID válido' })
  itemId: string;
}

