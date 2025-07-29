import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Importe este decorador

export class RegisterDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome completo do usuário' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  nome: string;

  @ApiProperty({ example: 'joao.silva@example.com', description: 'Endereço de e-mail único do usuário' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @ApiProperty({ example: 'senhaSegura123', description: 'Senha do usuário (mínimo 6 caracteres)' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  senha: string;
}