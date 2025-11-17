import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { SuccessResponse } from '../common/response/successResponse';
import { ErrorResponse } from '../common/response/errorResponse';
import { ErrorEnum } from '../common/enum/error.enum';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Criar novo pagamento' })
  @ApiResponse({ status: 201, description: 'Pagamento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    try {
      const payment = await this.paymentsService.create(createPaymentDto);
      return new SuccessResponse('Pagamento criado com sucesso', payment);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Listar todos os pagamentos' })
  @ApiResponse({ status: 200, description: 'Lista de pagamentos' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Get()
  async findAll() {
    try {
      const payments = await this.paymentsService.findAll();
      return new SuccessResponse('Pagamentos listados com sucesso', payments);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Buscar pagamento por ID' })
  @ApiResponse({ status: 200, description: 'Pagamento encontrado' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const payment = await this.paymentsService.findOne(+id);
      return new SuccessResponse('Pagamento encontrado com sucesso', payment);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Atualizar pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    try {
      const payment = await this.paymentsService.update(+id, updatePaymentDto);
      return new SuccessResponse('Pagamento atualizado com sucesso', payment);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Excluir pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.paymentsService.remove(+id);
      return new SuccessResponse('Pagamento excluído com sucesso', null);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }
}
