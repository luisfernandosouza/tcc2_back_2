import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Importa o PrismaService global
import { Prisma, Usuario } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {} // Injeta o PrismaService

  /**
   * Busca um usuário pelo seu endereço de e-mail.
   * @param email O e-mail do usuário a ser buscado.
   * @returns O objeto Usuario encontrado ou null se não existir.
   */
  async findByEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  /**
   * Busca um usuário pelo seu ID único.
   * @param id O ID do usuário a ser buscado.
   * @returns O objeto Usuario encontrado ou null se não existir.
   */
  async findById(id: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }

  /**
   * Cria um novo usuário no banco de dados.
   * @param _data Os dados do novo usuário, excluindo o ID (que é gerado automaticamente).
   * @returns O objeto Usuario recém-criado.
   */
  async create(data: Prisma.UsuarioCreateInput): Promise<Usuario> {
    return this.prisma.usuario.create({ data });
  }

  /**
   * Atualiza as informações de um usuário existente.
   * @param id O ID do usuário a ser atualizado.
   * @param data Os dados parciais para atualização do usuário.
   * @returns O objeto Usuario atualizado.
   */
  async update(id: string, data: Partial<Usuario>): Promise<Usuario> {
    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }

  /**
   * Exclui um usuário do banco de dados.
   * @param id O ID do usuário a ser excluído.
   * @returns O objeto Usuario que foi excluído.
   */
  async delete(id: string): Promise<Usuario> {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}