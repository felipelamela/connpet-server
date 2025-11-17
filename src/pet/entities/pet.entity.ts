import { GenderEnum } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface IPet {
  tutorId: string;
  name: string;
  species: number;
  breed: number;
  birthDate?: Date | null;
  color?: string | null;
  weight?: number | Decimal | null;
  microchipNumber?: string | null;
  observations?: string | null;
  gender: GenderEnum;
  active?: boolean;
}

export class PetEntity {
  tutorId: string;
  name: string;
  species: number;
  breed: number;
  birthDate: Date | null;
  color: string | null;
  weight: Decimal | null;
  microchipNumber: string | null;
  observations: string | null;
  gender: GenderEnum;
  active: boolean;

  constructor(pet: IPet) {
    this.tutorId = pet.tutorId;
    this.name = pet.name;
    this.species = pet.species;
    this.breed = pet.breed;
    this.birthDate = pet.birthDate ?? null;
    this.color = pet.color ?? null;
    this.weight = pet.weight 
      ? (typeof pet.weight === 'number' ? new Decimal(pet.weight) : pet.weight)
      : null;
    this.microchipNumber = pet.microchipNumber ?? null;
    this.observations = pet.observations ?? null;
    this.gender = pet.gender;
    this.active = pet.active ?? true;
  }
}
