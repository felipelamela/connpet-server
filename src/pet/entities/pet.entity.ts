import { GenderEnum, SpeciesEnum } from '@prisma/client';

export interface IPet {
  name: string;
  species: SpeciesEnum;
  breed: number;
  birthDate?: Date | null;
  color?: string | null;
  weight?: number | null;
  microchipNumber?: string | null;
  observations?: string | null;
  active?: boolean;
  tutorId: string;
  gender: GenderEnum;
}

export class PetEntity {
  name: string;
  species: SpeciesEnum;
  breed: number;
  birthDate: Date | null;
  color: string | null;
  weight: number | null;
  microchipNumber: string | null;
  observations: string | null;
  active: boolean;
  tutorId: string;
  gender: GenderEnum;

  constructor(pet: IPet) {
    this.name = pet.name;
    this.species = pet.species;
    this.breed = pet.breed;
    this.birthDate = pet.birthDate ?? null;
    this.color = pet.color ?? null;
    this.weight = pet.weight ?? null;
    this.microchipNumber = pet.microchipNumber ?? null;
    this.observations = pet.observations ?? null;
    this.active = pet.active ?? true;
    this.tutorId = pet.tutorId;
    this.gender = pet.gender;
  }
}
