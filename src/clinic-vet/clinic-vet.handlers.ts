import { Injectable } from "@nestjs/common";
import { clinicVetRepository } from "./clinic-vet.repository";

Injectable()
export class ClinicVetHandlers{
    constructor(private readonly clinicRepository: clinicVetRepository){}
    
}