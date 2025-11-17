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
import { GroomingService } from './grooming.service';
import { CreateGroomingDto } from './dto/create-grooming.dto';
import { UpdateGroomingDto } from './dto/update-grooming.dto';
import { SuccessResponse } from '../common/response/successResponse';
import { ErrorResponse } from '../common/response/errorResponse';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { JwtPayload } from 'src/auth/entities/jwt-payload.entity';
import { CreateGroomingNoteDto } from './dto/create-grooming-note.dto';
import { AddGroomingItemDto } from './dto/add-grooming-item.dto';

@ApiTags('grooming')
@Controller('grooming')
export class GroomingController {
  constructor(private readonly groomingService: GroomingService) {}

  @ApiOperation({ summary: 'Criar novo grooming' })
  @ApiResponse({ status: 201, description: 'Grooming criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Post()
  async create(
    @Body() createGroomingDto: CreateGroomingDto,
    @CurrentUser() user: JwtPayload,
  ) {
    try {
      const grooming = await this.groomingService.create(createGroomingDto, user);
      return new SuccessResponse('Grooming criado com sucesso', grooming);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Listar todos os groomings' })
  @ApiResponse({ status: 200, description: 'Lista de groomings' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Get()
  async findAll(
    @Query() filters: any,
    @CurrentUser() user: JwtPayload,
  ) {
    try {
      const groomings = await this.groomingService.findAll(
        user?.panelId || null,
        filters,
      );
      return new SuccessResponse(
        'Groomings listados com sucesso',
        groomings,
      );
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Buscar grooming por ID' })
  @ApiResponse({ status: 200, description: 'Grooming encontrado' })
  @ApiResponse({ status: 404, description: 'Grooming não encontrado' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const grooming = await this.groomingService.findOne(id);
      return new SuccessResponse(
        'Grooming encontrado com sucesso',
        grooming,
      );
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Atualizar grooming' })
  @ApiResponse({ status: 200, description: 'Grooming atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Grooming não encontrado' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroomingDto: UpdateGroomingDto,
  ) {
    try {
      const grooming = await this.groomingService.update(id, updateGroomingDto);
      return new SuccessResponse(
        'Grooming atualizado com sucesso',
        grooming,
      );
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Excluir grooming' })
  @ApiResponse({ status: 200, description: 'Grooming excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Grooming não encontrado' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.groomingService.remove(id);
      return new SuccessResponse('Grooming excluído com sucesso', null);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Adicionar item ao grooming' })
  @ApiResponse({ status: 200, description: 'Item adicionado com sucesso' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Post(':id/items')
  async addItem(
    @Param('id') id: string,
    @Body() addGroomingItemDto: AddGroomingItemDto,
  ) {
    try {
      const grooming = await this.groomingService.addItem(id, addGroomingItemDto);
      return new SuccessResponse('Item adicionado com sucesso', grooming);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Remover item do grooming' })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Delete(':id/items/:itemId')
  async removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    try {
      const grooming = await this.groomingService.removeItem(id, itemId);
      return new SuccessResponse('Item removido com sucesso', grooming);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Adicionar nota ao grooming' })
  @ApiResponse({ status: 200, description: 'Nota adicionada com sucesso' })
  @ApiResponse({ status: 404, description: 'Grooming não encontrado' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Post(':id/notes')
  async addNote(
    @Param('id') id: string,
    @Body() createNoteDto: CreateGroomingNoteDto,
    @CurrentUser() user: JwtPayload,
  ) {
    try {
      const note = await this.groomingService.addNote(id, createNoteDto, user);
      return new SuccessResponse('Nota adicionada com sucesso', note);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }
}

