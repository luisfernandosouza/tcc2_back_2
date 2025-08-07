export const CATEGORY_NAMES = [
  'Esporte',
  'Parque',
  'Praia',
  'Orla',
  'Cultura',
  'História',
  'Gastronomia',
  'Lazer',
  'Natureza',
  'Passeios',
  'Ecoturismo',
  'Compras',
  'Artesanato',
  'Arquitetura',
  'Monumentos',
];

export const PONTOS_TURISTICOS_DATA = [
  {
    nome: 'Parque da Sementeira',
    descricao:
      'Um dos maiores parques urbanos de Aracaju, com áreas verdes, lagoas e espaços para lazer e atividades ao ar livre. É um local popular para caminhadas, piqueniques e eventos culturais.',
    endereco: 'Av. Sementeira, S/N - Sementeira, Aracaju - SE',
    location: {
      type: 'Point',
      coordinates: [-37.0628, -10.9445],
    },
    categorias: ['Parque', 'Lazer', 'Natureza', 'Cultura', 'Esporte'],
  },
  {
    nome: 'Orla de Atalaia',
    descricao:
      'Principal cartão-postal e centro de entretenimento de Aracaju, com 6 km de extensão...',
    endereco: 'Av. Santos Dumont, S/N - Atalaia, Aracaju - SE',
    location: {
      type: 'Point',
      coordinates: [-37.0379, -10.9783], // [longitude, latitude]
    },
    categorias: ['Praia', 'Orla', 'Lazer', 'Natureza', 'Gastronomia'],
  },
  {
    nome: 'Passarela do Caranguejo',
    descricao: 'Polo gastronômico vibrante localizado na Orla de Atalaia...',
    endereco: 'Av. Santos Dumont - Atalaia, Aracaju - SE, 49035-240',
    location: {
      type: 'Point',
      coordinates: [-37.0448, -10.9864],
    },
    categorias: ['Gastronomia', 'Orla'],
  },
  {
    nome: 'Oceanário de Aracaju (Projeto Tamar)',
    descricao:
      'Importante centro de conservação marinha, localizado na Orla de Atalaia...',
    endereco: 'Av. Santos Dumont, 1010 - Atalaia, Aracaju - SE, 49035-730',
    location: {
      type: 'Point',
      coordinates: [-37.0399, -10.9805],
    },
    categorias: ['Lazer', 'Natureza', 'Passeios', 'Ecoturismo', 'Orla'],
  },
  {
    nome: 'Museu da Gente Sergipana Governador Marcelo Déda',
    descricao:
      'Espaço cultural interativo e multimídia localizado no centro histórico...',
    endereco: 'Av. Ivo do Prado, 398 - Centro, Aracaju - SE, 49010-050',
    location: {
      type: 'Point',
      coordinates: [-37.0513, -10.9136],
    },
    categorias: ['Cultura', 'História'],
  },
  {
    nome: 'Mercados Centrais (Antônio Franco, Thales Ferraz e Albano Franco)',
    descricao:
      'Complexo de três mercados públicos interligados no centro da cidade...',
    endereco: 'Av. Simeão Sobral, S/N - Centro, Aracaju - SE, 49010-000',
    location: {
      type: 'Point',
      coordinates: [-37.0505, -10.9094],
    },
    categorias: ['Cultura', 'História', 'Compras', 'Artesanato', 'Gastronomia'],
  },
  {
    nome: 'Largo da Gente Sergipana',
    descricao: 'Praça revitalizada em frente ao Museu da Gente Sergipana...',
    endereco: 'Av. Ivo do Prado, S/N - Centro, Aracaju - SE, 49010-050',
    location: {
      type: 'Point',
      coordinates: [-37.0516, -10.913],
    },
    categorias: ['Cultura', 'História', 'Arquitetura', 'Monumentos'],
  },
  {
    nome: 'Catedral Metropolitana de Aracaju',
    descricao:
      'Principal templo católico da cidade, localizado no coração do centro histórico...',
    endereco: 'Praça Olímpio Campos, S/N - Centro, Aracaju - SE, 49010-040',
    location: {
      type: 'Point',
      coordinates: [-37.051, -10.9153],
    },
    categorias: ['Cultura', 'História', 'Arquitetura', 'Monumentos'],
  },
  {
    nome: 'Colina do Santo Antônio',
    descricao:
      'Considerado o marco zero da cidade, este é um dos pontos mais altos de Aracaju...',
    endereco:
      'Ladeira do Santo Antônio - Santo Antônio, Aracaju - SE, 49060-300',
    location: {
      type: 'Point',
      coordinates: [-37.0609, -10.906],
    },
    categorias: ['Cultura', 'História', 'Lazer', 'Natureza'],
  },
  {
    nome: 'Orla Pôr do Sol',
    descricao:
      'Localizada na Praia do Mosqueiro, às margens do Rio Vaza-Barris...',
    endereco: 'Rod. Inácio Barbosa, S/N - Mosqueiro, Aracaju - SE, 49039-100',
    location: {
      type: 'Point',
      coordinates: [-37.1069, -11.0298],
    },
    categorias: ['Orla', 'Lazer', 'Natureza', 'Passeios', 'Ecoturismo'],
  },
  {
    nome: 'Crôa do Goré',
    descricao:
      'Um encantador banco de areia que emerge no meio do Rio Vaza-Barris...',
    endereco: 'Rio Vaza-Barris, Aracaju - SE',
    location: {
      type: 'Point',
      coordinates: [-37.0982, -11.0265],
    },
    categorias: ['Passeios', 'Ecoturismo', 'Lazer', 'Natureza'],
  },
  {
    nome: 'Arcos da Orla de Atalaia',
    descricao:
      'Estrutura icônica composta por arcos coloridos na Orla de Atalaia...',
    endereco: 'Av. Santos Dumont, S/N - Atalaia, Aracaju - SE',
    location: {
      type: 'Point',
      coordinates: [-37.0385, -10.98],
    },
    categorias: ['Orla', 'Arquitetura', 'Monumentos'],
  },
  {
    nome: 'Feira do Turista de Aracaju',
    descricao: 'Espaço comercial localizado na Orla de Atalaia...',
    endereco: 'Av. Santos Dumont, 1813 - Atalaia, Aracaju - SE, 49037-475',
    location: {
      type: 'Point',
      coordinates: [-37.0427, -10.9835],
    },
    categorias: ['Compras', 'Artesanato', 'Orla'],
  },
  {
    nome: 'Ponte Construtor João Alves (Aracaju-Barra dos Coqueiros)',
    descricao:
      'Imponente ponte estaiada que liga Aracaju ao município de Barra dos Coqueiros...',
    endereco: 'Ponte Construtor João Alves - Aracaju/Barra dos Coqueiros, SE',
    location: {
      type: 'Point',
      coordinates: [-37.0444, -10.8958],
    },
    categorias: ['Arquitetura', 'Monumentos'],
  },
  {
    nome: 'Praia do Mosqueiro',
    descricao:
      'Uma das praias mais ao sul de Aracaju, conhecida por sua tranquilidade...',
    endereco: 'Rodovia Inácio Barbosa - Mosqueiro, Aracaju - SE',
    location: {
      type: 'Point',
      coordinates: [-37.1134, -11.0388],
    },
    categorias: ['Praia', 'Lazer', 'Natureza'],
  },
];
