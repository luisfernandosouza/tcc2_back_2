import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Aventura',
    description: 'The name of the category (e.g., "Aventura", "Praia", "Cultural")',
  })
  @IsNotEmpty({ message: 'O nome da categoria é obrigatório.' })
  @IsString({ message: 'O nome da categoria deve ser uma string.' })
  categoria: string;
}