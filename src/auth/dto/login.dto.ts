import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Make sure to import ApiProperty

export class LoginDto {
  @ApiProperty({ example: 'joao.silva@example.com', description: 'The user\'s email address' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @ApiProperty({ example: 'senhaSegura123', description: 'The user\'s password' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  senha: string;
}