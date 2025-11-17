import { Injectable } from '@nestjs/common';
import { CreateClinicVetDto } from './dto/create-clinic-vet.dto';
import { AdminHandlers } from './admin.handlers';
import { ClinicVetEntity } from './entities/clinic-vet.entity';
import { ErrorResponse } from '../common/response/errorResponse';
import { User, Company } from '@prisma/client';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { generateRandomPassword } from '../common/system/generateRandomPassword';
import { UserEntity } from 'src/services/user/entities/user.entity';
import { ServiceService } from 'src/services/service/service.service';
import { ProductService } from 'src/services/product/product.service';
import { IProduct } from 'src/services/product/entities/product.entity';
import { ProductResponseDto } from 'src/services/product/dto/product-response.dto';
import { ServiceResponseDto } from 'src/services/service/dto/service-response.dto';
import { ErrorEnum } from 'src/common/enum/error.enum';
import { ProductFilterDto } from 'src/services/product/dto/product-filter.dto';
import { PetService } from 'src/pet/pet.service';
import { getSpeciesName, getBreedName } from 'src/common/enum/species-breed.mapper';
import { JwtPayload } from 'src/auth/entities/jwt-payload.entity';
import { PaymentsService } from 'src/services/payments/payments.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly clinicVetHandlers: AdminHandlers,
    private readonly serviceService: ServiceService,
    private readonly productService: ProductService,
    private readonly petService: PetService,
    private readonly paymentsService: PaymentsService,
  ) {}
  async create(
    createClinicVetDto: CreateClinicVetDto,
  ): Promise<{ user: User; clinic: Company }> {
    try {
      const userEntity = new UserEntity({
        ...createClinicVetDto,
        status: true,
      });
      const clinicEntity = new ClinicVetEntity(createClinicVetDto);
      await this.clinicVetHandlers.validateCreateClinic({
        userEmail: userEntity.email,
        cnpj: clinicEntity.cnpj,
      });
      const createdClinic = await this.clinicVetHandlers.createClinic({
        createClinic: clinicEntity,
        user: userEntity,
      });
      return createdClinic;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
  async createUserProfile(createUserProfileDto: CreateUserProfileDto) {
    try {
      const password = generateRandomPassword();
      const userEntity = new UserEntity({
        ...createUserProfileDto,
        password,
        status: true,
      });
      await this.clinicVetHandlers.createUserProfile({
        user: userEntity,
        companyId: createUserProfileDto.companyId,
      });
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  /**
   * Produtos
   */
  async createProduct(createProductDto: IProduct, companyId: string): Promise<ProductResponseDto> {
    try {
      if (!companyId) {
        throw new ErrorResponse({
          message: 'ID da empresa é obrigatório.',
          statusCode: 400,
          errorsCode: ErrorEnum.BAD_REQUEST,
        });
      }
      
      const productData = {
        ...createProductDto,
        companyId
      };
      
      return await this.productService.create(productData);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findAllProducts(companyId: string, filters?: ProductFilterDto) {
    try {
      if (!companyId) {
        throw new ErrorResponse({
          message: 'ID da empresa é obrigatório.',
          statusCode: 400,
          errorsCode: ErrorEnum.BAD_REQUEST,
        });
      }
      return await this.productService.findAll({ ...filters, companyId });
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findProductById(id: string): Promise<ProductResponseDto> {
    try {
      return await this.productService.findOne(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async updateProduct(id: string, updateProductDto: any): Promise<ProductResponseDto> {
    try {
      return await this.productService.update(id, updateProductDto);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    try {
      return await this.productService.remove(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findExpiringProducts(companyId: string, days: number = 30): Promise<ProductResponseDto[]> {
    try {
      if (!companyId) {
        throw new ErrorResponse({
          message: 'ID da empresa é obrigatório.',
          statusCode: 400,
          errorsCode: ErrorEnum.BAD_REQUEST,
        });
      }
      return await this.productService.findExpiringProducts(companyId, days);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  /**
   * Serviços
   */
  async createService(createServiceDto: any, panelId: string): Promise<ServiceResponseDto> {
    try {
      if (!panelId) {
        throw new ErrorResponse({
          message: 'ID do painel é obrigatório.',
          statusCode: 400,
          errorsCode: ErrorEnum.BAD_REQUEST,
        });
      }
      
      const serviceData = {
        ...createServiceDto,
        panelId
      };
      
      return await this.serviceService.create(serviceData);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findAllServices(user: JwtPayload, filters?: any) {
    try {
      return await this.serviceService.findAll({ ...filters, panelId:user.panelId });
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findServiceById(id: string): Promise<ServiceResponseDto> {
    try {
      return await this.serviceService.findOne(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async updateService(id: string, updateServiceDto: any): Promise<ServiceResponseDto> {
    try {
      return await this.serviceService.update(id, updateServiceDto);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async deleteService(id: string): Promise<{ message: string }> {
    try {
      return await this.serviceService.remove(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findServicesByCategory(panelId: string, category: string): Promise<ServiceResponseDto[]> {
    try {
      if (!panelId) {
        throw new ErrorResponse({
          message: 'ID do painel é obrigatório.',
          statusCode: 400,
          errorsCode: ErrorEnum.BAD_REQUEST,
        });
      }
      return await this.serviceService.findByCategory(category);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findServicesByPriceRange(panelId: string, minPrice: number, maxPrice: number): Promise<ServiceResponseDto[]> {
    try {
      if (!panelId) {
        throw new ErrorResponse({
          message: 'ID do painel é obrigatório.',
          statusCode: 400,
          errorsCode: ErrorEnum.BAD_REQUEST,
        });
      }
      return await this.serviceService.findByPriceRange(minPrice, maxPrice, panelId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  /**
   * Pets
   */
  async searchPets(document?: string, panelId?: string) {
    try {
      if (document) {
        return await this.petService.findByTutorDocument(document, panelId || null);
      }
      return await this.petService.findAllPets();
      // throw new ErrorResponse({
      //   message: 'É necessário informar o documento do tutor para buscar pets.',
      //   statusCode: 400,
      //   errorsCode: ErrorEnum.BAD_REQUEST,
      // });
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
  async tutors(filters?: { page?: number; limit?: number; search?: string; orderBy?: string; orderDirection?: 'asc' | 'desc' }){
    try {
      return await this.clinicVetHandlers.findAllTutors(filters);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findTutorById(tutorId: string) {
    try {
      const tutor = await this.clinicVetHandlers.findTutorById(tutorId);
      
      if (!tutor) {
        throw new ErrorResponse({
          message: 'Tutor não encontrado',
          statusCode: 404,
          errorsCode: ErrorEnum.NOT_FOUND,
        });
      }

      // Processar pets para converter species e breed para strings
      const processedPets = tutor.pets?.map((pet) => ({
        ...pet,
        species: getSpeciesName(pet.species) as any,
        breed: getBreedName(pet.species, pet.breed) as any,
      })) || [];

      return {
        ...tutor,
        pets: processedPets,
      };
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async importTutorById(id: string) {
    try {
      return await this.clinicVetHandlers.importTutorById(id, 'e2ce53d8-e3b6-4c16-bc1f-56ab5aa45a09');
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findAllPayments(panelId: string, filters?: { page?: number; limit?: number }) {
    try {
      return await this.paymentsService.findAllPayments(panelId, filters);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findPaymentById(panelId: string, paymentId: string) {
    try {
      return await this.paymentsService.findPaymentById(panelId, paymentId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}
