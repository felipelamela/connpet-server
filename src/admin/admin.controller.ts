import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateClinicVetDto } from './dto/create-clinic-vet.dto';
import { SuccessResponse } from 'src/common/response/successResponse';
import { ErrorResponse } from 'src/common/response/errorResponse';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import type { IProduct } from 'src/services/product/entities/product.entity';
import { ErrorEnum } from 'src/common/enum/error.enum';
import { ProductFilterDto } from 'src/services/product/dto/product-filter.dto';
import { JwtPayload } from 'src/auth/entities/jwt-payload.entity';
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Public()
  @Post()
  async create(@Body() createClinicVetDto: CreateClinicVetDto) {
    try {
      const newClinic = await this.adminService.create(createClinicVetDto);
      //criar funcionalidade de envio de email após sucesso do cadastro
      return new SuccessResponse('Clinica criada com sucesso', newClinic);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Post('/plans')
  async createClinicPlans(
    @Body() createClinicPlans: { idClinic: string; idPlan: string },
  ) {
    try {
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  /**
   * CRUD de produtos
   */

  @Post('product')
  async createProduct(
    @Body() createProductDto: IProduct,
    @CurrentUser('companyId') companyId: string
  ) {
    try {
      if (!companyId) {
        throw new ErrorResponse({
          message: 'ID da empresa é obrigatório.',
          statusCode: 400,
          errorsCode: ErrorEnum.BAD_REQUEST,
        });
      }
      const newProduct = await this.adminService.createProduct(createProductDto, companyId);
      return new SuccessResponse('Produto criado com sucesso', newProduct);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get('product')
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Itens por página' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Termo de busca' })
  @ApiQuery({ name: 'type', required: false, type: String, description: 'Tipo de produto' })
  @ApiQuery({ name: 'active', required: false, type: Boolean, description: 'Status ativo' })
  async findAllProducts(
    @CurrentUser('companyId') companyId: string,
    @Query() filters: ProductFilterDto
  ) {
    try {
      if (!companyId) {
        throw new ErrorResponse({
          message: 'ID da empresa é obrigatório.',
          statusCode: 400,
          errorsCode: ErrorEnum.BAD_REQUEST,
        });
      }
      const products = await this.adminService.findAllProducts(companyId, filters);
      return new SuccessResponse('Produtos encontrados com sucesso', products);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get('product/:id')
  async findProductById(@Param('id') id: string) {
    try {
      const product = await this.adminService.findProductById(id);
      return new SuccessResponse('Produto encontrado com sucesso', product);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Put('product/:id')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: any) {
    try {
      const product = await this.adminService.updateProduct(id, updateProductDto);
      return new SuccessResponse('Produto atualizado com sucesso', product);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Delete('product/:id')
  async deleteProduct(@Param('id') id: string) {
    try {
      const result = await this.adminService.deleteProduct(id);
      return new SuccessResponse('Produto deletado com sucesso', result);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get('products/expiring')
  async findExpiringProducts(
    @CurrentUser('companyId') companyId: string,
    @Query('days') days: number = 30,
  ) {
    try {
      if (!companyId) {
        return new ErrorResponse({
          message: 'ID da empresa não encontrado.',
          statusCode: 400,
          errorsCode: ErrorEnum.BAD_REQUEST,
        });
      }
      const products = await this.adminService.findExpiringProducts(companyId, days);
      return new SuccessResponse('Produtos próximos do vencimento encontrados', products);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  /**
   * CRUD de Serviços
   */
  @Post('service')
  async createService(
    @Body() createServiceDto: any,
    @CurrentUser('companyId') companyId: string,
  ) {
    try {
      if (!companyId) {
        return new ErrorResponse({
          message: 'ID da empresa não encontrado.',
          statusCode: 400,
          errorsCode: ErrorEnum.BAD_REQUEST,
        });
      }
      // TODO: Implementar busca do panelId baseado no companyId
      const panelId = 'e2ce53d8-e3b6-4c16-bc1f-56ab5aa45a09';
      const service = await this.adminService.createService(createServiceDto, panelId);
      return new SuccessResponse('Serviço criado com sucesso', service);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get('services')
  async findAllServices(
    @CurrentUser() user: JwtPayload,
    @Query() filters: any,
  ) {
    try {
      if (!user.panelId || !user.panelType) {
        return new ErrorResponse({
          message: 'Painel não encontrado.',
          statusCode: 400,
          errorsCode: ErrorEnum.BAD_REQUEST,
        });
      }
      const services = await this.adminService.findAllServices(user, filters);
      return new SuccessResponse('Serviços encontrados com sucesso', services);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get('service/:id')
  async findServiceById(@Param('id') id: string) {
    try {
      const service = await this.adminService.findServiceById(id);
      return new SuccessResponse('Serviço encontrado com sucesso', service);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Put('service/:id')
  async updateService(@Param('id') id: string, @Body() updateServiceDto: any) {
    try {
      const service = await this.adminService.updateService(id, updateServiceDto);
      return new SuccessResponse('Serviço atualizado com sucesso', service);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Delete('service/:id')
  async deleteService(@Param('id') id: string) {
    try {
      const result = await this.adminService.deleteService(id);
      return new SuccessResponse('Serviço deletado com sucesso', result);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get('services/category')
  async findServicesByCategory(
    @CurrentUser('companyId') companyId: string,
    @Query('category') category: string,
  ) {
    try {
      if (!companyId) {
        return new ErrorResponse({
          message: 'ID da empresa não encontrado.',
          statusCode: 400,
          errorsCode: ErrorEnum.BAD_REQUEST,
        });
      }
      // TODO: Implementar busca do panelId baseado no companyId
      const panelId = 'e2ce53d8-e3b6-4c16-bc1f-56ab5aa45a09';
      const services = await this.adminService.findServicesByCategory(panelId, category);
      return new SuccessResponse('Serviços encontrados com sucesso', services);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get('services/price-range')
  async findServicesByPriceRange(
    @CurrentUser('companyId') companyId: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
  ) {
    try {
      if (!companyId) {
        return new ErrorResponse({
          message: 'ID da empresa não encontrado.',
          statusCode: 400,
          errorsCode: ErrorEnum.BAD_REQUEST,
        });
      }
      // TODO: Implementar busca do panelId baseado no companyId
      const panelId = 'e2ce53d8-e3b6-4c16-bc1f-56ab5aa45a09';
      const services = await this.adminService.findServicesByPriceRange(panelId, minPrice, maxPrice);
      return new SuccessResponse('Serviços encontrados com sucesso', services);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  /**
   * CRUD de Pets
   */
  @Get('pets')
  @ApiOperation({ summary: 'Buscar pets por documento do tutor' })
  @ApiQuery({ name: 'document', required: false, type: String, description: 'CPF do tutor' })
  @ApiResponse({ status: 200, description: 'Pets encontrados com sucesso' })
  async searchPets(@Query('document') document?: string) {
    try {
      const pets = await this.adminService.searchPets(document);
      return new SuccessResponse('Pets encontrados com sucesso', pets);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }


  @Get('tutors')
  @ApiOperation({ summary: 'Buscar tutores com paginação' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Itens por página' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Buscar por nome, email ou documento' })
  @ApiQuery({ name: 'orderBy', required: false, type: String, description: 'Campo para ordenação' })
  @ApiQuery({ name: 'orderDirection', required: false, type: String, enum: ['asc', 'desc'], description: 'Direção da ordenação' })
  @ApiResponse({ status: 200, description: 'Tutores encontrados com sucesso' })
  async searchTutors(@Query() filters: any) {
    try {
      const tutors = await this.adminService.tutors(filters);
      return new SuccessResponse('Tutores encontrados com sucesso', tutors);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get('tutors/:id')
  @ApiOperation({ summary: 'Buscar detalhes do tutor por ID' })
  @ApiResponse({ status: 200, description: 'Detalhes do tutor encontrados com sucesso' })
  @ApiResponse({ status: 404, description: 'Tutor não encontrado' })
  async getTutorById(@Param('id') id: string) {
    try {
      const tutor = await this.adminService.findTutorById(id);
      return new SuccessResponse('Detalhes do tutor encontrados com sucesso', tutor);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get('import-tutor/:id')
  @ApiOperation({ summary: 'Importar tutor por ID' })
  @ApiResponse({ status: 200, description: 'Tutor importado com sucesso' })
  @ApiResponse({ status: 404, description: 'Tutor não encontrado' })
  async importTutorById(@Param('id') id: string) {
    try {
      const tutor = await this.adminService.importTutorById(id);
      return new SuccessResponse('Tutor importado com sucesso', tutor);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }


  @Get('payments')
  async paymentsClinic(@CurrentUser() user: JwtPayload, @Query() filters: any) {
    try {
      if (!user.panelId) {
        return new ErrorResponse({
          message: 'Painel não encontrado.',
          statusCode: 400,
          errorsCode: ErrorEnum.BAD_REQUEST,
        });
      }
      const payments = await this.adminService.findAllPayments(user.panelId, filters);
      return new SuccessResponse('Pagamentos encontrados com sucesso', payments);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get('payments/:id')
  async paymentDetail(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    try {
      if (!user.panelId) {
        return new ErrorResponse({
          message: 'Painel não encontrado.',
          statusCode: 400,
          errorsCode: ErrorEnum.BAD_REQUEST,
        });
      }

      const payment = await this.adminService.findPaymentById(user.panelId, id);
      return new SuccessResponse('Pagamento encontrado com sucesso', payment);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }
}
