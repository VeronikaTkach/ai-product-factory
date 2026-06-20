import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;
}
