import { PartialType } from '@nestjs/swagger';
import { CreatePontoTuristicoDto } from './create-ponto-turistico.dto';
import {
  IsNumber,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// PartialType torna todos os campos de CreatePontoTuristicoDto opcionais
export class UpdatePontoTuristicoDto extends PartialType(CreatePontoTuristicoDto) {
  // Sobrescrever as validações para garantir que a lógica "ambos ou nenhum" funcione
  // mesmo se apenas um dos campos for fornecido no PATCH.
  // NestJS's ValidationPipe e class-validator lidam bem com PartialType,
  // mas adicionar o ValidateIf diretamente aqui ajuda a clareza.

  @ApiProperty({
    example: -22.951916,
    description: 'Latitude do ponto turístico (opcional, mas requer longitude se presente)',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'A latitude deve ser um número.' })
  @ValidateIf(o => o.longitude !== undefined && o.latitude === undefined, {
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
  @ValidateIf(o => o.latitude !== undefined && o.longitude === undefined, {
    message: 'Longitude é obrigatória se latitude for fornecida.',
  })
  longitude?: number;
}