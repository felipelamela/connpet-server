import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { SuccessResponse } from '../common/response/successResponse';
import { ErrorResponse } from '../common/response/errorResponse';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { JwtPayload } from 'src/auth/entities/jwt-payload.entity';

@ApiTags('pets')
@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @ApiOperation({ summary: 'Criar novo pet' })
  @ApiResponse({ status: 201, description: 'Pet criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Post()
  async create(
    @Body() createPetDto: CreatePetDto,
    @CurrentUser() user: JwtPayload,
  ) {
    try {
      const pet = await this.petService.create(
        createPetDto,
        user?.panelId || null,
      );
      return new SuccessResponse('Pet criado com sucesso', pet);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Buscar pets por CPF do tutor' })
  @ApiResponse({ status: 200, description: 'Pets encontrados' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Get('tutor/document')
  async findByTutorDocument(
    @Query('document') document: string,
    @CurrentUser() user: JwtPayload,
  ) {
    try {
      const pets = await this.petService.findByTutorDocument(
        document,
        user?.panelId || null,
      );
      return new SuccessResponse('Pets encontrados com sucesso', pets);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Buscar pet por ID' })
  @ApiResponse({ status: 200, description: 'Pet encontrado' })
  @ApiResponse({ status: 404, description: 'Pet não encontrado' })
  @ApiParam({ name: 'id', description: 'ID do pet' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const pet = await this.petService.findOne(id);
      return new SuccessResponse('Pet encontrado com sucesso', pet);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }
}
