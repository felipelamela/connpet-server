import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../commom/prisma/prisma.service";
import { IUserProfileEmployee } from "./entities/user-profile-employee.entity";

@Injectable()
export default class ClinicVetUserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(user: IUserProfileEmployee) {
    try {
      return await this.prisma.userProfileEmployee.create({
        data: user
      })
    } catch (error) {
      throw new Error("Erro ao cadastrar perfil do usuário")
    }
  }

}