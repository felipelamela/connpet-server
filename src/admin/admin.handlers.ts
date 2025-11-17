import { Injectable } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { ClinicVetEntity } from './entities/clinic-vet.entity';
import { RoleEnum, User, UserProfileEmployee, Company } from '@prisma/client';
import { ErrorResponse } from '../common/response/errorResponse';
import { ErrorEnum } from '../common/enum/error.enum';
import { UserService } from 'src/services/user/user.service';
import { UserEntity } from 'src/services/user/entities/user.entity';

@Injectable()
export class AdminHandlers {
  constructor(
    private readonly clinicRepository: AdminRepository,
    private readonly userService: UserService,
  ) {}

  async createClinic(data: {
    createClinic: ClinicVetEntity;
    user: UserEntity;
  }): Promise<{ user: User; clinic: Company }> {
    try {
      const [userId, clinicId] = await Promise.all([
        this.userService.create(data.user),
        this.clinicRepository.createClinic({ ...data.createClinic }),
      ]);
      await this.createProfile({ userId: userId.id, companyId: clinicId.id });
      return {
        user: userId,
        clinic: clinicId,
      };
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
  async createProfile(data: {
    userId: string;
    companyId: string;
  }): Promise<UserProfileEmployee> {
    try {
      return await this.clinicRepository.createProfile({
        userId: data.userId,
        companyId: data.companyId,
        roles: RoleEnum.CLINIC_ADMIN,
        phone: '',
        document: '',
      });
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
  async validateCreateClinic(data: {
    userEmail: string;
    cnpj: string;
  }): Promise<number> {
    const [idClinic, idUser] = await Promise.all([
      await this.clinicRepository.findClinicByCNPJ(data.cnpj),
      await this.userService.findUserByEmail(data.userEmail),
    ]);
    if (idClinic) {
      throw new ErrorResponse({
        message: 'Clínica cadastrada no sistema.',
        statusCode: 400,
        errorsCode: ErrorEnum.ALREADY_EXISTS,
        details: `CNPJ: ${data.cnpj} - id: ${idClinic.id}`,
      });
    }
    if (idUser) {
      throw new ErrorResponse({
        message: 'Usuário cadastrado no sistema.',
        statusCode: 400,
        errorsCode: ErrorEnum.ALREADY_EXISTS,
        details: `Email: ${data.userEmail} - id: ${idUser.id}`,
      });
    }
    return 0;
  }
  async createUserProfile(data: { user: UserEntity; companyId: string }) {
    try {
      const user = await this.userService.create(data.user);
      return await this.createProfile({
        userId: user.id,
        companyId: data.companyId,
      });
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
  async createTutorWithPet() {}
  async findAllTutors(filters?: { page?: number; limit?: number; search?: string; orderBy?: string; orderDirection?: 'asc' | 'desc' }) {
    try {
      return await this.clinicRepository.findAllTutors(filters);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findTutorById(tutorId: string) {
    try {
      return await this.clinicRepository.findTutorById(tutorId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async importTutorById(id: string, panelId:string) {
    try {
      const tutor = await this.findTutorById(id);
      if (!tutor) {
        throw new ErrorResponse({
          message: 'Tutor não encontrado',
          statusCode: 404,
          errorsCode: ErrorEnum.NOT_FOUND,
        });
      }
      const petsPainel = tutor.pets.map((pet) => {
        return {
          petId: pet.id,
          panelId: panelId,
        };
      });
      const tutorPainel = {
        tutorId: tutor.id,
        panelId: panelId,
      };

      await this.clinicRepository.createTutorCompany(tutorPainel);
      await this.clinicRepository.createPetsCompany(petsPainel);
        
      return {
        tutor: tutorPainel,
        pets: petsPainel,
      };
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}
