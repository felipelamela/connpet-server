import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class clinicVetRepository{
    constructor( private readonly prisma: PrismaService){}

    createClinic(){
        try {
            
        } catch (error) {
            throw new Error("Erro ao criar clinica")
        }
    }

}