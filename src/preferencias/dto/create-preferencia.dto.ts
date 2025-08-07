import { IsNotEmpty, IsDateString, IsNumber, IsOptional, IsString, IsArray, ArrayUnique, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePreferenciaDto {
  @ApiProperty({ example: '2023-10-27T10:00:00Z', description: 'Data da preferência em formato ISO 8601' })
  @IsNotEmpty({ message: 'A data é obrigatória.' })
  @IsDateString()
  data: string;

  @ApiProperty({ example: 150.50, description: 'Preço máximo da preferência' })
  @IsNotEmpty({ message: 'O preço é obrigatório.' })
  @IsNumber({}, { message: 'O preço deve ser um número.' })
  preco: number;
  
  @ApiProperty({ example: '65f7c3b2e9d1a4f0c7b8e9d1', description: 'ID do usuário que mantém a preferência' })
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório.' })
  @IsString({ message: 'O ID do usuário deve ser uma string.' })
  usuarioId: string;

  @ApiProperty({ example: ['65f7c3b2e9d1a4f0c7b8e9d2', '65f7c3b2e9d1a4f0c7b8e9d3'], description: 'IDs dos pontos turísticos de preferência' })
  @IsOptional()
  @IsArray({ message: 'Os pontos turísticos devem ser um array de IDs.' })
  @ArrayUnique({ message: 'Os IDs de ponto turístico devem ser únicos.' })
  @ArrayNotEmpty({ message: 'O array de IDs não pode ser vazio.' })
  @IsString({ each: true, message: 'Cada ID deve ser uma string.' })
  pontoTuristicoIds?: string[];
}