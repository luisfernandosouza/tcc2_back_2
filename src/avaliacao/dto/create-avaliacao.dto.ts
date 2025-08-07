import { IsNotEmpty, IsString, IsInt, Min, Max, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAvaliacaoDto {
  @ApiProperty({ example: 5, description: 'Nota da avaliação (de 1 a 5)' })
  @IsNotEmpty({ message: 'A nota é obrigatória.' })
  @IsInt({ message: 'A nota deve ser um número inteiro.' })
  @Min(1, { message: 'A nota mínima é 1.' })
  @Max(5, { message: 'A nota máxima é 5.' })
  nota: number;

  @ApiProperty({ example: 'Adorei o local, muito bonito e bem cuidado.', description: 'Comentário da avaliação' })
  @IsNotEmpty({ message: 'O comentário é obrigatório.' })
  @IsString({ message: 'O comentário deve ser uma string.' })
  comentario: string;

  @ApiProperty({ example: '2023-10-27T10:00:00Z', description: 'Data da avaliação em formato ISO 8601' })
  @IsNotEmpty({ message: 'A data é obrigatória.' })
  @IsDateString()
  data: string;
  
  @ApiProperty({ example: '65f7c3b2e9d1a4f0c7b8e9d1', description: 'ID do usuário que fez a avaliação' })
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório.' })
  @IsString({ message: 'O ID do usuário deve ser uma string.' })
  usuarioId: string;

  @ApiProperty({ example: '65f7c3b2e9d1a4f0c7b8e9d2', description: 'ID do ponto turístico avaliado' })
  @IsNotEmpty({ message: 'O ID do ponto turístico é obrigatório.' })
  @IsString({ message: 'O ID do ponto turístico deve ser uma string.' })
  pontoTuristicoId: string;
}