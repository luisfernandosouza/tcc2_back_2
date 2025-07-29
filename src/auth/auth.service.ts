import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService as UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'; // Biblioteca para hashing de senhas
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Usuario } from '@prisma/client';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  /**
   * Registra um novo usuário na aplicação.
   * @param registerDto Dados de registro do usuário (nome, email, senha).
   * @returns Uma mensagem de sucesso.
   * @throws BadRequestException Se o e-mail já estiver em uso.
   */
  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    // Verifica se já existe um usuário com o e-mail fornecido
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Este e-mail já está em uso.');
    }

    // Gera o hash da senha antes de armazená-la no banco de dados para segurança
    const hashedPassword = await bcrypt.hash(registerDto.senha, 10); // O '10' é o fator de 'salt' rounds

    // Cria o novo usuário no banco de dados
    await this.userService.create({
      nome: registerDto.nome,
      email: registerDto.email,
      senha: hashedPassword,
      endereco: '',
    });

    return { message: 'Usuário registrado com sucesso!' };
  }

  /**
   * Valida as credenciais de um usuário para login.
   * @param email E-mail do usuário.
   * @param pass Senha do usuário.
   * @returns O objeto do usuário (sem a senha) se as credenciais forem válidas, ou null caso contrário.
   */
  async validateUser(email: string, pass: string): Promise<Omit<Usuario, 'senha'> | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.senha))) {
      // Se o usuário existir e a senha corresponder ao hash
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { senha, ...result } = user; // Remove a senha do objeto antes de retorná-lo
      return result;
    }
    return null; // Credenciais inválidas
  }

  /**
   * Realiza o login do usuário, validando as credenciais e gerando um token JWT.
   * @param loginDto Dados de login do usuário (email, senha).
   * @returns Um objeto contendo o token de acesso JWT.
   * @throws UnauthorizedException Se as credenciais forem inválidas.
   */
  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.senha);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // O payload do token JWT. 'sub' (subject) é tipicamente o ID do usuário.
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload), // Assina o payload para gerar o token JWT
    };
  }

  /**
   * Obtém os detalhes do perfil de um usuário pelo seu ID.
   * @param userId O ID do usuário.
   * @returns O objeto do usuário (sem a senha), ou null se não for encontrado.
   */
  async getProfile(userId: string): Promise<Omit<Usuario, 'senha'> | null> {
    const user = await this.userService.findById(userId);
    if (!user) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha, ...result } = user; // Garante que a senha nunca seja exposta
    return result;
  }
}