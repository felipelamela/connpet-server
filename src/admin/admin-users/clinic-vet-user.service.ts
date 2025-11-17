import { Injectable } from '@nestjs/common';
import { CreateClinicVetUserDto } from './dto/create-clinic-vet-user.dto';
import { UpdateClinicVetUserDto } from './dto/update-clinic-vet-user.dto';
import { UserProfileEmployeeEntity } from './entities/user-profile-employee.entity';
import { UserService } from 'src/services/user/user.service';
import { AddressService } from 'src/services/address/address.service';
import { generateRandomPassword } from 'src/common/system/generateRandomPassword';
import { UserEntity } from 'src/services/user/entities/user.entity';
import AddressEntity from 'src/services/address/entity/address.entity';
import { ErrorResponse } from 'src/common/response/errorResponse';
import ClinicVetUserRepository from './clinic-vet-user.respository';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class ClinicVetUserService {
  constructor(
    private readonly userService: UserService,
    private readonly clinicVetUserRepository: ClinicVetUserRepository,
    private readonly addressService: AddressService,
    private readonly prisma: PrismaService,
  ) {}
  async create(createClinicVetUserDto: CreateClinicVetUserDto, companyId: string) {
    try {
      const password = generateRandomPassword();
      const userEntity = new UserEntity({
        ...createClinicVetUserDto,
        password,
        status: true,
      });

      const userId = await this.userService.create(userEntity);

      const userProfile = new UserProfileEmployeeEntity({
        ...createClinicVetUserDto,
        userId: userId.id,
        companyId: companyId,
        roles: createClinicVetUserDto.roles,
      });

      return await this.clinicVetUserRepository.create(userProfile);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findAll(filters?: any) {
    try {
      return await this.clinicVetUserRepository.findAll(filters);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findByCompanyId(companyId: string) {
    try {
      return await this.clinicVetUserRepository.findByCompanyId(companyId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.clinicVetUserRepository.findOne(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async update(id: string, updateClinicVetUserDto: any) {
    try {
      // Buscar funcionário atual para obter dados necessários
      const currentEmployee = await this.clinicVetUserRepository.findOne(id);
      if (!currentEmployee) {
        throw new ErrorResponse({
          message: 'Funcionário não encontrado',
          statusCode: 404,
        });
      }

      // Separar dados do endereço e do funcionário
      const { address, name, email, ...employeeData } = updateClinicVetUserDto;

      // Atualizar usuário se name ou email foram fornecidos
      if (name || email) {
        await this.userService.update(currentEmployee.userId, {
          ...(name && { name }),
          ...(email && { email }),
        });
      }

      // Processar endereço se fornecido
      let addressId = currentEmployee.addressId;
      if (address) {
        if (currentEmployee.addressId) {
          // Atualizar endereço existente
          await this.addressService.update(currentEmployee.addressId, address);
        } else {
          // Criar novo endereço
          const addressEntity = new AddressEntity(address);
          const newAddress = await this.addressService.create(addressEntity);
          addressId = newAddress.id;
          employeeData.addressId = addressId;
        }
      }

      // Filtrar apenas campos válidos para UserProfileEmployee
      // Remover campos undefined, null vazios e campos que não existem na tabela
      const validFields: any = {};
      if (employeeData.roles !== undefined) validFields.roles = employeeData.roles;
      if (employeeData.document !== undefined && employeeData.document !== null && employeeData.document !== '') {
        validFields.document = employeeData.document;
      }
      if (employeeData.phone !== undefined && employeeData.phone !== null && employeeData.phone !== '') {
        validFields.phone = employeeData.phone;
      }
      if (employeeData.crmv !== undefined) validFields.crmv = employeeData.crmv || null;
      if (employeeData.crmvState !== undefined) validFields.crmvState = employeeData.crmvState || null;
      if (employeeData.addressId !== undefined) validFields.addressId = employeeData.addressId;

      // Atualizar perfil do funcionário apenas se houver campos válidos
      if (Object.keys(validFields).length > 0) {
        return await this.clinicVetUserRepository.update(id, validFields);
      } else {
        // Se não há campos para atualizar no perfil, retornar o funcionário atualizado
        return await this.clinicVetUserRepository.findOne(id);
      }
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async changeUserStatus(id: string, status: boolean) {
    try {
      const user = await this.userService.findUserById(id);
      if (!user) {
        throw new ErrorResponse({
          message: 'Usuário não encontrado',
          statusCode: 404,
        });
      }
      return await this.userService.updateUserStatus(id, status);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}
