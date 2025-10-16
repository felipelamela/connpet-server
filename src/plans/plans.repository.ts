import { Injectable } from "@nestjs/common";
import { PrismaService } from "../commom/prisma/prisma.service";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";

@Injectable()
export class PlansRepository {
  constructor(private readonly prisma: PrismaService) { }
  async create(plan: CreatePlanDto) {
    try {
      return this.prisma.plan.create({ data: plan })
    } catch (error) {
      throw new Error("Erro ao cadastrar plano.")
    }
  }
  async getPlans() {
    try {
      return this.prisma.plan.findMany({
        where: {
          active: true
        }
      })
    } catch (error) {
      throw new Error("Erro ao localizar planos")
    }
  }
  async getPlansById(id: string) {
    try {
      return this.prisma.plan.findMany({
        where: {
          id: id,
          active: true
        }
      })
    } catch (error) {
      throw new Error("Erro ao localizar plano")
    }
  }
  async update(data: { id: string, plan: UpdatePlanDto }) {
    try {
      return this.prisma.plan.update({
        where: {
          id: data.id
        }, data: data.plan
      })
    } catch (error) {
      throw new Error("Erro ao atualizar plano")
    }
  }
  async changeStatus(data: { id: string, status: boolean }) {
    try {
      return this.prisma.plan.update({
        where: { id: data.id },
        data: {
          active: data.status
        }
      })
    } catch (error) {
      throw new Error("Erro ao desativar")
    }
  }
}