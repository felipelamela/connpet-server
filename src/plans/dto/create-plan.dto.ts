import { IsBoolean, IsDefined, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsNumber()
  @IsNotEmpty()
  price: number

  @IsBoolean()
  @IsDefined()
  active: boolean
}
