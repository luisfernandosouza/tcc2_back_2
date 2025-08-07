import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Avaliacao, Prisma } from '@prisma/client';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';

@Injectable()
export class AvaliacaoService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma nova avaliação.
   * @param data Dados para criação da avaliação.
   * @returns A avaliação criada.
   */
  async create(data: CreateAvaliacaoDto): Promise<Avaliacao> {
    const { usuarioId, pontoTuristicoId, ...avaliacaoData } = data;
    try {
      return this.prisma.avaliacao.create({
        data: {
          ...avaliacaoData,
          data: new Date(avaliacaoData.data), // Converte a string de data para um objeto Date
          usuario: { connect: { id: usuarioId } },
          pontoTuristico: { connect: { id: pontoTuristicoId } },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Usuário ou Ponto Turístico não encontrado.');
      }
      throw error;
    }
  }

  /**
   * Retorna todas as avaliações.
   * @returns Lista de todas as avaliações.
   */
  async findAll(): Promise<Avaliacao[]> {
    return this.prisma.avaliacao.findMany({
      include: {
        usuario: true,
        pontoTuristico: true,
      },
    });
  }

  /**
   * Retorna uma avaliação específica pelo ID.
   * @param id ID da avaliação.
   * @returns A avaliação encontrada ou lança NotFoundException.
   */
  async findOne(id: string): Promise<Avaliacao> {
    const avaliacao = await this.prisma.avaliacao.findUnique({
      where: { id },
      include: {
        usuario: true,
        pontoTuristico: true,
      },
    });
    if (!avaliacao) {
      throw new NotFoundException(`Avaliação com ID "${id}" não encontrada.`);
    }
    return avaliacao;
  }

  /**
   * Atualiza uma avaliação existente.
   * @param id ID da avaliação a ser atualizada.
   * @param data Dados para atualização.
   * @returns A avaliação atualizada.
   */
  async update(id: string, data: UpdateAvaliacaoDto): Promise<Avaliacao> {
    const { usuarioId, pontoTuristicoId, ...avaliacaoData } = data;
    const updateData: Prisma.AvaliacaoUpdateInput = { ...avaliacaoData };

    if (usuarioId) {
      updateData.usuario = { connect: { id: usuarioId } };
    }
    if (pontoTuristicoId) {
      updateData.pontoTuristico = { connect: { id: pontoTuristicoId } };
    }
    if (avaliacaoData.data) {
      updateData.data = new Date(avaliacaoData.data);
    }

    try {
      return await this.prisma.avaliacao.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Avaliação com ID "${id}" não encontrada.`);
      }
      throw error;
    }
  }

  /**
   * Exclui uma avaliação pelo seu ID.
   * @param id ID da avaliação a ser excluída.
   * @returns A avaliação excluída.
   */
  async remove(id: string): Promise<Avaliacao> {
    try {
      return await this.prisma.avaliacao.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Avaliação com ID "${id}" não encontrada para exclusão.`);
      }
      throw error;
    }
  }
}