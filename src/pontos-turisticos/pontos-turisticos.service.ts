import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PontoTuristico, Prisma } from '@prisma/client';
import { CreatePontoTuristicoDto } from './dto/create-ponto-turistico.dto';
import { UpdatePontoTuristicoDto } from './dto/update-ponto-turistico.dto';

@Injectable()
export class PontoTuristicoService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria um novo ponto turístico.
   * Lida com a conexão de categorias existentes.
   * @param data Dados para criação do ponto turístico.
   * @returns O ponto turístico criado.
   */
  async create(data: CreatePontoTuristicoDto): Promise<PontoTuristico> {
    const { categoriaIds, ...pontoTuristicoData } = data;

    // Conecta categorias existentes ou lança erro se alguma não existir
    const connectCategories = categoriaIds.map(id => ({ id }));

    try {
      return this.prisma.pontoTuristico.create({
        data: {
          ...pontoTuristicoData,
          categorias: {
            connect: connectCategories,
          },
        },
      });
    } catch (error) {
      // Exemplo de tratamento de erro para categoria não encontrada
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Uma ou mais categorias fornecidas não foram encontradas.');
      }
      throw error;
    }
  }

  /**
   * Retorna todos os pontos turísticos, opcionalmente incluindo suas categorias.
   * @returns Lista de pontos turísticos.
   */
  async findAll(): Promise<PontoTuristico[]> {
    return this.prisma.pontoTuristico.findMany({
      include: { categorias: true }, // Inclui as categorias relacionadas
    });
  }

  /**
   * Retorna um ponto turístico específico pelo ID, incluindo suas categorias.
   * @param id ID do ponto turístico.
   * @returns O ponto turístico encontrado.
   * @throws NotFoundException Se o ponto turístico não for encontrado.
   */
  async findOne(id: string): Promise<PontoTuristico> {
    const pontoTuristico = await this.prisma.pontoTuristico.findUnique({
      where: { id },
      include: { categorias: true },
    });
    if (!pontoTuristico) {
      throw new NotFoundException(`Ponto turístico com ID "${id}" não encontrado.`);
    }
    return pontoTuristico;
  }

  /**
   * Atualiza um ponto turístico existente.
   * Lida com a atualização das categorias (desconectando antigas e conectando novas).
   * @param id ID do ponto turístico a ser atualizado.
   * @param data Dados para atualização.
   * @returns O ponto turístico atualizado.
   * @throws NotFoundException Se o ponto turístico não for encontrado.
   */
  async update(id: string, data: UpdatePontoTuristicoDto): Promise<PontoTuristico> {
    const { categoriaIds, ...pontoTuristicoData } = data;

    let updateData: Prisma.PontoTuristicoUpdateInput = { ...pontoTuristicoData };

    if (categoriaIds !== undefined) {
      // Se categoriaIds for fornecido, atualiza as relações
      const connectCategories = categoriaIds.map(catId => ({ id: catId }));
      updateData = {
        ...updateData,
        categorias: {
          set: connectCategories, // 'set' substitui todas as relações existentes pelas novas
        },
      };
    }

    try {
      return await this.prisma.pontoTuristico.update({
        where: { id },
        data: updateData,
        include: { categorias: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Ponto turístico ou categoria com ID "${id}" não encontrada.`);
        }
        if (error.code === 'P2002') { // Ex: se tivesse um campo unique atualizado para um valor já existente
            throw new ConflictException('Nome de ponto turístico já existe.');
        }
      }
      throw error;
    }
  }

  /**
   * Exclui um ponto turístico.
   * @param id ID do ponto turístico a ser excluído.
   * @returns O ponto turístico excluído.
   * @throws NotFoundException Se o ponto turístico não for encontrado.
   */
  async remove(id: string): Promise<PontoTuristico> {
    try {
      return await this.prisma.pontoTuristico.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Ponto turístico com ID "${id}" não encontrado para exclusão.`);
      }
      throw error;
    }
  }

  // Métodos de busca adicionais (baseados nas operações do seu diagrama original)
  async buscarPorCategoria(categoriaId: string): Promise<PontoTuristico[]> {
    return this.prisma.pontoTuristico.findMany({
      where: {
        categorias: {
          some: { id: categoriaId }
        }
      },
      include: { categorias: true }
    });
  }

  async buscarPorAvaliacao(minNota: number): Promise<PontoTuristico[]> {
    // Esta busca seria mais complexa, pois as notas estão em Avaliacao.
    // Você precisaria agregar ou calcular a média das avaliações.
    // Por simplicidade, vou retornar todos os pontos que tenham avaliações (pelo menos uma).
    // Para uma busca real por nota, você precisaria de um método mais avançado com agregação.
    return this.prisma.pontoTuristico.findMany({
      where: {
        avaliacoes: {
          some: { nota: { gte: minNota } } // Exemplo: pontos com alguma avaliação maior ou igual a minNota
        }
      },
      include: { avaliacoes: true, categorias: true }
    });
  }

  async buscarPorRegiao(enderecoParcial: string): Promise<PontoTuristico[]> {
    return this.prisma.pontoTuristico.findMany({
      where: {
        endereco: {
          contains: enderecoParcial,
          mode: 'insensitive' // Para busca case-insensitive no MongoDB
        }
      },
      include: { categorias: true }
    });
  }

  async buscarPorCoordenadas(latitude: number, longitude: number, raioKm: number): Promise<PontoTuristico[]> {
    // Para busca por coordenadas/raio no MongoDB com Prisma, geralmente
    // você precisaria de capacidades geo-espaciais nativas do MongoDB (2dsphere index).
    // O Prisma não tem um método nativo de 'distance' para MongoDB como para DBs relacionais.
    // Você teria que fazer uma query raw ou calcular a distância no aplicativo.
    // Exemplo de consulta raw (requer 2dsphere index na coleção e latitude/longitude):
    const results = await this.prisma.$runCommandRaw({
      geoNear: "pontoturistico", // Nome da sua coleção no DB
      near: { type: "Point", coordinates: [longitude, latitude] },
      distanceField: "dist.calculated",
      spherical: true,
      maxDistance: raioKm * 1000, // Converte Km para metros
    });
    return results.results as PontoTuristico[];

    // Por simplicidade, retorno todos os pontos com coordenadas no exemplo
    // SEM FILTRO DE RAIO, para evitar complexidade de query raw agora.
    // Implementação real precisa de geoNear ou cálculo de distância.
    // return this.prisma.pontoTuristico.findMany({
    //   where: {
    //     latitude: { not: null },
    //     longitude: { not: null }
    //   },
    //   include: { categorias: true }
    // });
  }

  async buscarPorPreco(precoMax: number): Promise<PontoTuristico[]> {
    // Supondo que 'preco' seja um campo na Viagem relacionada.
    // Aqui estamos buscando PontoTuristico que *possuam* alguma Viagem com preço <= precoMax.
    return this.prisma.pontoTuristico.findMany({
      where: {
        viagens: {
          some: { preco: { lte: precoMax } } // lte = less than or equal
        }
      },
      include: { viagens: true, categorias: true }
    });
  }
}