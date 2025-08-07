import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Preferencia, Prisma } from '@prisma/client';
import { CreatePreferenciaDto } from './dto/create-preferencia.dto';
import { UpdatePreferenciaDto } from './dto/update-preferencia.dto';

@Injectable()
export class PreferenciaService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma nova preferência.
   * @param data Dados para criação da preferência.
   * @returns A preferência criada.
   */
  async create(data: CreatePreferenciaDto): Promise<Preferencia> {
    const { usuarioId, pontoTuristicoIds, ...preferenciaData } = data;
    try {
      return this.prisma.preferencia.create({
        data: {
          ...preferenciaData,
          data: new Date(preferenciaData.data),
          usuario: { connect: { id: usuarioId } },
          pontosTuristicos: { connect: pontoTuristicoIds?.map(id => ({ id })) || [] },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Usuário ou um dos Pontos Turísticos não foi encontrado.');
      }
      throw error;
    }
  }

  /**
   * Retorna todas as preferências.
   * @returns Lista de todas as preferências.
   */
  async findAll(): Promise<Preferencia[]> {
    return this.prisma.preferencia.findMany({
      include: {
        usuario: true,
        pontosTuristicos: true,
      },
    });
  }

  /**
   * Retorna uma preferência específica pelo ID.
   * @param id ID da preferência.
   * @returns A preferência encontrada ou lança NotFoundException.
   */
  async findOne(id: string): Promise<Preferencia> {
    const preferencia = await this.prisma.preferencia.findUnique({
      where: { id },
      include: {
        usuario: true,
        pontosTuristicos: true,
      },
    });
    if (!preferencia) {
      throw new NotFoundException(`Preferencia com ID "${id}" não encontrada.`);
    }
    return preferencia;
  }

  /**
   * Atualiza uma preferência existente.
   * @param id ID da preferência a ser atualizada.
   * @param data Dados para atualização.
   * @returns A preferência atualizada.
   */
  async update(id: string, data: UpdatePreferenciaDto): Promise<Preferencia> {
    const { usuarioId, pontoTuristicoIds, ...preferenciaData } = data;
    const updateData: Prisma.PreferenciaUpdateInput = { ...preferenciaData };

    if (preferenciaData.data) {
      updateData.data = new Date(preferenciaData.data);
    }
    if (usuarioId) {
      updateData.usuario = { connect: { id: usuarioId } };
    }
    if (pontoTuristicoIds !== undefined) {
      updateData.pontosTuristicos = { set: pontoTuristicoIds.map(id => ({ id })) };
    }

    try {
      return await this.prisma.preferencia.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Preferencia com ID "${id}" não encontrada.`);
      }
      throw error;
    }
  }

  /**
   * Exclui uma preferência pelo seu ID.
   * @param id ID da preferência a ser excluída.
   * @returns A preferência excluída.
   */
  async remove(id: string): Promise<Preferencia> {
    try {
      return await this.prisma.preferencia.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Preferencia com ID "${id}" não encontrada para exclusão.`);
      }
      throw error;
    }
  }
}