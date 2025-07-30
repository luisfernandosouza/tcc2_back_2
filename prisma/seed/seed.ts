import { PrismaClient, Categoria } from '@prisma/client';
import { CATEGORY_NAMES, PONTOS_TURISTICOS_DATA } from './data';

const prisma = new PrismaClient();

async function main() {
  console.log(`Iniciando o seeding...`);

  // --- 1. Limpa os dados existentes ---
  // A ordem importa para não violar as constraints de chave estrangeira
  await prisma.pontoTuristico.deleteMany();
  await prisma.categoria.deleteMany();
  console.log(`Dados existentes de Pontos Turísticos e Categorias foram deletados.`);

  // --- 2. Cria as categorias e guarda seus IDs em um mapa ---
  const categoriaMap = new Map<string, Categoria>();
  for (const name of CATEGORY_NAMES) {
    const categoria = await prisma.categoria.create({
      data: { categoria: name },
    });
    categoriaMap.set(name, categoria);
  }
  console.log(`Foram criadas ${categoriaMap.size} categorias.`);

  // --- 3. Cria os pontos turísticos e os conecta às categorias ---
  for (const pontoData of PONTOS_TURISTICOS_DATA) {
    // Separa os nomes das categorias do resto dos dados do ponto turístico
    const { categorias, ...pontoTuristicoData } = pontoData;

    // Encontra os IDs das categorias com base nos nomes
    const categoriaIds = categorias
      .map(name => categoriaMap.get(name)?.id)
      .filter((id): id is string => id !== undefined); // Garante que o array só tenha strings

    if (categoriaIds.length === 0) {
      console.warn(`Atenção: Nenhum ID de categoria válido encontrado para o ponto "${pontoData.nome}".`);
      continue; // Pula este ponto turístico se não tiver categorias válidas
    }

    // Cria o ponto turístico no banco de dados
    await prisma.pontoTuristico.create({
      data: {
        // Usa o spread operator para passar todos os campos (nome, descricao, endereco, location)
        ...pontoTuristicoData,
        // Conecta o ponto turístico às suas categorias correspondentes
        categorias: {
          connect: categoriaIds.map(id => ({ id })),
        },
      },
    });
  }
  console.log(`Foram criados ${PONTOS_TURISTICOS_DATA.length} pontos turísticos.`);

}

main()
  .catch((e) => {
    console.error('Ocorreu um erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Seeding finalizado.');
    await prisma.$disconnect();
  });
