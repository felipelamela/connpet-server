import { Injectable } from "@nestjs/common";
import { clinicVetRepository } from "./clinic-vet.repository";
import { ClinicVetEntity } from "./entities/clinic-vet.entity";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { RoleEnum, User, UserProfileEmployee, VeterinaryClinic } from "@prisma/client";
import { ErrorResponse } from "../commom/response/errorResponse";
import { ErrorEnum } from "../commom/enum/error.enum";

@Injectable()
export class ClinicVetHandlers {
  constructor(
    private readonly clinicRepository: clinicVetRepository,
    private readonly userService: UserService
  ) { }

  async createClinic(data: {
    createClinic: ClinicVetEntity,
    user: UserEntity
  }): Promise<{ user: User, clinic: VeterinaryClinic }> {
    try {
      const [userId, clinicId] = await Promise.all([
        this.userService.create(data.user),
        this.clinicRepository.createClinic({ ...data.createClinic })
      ])
      await this.createProfile({ userId: userId.id, companyId: clinicId.id })
      return {
        user: userId,
        clinic: clinicId
      }
    } catch (error) {
      throw new ErrorResponse(error)
    }
  }
  async createProfile(data: {
    userId: string
    companyId: string
  }): Promise<UserProfileEmployee> {
    try {
      return await this.clinicRepository.createProfile({
        userId: data.userId,
        companyId: data.companyId,
        roles: RoleEnum.CLINIC_ADMIN,
        phone: "",
        document: ""
      })
    } catch (error) {
      throw new ErrorResponse(error)
    }
  }
  async validateCreateClinic(data: { userEmail: string, cnpj: string }): Promise<number> {
    const [idClinic, idUser] = await Promise.all([
      await this.clinicRepository.findClinicByCNPJ(data.cnpj),
      await this.userService.findUserByEmail(data.userEmail)
    ])
    if (idClinic) {
      throw new ErrorResponse({
        message: "Clínica cadastrada no sistema.",
        statusCode: 400,
        errorsCode: ErrorEnum.ALREADY_EXISTS,
        details: `CNPJ: ${data.cnpj} - id: ${idClinic.id}`
      })
    }
    if (idUser) {
      throw new ErrorResponse({
        message: "Usuário cadastrado no sistema.",
        statusCode: 400,
        errorsCode: ErrorEnum.ALREADY_EXISTS,
        details: `Email: ${data.userEmail} - id: ${idUser.id}`
      })
    }
    return 0
  }
  async validateUserProfile(data: { userId: string, companyId: string }) {
    try {
      return await this.clinicRepository.findUserProfile({
        userId: data.userId,
        clinicId: data.companyId,
      })
    } catch (error) {
      throw new ErrorResponse(error)
    }
  }
}