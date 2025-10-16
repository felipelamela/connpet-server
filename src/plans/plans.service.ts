import { Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlansRepository } from './plans.repository';
import { ErrorResponse } from '../commom/response/errorResponse';

@Injectable()
export class PlansService {
  constructor(private readonly plansRepository: PlansRepository) { }
  async create(createPlanDto: CreatePlanDto) {
    try {
      return await this.plansRepository.create(createPlanDto)
    } catch (error) {
      throw new ErrorResponse(error.message)
    }
  }

  async findAll() {
    try {
      return await this.plansRepository.getPlans()
    } catch (error) {
      throw new ErrorResponse(error.message)
    }
  }

  async findOne(id: string) {
    try {
      return await this.plansRepository.getPlansById(id)
    } catch (error) {
      throw new ErrorResponse(error.message)
    }
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    try {
      return await this.plansRepository.update({ id, plan: updatePlanDto })
    } catch (error) {
      throw new ErrorResponse(error.message)
    }

  }

  async changeStatus(id: string, status: boolean) {
    try {
      return await this.plansRepository.changeStatus({ id, status })
    } catch (error) {
      throw new Error(error.message)
    }

  }
}
