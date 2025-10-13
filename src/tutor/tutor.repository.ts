import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

interface ITutor {
  userId: string,
  addressId: string | null,
  document: string | null,
  phone: string | null,
}


@Injectable()
export default class TutorRepository {
  constructor(private readonly prisma: PrismaService) { }
  async create(data: ITutor) {
    try {
      return await this.prisma.userProfileTutor.create({
        data: data
      })
    } catch (error) {
      throw new Error("Erro ao cadastrar Tutor")
    }

  }
}