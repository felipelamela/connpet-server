import { Injectable } from "@nestjs/common";
import { CreateClinicVetDto } from "./dto/create-clinic-vet.dto";
import { clinicVetRepository } from "./clinic-vet.repository";

@Injectable()
export class ClinicVetHandlers{
    constructor(private readonly clinicRepository: clinicVetRepository){}

    async createClinic(createClinic:CreateClinicVetDto){
        try {
            return await this.clinicRepository.createClinic({...createClinic})
        } catch (error) {
            throw new Error(error.message)
        }
    }
    
}