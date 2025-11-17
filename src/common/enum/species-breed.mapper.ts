import { DogBreedEnum } from './dog-breed.enum';
import { CatBreedEnum } from './cat-breed.enum';
import { BirdBreedEnum } from './bird-breed.enum';
import { ReptileBreedEnum } from './reptile-breed.enum';
import { RodentBreedEnum } from './rodent-breed.enum';

// Mapeamento de espécie (número) para string
export const SpeciesMapper: { [key: number]: string } = {
  1: 'Canino',
  2: 'Felino',
  3: 'Ave',
  4: 'Réptil',
  5: 'Roedor',
  0: 'Outro',
};

// Mapeamento de raça por espécie
export function getBreedName(species: number, breed: number): string {
  if (breed === 0) return 'Outro';

  switch (species) {
    case 1: // Canino
      return DogBreedEnum[breed as keyof typeof DogBreedEnum] || `Raça ${breed}`;
    case 2: // Felino
      return CatBreedEnum[breed as keyof typeof CatBreedEnum] || `Raça ${breed}`;
    case 3: // Ave
      return BirdBreedEnum[breed as keyof typeof BirdBreedEnum] || `Raça ${breed}`;
    case 4: // Réptil
      return ReptileBreedEnum[breed as keyof typeof ReptileBreedEnum] || `Raça ${breed}`;
    case 5: // Roedor
      return RodentBreedEnum[breed as keyof typeof RodentBreedEnum] || `Raça ${breed}`;
    default:
      return `Raça ${breed}`;
  }
}

export function getSpeciesName(species: number): string {
  return SpeciesMapper[species] || 'Desconhecido';
}

