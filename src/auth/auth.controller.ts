import { Body, Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Usuario } from '@prisma/client';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<{ message: string }> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard) // Protege esta rota, exigindo um token JWT válido
  @Get('profile')
  async getProfile(@Request() req: { user: Usuario }): Promise<Omit<Usuario, 'senha'>> {
    // O objeto 'req.user' é populado pela JwtStrategy após a validação bem-sucedida do token.
    // Retornamos o perfil do usuário, removendo a senha por segurança.
    return this.authService.getProfile(req.user.id);
  }
}