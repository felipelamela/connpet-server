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
import { ClinicVetUserService } from './clinic-vet-user.service';
import { CreateClinicVetUserDto } from './dto/create-clinic-vet-user.dto';
import { UpdateClinicVetUserDto } from './dto/update-clinic-vet-user.dto';
import { SuccessResponse } from '../../common/response/successResponse';
import { ErrorResponse } from '../../common/response/errorResponse';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';

@ApiTags('clinic-vet')
@Controller('clinic-vet-user')
export class ClinicVetUserController {
  constructor(private readonly clinicVetUserService: ClinicVetUserService) {}

  @ApiOperation({ summary: 'Criar novo usuário da clínica' })
  @ApiResponse({
    status: 201,
    description: 'Usuário da clínica criado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  // @ApiBearerAuth('JWT-auth')
  // @ApiCookieAuth('access_token')
  @Post()
  async create(@Body() createClinicVetUserDto: CreateClinicVetUserDto, 
  @CurrentUser('companyId') companyId: string) {
    try {
      const user = await this.clinicVetUserService.create(createClinicVetUserDto, companyId);
      return new SuccessResponse(
        'Usuário da clínica criado com sucesso',
        user,
      );
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Listar todos os usuários da clínica' })
  @ApiResponse({ status: 200, description: 'Lista de usuários da clínica' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Get()
  async findAll(@Query() filters: any) {
    try {
      const users = await this.clinicVetUserService.findAll(filters);
      return new SuccessResponse(
        'Usuários da clínica listados com sucesso',
        users,
      );
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Listar usuários por empresa' })
  @ApiResponse({ status: 200, description: 'Lista de usuários da empresa' })
  @ApiParam({ name: 'companyId', description: 'ID da empresa' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Get('company/:companyId')
  async findByCompanyId(@Param('companyId') companyId: string) {
    try {
      const users = await this.clinicVetUserService.findByCompanyId(companyId);
      return new SuccessResponse(
        'Usuários da empresa listados com sucesso',
        users,
      );
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Buscar usuário da clínica por ID' })
  @ApiResponse({ status: 200, description: 'Usuário da clínica encontrado' })
  @ApiResponse({
    status: 404,
    description: 'Usuário da clínica não encontrado',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.clinicVetUserService.findOne(id);
      return new SuccessResponse(
        'Usuário da clínica encontrado com sucesso',
        user,
      );
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Atualizar usuário da clínica' })
  @ApiResponse({
    status: 200,
    description: 'Usuário da clínica atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário da clínica não encontrado',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateClinicVetUserDto,
  ) {
    try {
      const user = await this.clinicVetUserService.update(id, updateUserDto);
      return new SuccessResponse(
        'Usuário da clínica atualizado com sucesso',
        user,
      );
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Inativar usuário da clínica' })
  @ApiResponse({
    status: 200,
    description: 'Usuário da clínica inativar com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário da clínica não encontrado',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Put('change-status/:id')
  async changeUserStatus(@Param('id') id: string, @Body() body: { status: boolean }) {
    try {
      const user = await this.clinicVetUserService.changeUserStatus(id, body.status);
      return new SuccessResponse(
        'Usuário da clínica inativado com sucesso',
        user,
      );
    } catch (error) {
      return new ErrorResponse(error);
    }
  }
}
