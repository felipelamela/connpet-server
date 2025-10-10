import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateClinicVetDto } from "./dto/create-clinic-vet.dto";


@Injectable()
export class clinicVetRepository{
    constructor( private readonly prisma: PrismaService){}

    async createClinic(create:CreateClinicVetDto){
        try {
            return await this.prisma.veterinaryClinic.create({
                data:create
            })
        } catch (error) {
             throw new Error("Erro ao criar clinica")
        }
    }

}