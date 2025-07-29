import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsNumber,
  ValidateIf, // Importe ValidateIf
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePontoTuristicoDto {
  @ApiProperty({ example: 'Cristo Redentor', description: 'Nome do ponto turístico' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  nome: string;

  @ApiProperty({
    example: 'Estátua Art déco de Jesus Cristo no Rio de Janeiro.',
    description: 'Descrição detalhada do ponto turístico',
  })
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  @IsString({ message: 'A descrição deve ser uma string.' })
  descricao: string;

  @ApiProperty({
    example: 'Rua da Estátua, 100 - Corcovado, Rio de Janeiro - RJ',
    description: 'Endereço completo do ponto turístico (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O endereço deve ser uma string.' })
  endereco?: string;

  @ApiProperty({
    example: -22.951916,
    description: 'Latitude do ponto turístico (opcional, mas requer longitude se presente)',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'A latitude deve ser um número.' })
  @ValidateIf(o => o.longitude !== undefined && o.latitude === undefined, { // Se longitude existe, latitude é obrigatória
    message: 'Latitude é obrigatória se longitude for fornecida.',
  })
  latitude?: number;

  @ApiProperty({
    example: -43.210487,
    description: 'Longitude do ponto turístico (opcional, mas requer latitude se presente)',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'A longitude deve ser um número.' })
  @ValidateIf(o => o.latitude !== undefined && o.longitude === undefined, { // Se latitude existe, longitude é obrigatória
    message: 'Longitude é obrigatória se latitude for fornecida.',
  })
  longitude?: number;

  @ApiProperty({
    example: ['65f7c3b2e9d1a4f0c7b8e9d1', '65f7c3b2e9d1a4f0c7b8e9d2'],
    description: 'Lista de IDs de categorias às quais este ponto turístico pertence',
    type: [String],
    required: true,
  })
  @IsArray({ message: 'As categorias devem ser um array de IDs.' })
  @ArrayNotEmpty({ message: 'É necessário informar ao menos uma categoria.' })
  @IsString({ each: true, message: 'Cada ID de categoria deve ser uma string.' })
  @ArrayUnique({ message: 'Os IDs de categoria devem ser únicos.' })
  categoriaIds: string[];
}