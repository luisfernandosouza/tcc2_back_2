import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PontoTuristico, Prisma } from '@prisma/client';
import { CreatePontoTuristicoDto } from './dto/create-ponto-turistico.dto';
import { UpdatePontoTuristicoDto } from './dto/update-ponto-turistico.dto';

@Injectable()
export class PontosTuristicosService {
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
    const connectCategories = categoriaIds.map((id) => ({ id }));

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
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          'Uma ou mais categorias fornecidas não foram encontradas.',
        );
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
      throw new NotFoundException(
        `Ponto turístico com ID "${id}" não encontrado.`,
      );
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
  async update(
    id: string,
    data: UpdatePontoTuristicoDto,
  ): Promise<PontoTuristico> {
    const { categoriaIds, ...pontoTuristicoData } = data;

    let updateData: Prisma.PontoTuristicoUpdateInput = {
      ...pontoTuristicoData,
    };

    if (categoriaIds !== undefined) {
      // Se categoriaIds for fornecido, atualiza as relações
      const connectCategories = categoriaIds.map((catId) => ({ id: catId }));
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
          throw new NotFoundException(
            `Ponto turístico ou categoria com ID "${id}" não encontrada.`,
          );
        }
        if (error.code === 'P2002') {
          // Ex: se tivesse um campo unique atualizado para um valor já existente
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
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Ponto turístico com ID "${id}" não encontrado para exclusão.`,
        );
      }
      throw error;
    }
  }

  // Métodos de busca adicionais (baseados nas operações do seu diagrama original)
  async buscarPorCategoria(categoriaId: string): Promise<PontoTuristico[]> {
    return this.prisma.pontoTuristico.findMany({
      where: {
        categorias: {
          some: { id: categoriaId },
        },
      },
      include: { categorias: true },
    });
  }

    async buscarPorVariasCategorias(categoriaIds: string[]): Promise<PontoTuristico[]> {
    return this.prisma.pontoTuristico.findMany({
      where: {
        categorias: {
          some: {
            id: { in: categoriaIds } // Usa 'in' para buscar IDs dentro de um array
          }
        }
      },
      include: { categorias: true }
    });
  }


  async buscarPorCategoriaETexto(categoriaIds?: string[], query?: string): Promise<PontoTuristico[]> {
    const where: Prisma.PontoTuristicoWhereInput = {};

    if (query) {
      where.nome = {
        contains: query,
        mode: 'insensitive',
      };
    }

    if (categoriaIds && categoriaIds.length > 0) {
      where.categorias = {
        some: {
          id: { in: categoriaIds },
        },
      };
    }

    return this.prisma.pontoTuristico.findMany({
      where,
      include: { categorias: true },
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
          some: { nota: { gte: minNota } }, // Exemplo: pontos com alguma avaliação maior ou igual a minNota
        },
      },
      include: { avaliacoes: true, categorias: true },
    });
  }

  async buscarPorRegiao(enderecoParcial: string): Promise<PontoTuristico[]> {
    return this.prisma.pontoTuristico.findMany({
      where: {
        endereco: {
          contains: enderecoParcial,
          mode: 'insensitive', // Para busca case-insensitive no MongoDB
        },
      },
      include: { categorias: true },
    });
  }

async buscarMaisProximosComRaio(
  latitude: number,
  longitude: number,
  raioKm: number,
  limite: number
): Promise<PontoTuristico[]> {
  const raioEmMetros = raioKm * 1000;

  // O pipeline de agregação para o MongoDB
  const pipeline = [
    {
      // O estágio $geoNear encontra, filtra por distância máxima e ordena os documentos.
      $geoNear: {
        near: { type: "Point", coordinates: [longitude, latitude] },
        distanceField: "distanciaEmMetros", // Adiciona a distância ao documento
        maxDistance: raioEmMetros,          // Aplica o filtro de raio máximo
        spherical: false,
      },
    },
    {
      // O estágio $limit restringe o número de documentos retornados aos 'n' mais próximos.
      $limit: limite,
    },
  ];

  // Executa o pipeline de agregação na coleção 'PontoTuristico'
  const results: any = await this.prisma.pontoTuristico.aggregateRaw({
    pipeline: pipeline,
  });

  // Mapeia o resultado para o formato esperado, convertendo o _id
  if (results && results.length > 0) {
    const pontosTuristicos = results.map(doc => {
      const { _id, ...rest } = doc;
      return {
        ...rest,
        id: _id.$oid, // Converte o ObjectId do MongoDB para uma string
      };
    });
    return pontosTuristicos as PontoTuristico[];
  }

  return [];
}


  async buscarPorPreco(precoMax: number): Promise<PontoTuristico[]> {
    // Supondo que 'preco' seja um campo na Viagem relacionada.
    // Aqui estamos buscando PontoTuristico que *possuam* alguma Viagem com preço <= precoMax.
    return this.prisma.pontoTuristico.findMany({
      where: {
        viagens: {
          some: { preco: { lte: precoMax } }, // lte = less than or equal
        },
      },
      include: { viagens: true, categorias: true },
    });
  }
}
