import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
  UseGuards, // Para proteger rotas
  ConflictException, // Para lidar com erros de conflito
} from '@nestjs/common';
import { PontoTuristicoService } from './pontos-turisticos.service';
import { CreatePontoTuristicoDto } from './dto/create-ponto-turistico.dto';
import { UpdatePontoTuristicoDto } from './dto/update-ponto-turistico.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Importe seu guardião JWT

@ApiTags('Pontos Turísticos')
@Controller('pontos-turisticos')
export class PontoTuristicoController {
  constructor(private readonly pontoTuristicoService: PontoTuristicoService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Proteger esta rota (requer JWT)
  @ApiBearerAuth() // Indica que esta rota requer autenticação Bearer (para Swagger)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo ponto turístico' })
  @ApiResponse({ status: 201, description: 'O ponto turístico foi criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @ApiResponse({ status: 404, description: 'Uma ou mais categorias não foram encontradas.' })
  async create(@Body() createPontoTuristicoDto: CreatePontoTuristicoDto) {
    return this.pontoTuristicoService.create(createPontoTuristicoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Recupera todos os pontos turísticos' })
  @ApiResponse({ status: 200, description: 'Retorna todos os pontos turísticos.' })
  findAll() {
    return this.pontoTuristicoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recupera um ponto turístico por ID' })
  @ApiResponse({ status: 200, description: 'Retorna o ponto turístico.' })
  @ApiResponse({ status: 404, description: 'Ponto turístico não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.pontoTuristicoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) // Proteger esta rota
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza um ponto turístico existente' })
  @ApiResponse({ status: 200, description: 'O ponto turístico foi atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Ponto turístico ou categoria não encontrada.' })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  update(@Param('id') id: string, @Body() updatePontoTuristicoDto: UpdatePontoTuristicoDto) {
    return this.pontoTuristicoService.update(id, updatePontoTuristicoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Proteger esta rota
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Exclui um ponto turístico por ID' })
  @ApiResponse({ status: 204, description: 'O ponto turístico foi excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Ponto turístico não encontrado.' })
  remove(@Param('id') id: string) {
    return this.pontoTuristicoService.remove(id);
  }

  // --- Endpoints de Busca Adicionais (Baseados no seu diagrama original) ---

  @Get('search/by-category/:categoryId')
  @ApiOperation({ summary: 'Busca pontos turísticos por categoria' })
  @ApiResponse({ status: 200, description: 'Retorna pontos turísticos da categoria especificada.' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada.' })
  buscarPorCategoria(@Param('categoryId') categoryId: string) {
    // Você pode adicionar uma validação para verificar se a categoria existe
    return this.pontoTuristicoService.buscarPorCategoria(categoryId);
  }

  @Get('search/by-min-rating/:minNota')
  @ApiOperation({ summary: 'Busca pontos turísticos por avaliação mínima' })
  @ApiQuery({ name: 'minNota', type: Number, description: 'Nota mínima para a avaliação (ex: 4)' })
  @ApiResponse({ status: 200, description: 'Retorna pontos turísticos com avaliação mínima.' })
  buscarPorAvaliacao(@Param('minNota') minNota: number) {
    return this.pontoTuristicoService.buscarPorAvaliacao(+minNota); // Converter para número
  }

  @Get('search/by-region')
  @ApiOperation({ summary: 'Busca pontos turísticos por região/endereço' })
  @ApiQuery({ name: 'enderecoParcial', type: String, description: 'Parte do endereço ou nome da cidade/bairro' })
  @ApiResponse({ status: 200, description: 'Retorna pontos turísticos da região especificada.' })
  buscarPorRegiao(@Query('enderecoParcial') enderecoParcial: string) {
    return this.pontoTuristicoService.buscarPorRegiao(enderecoParcial);
  }

  @Get('search/by-coordinates')
  @ApiOperation({ summary: 'Busca pontos turísticos por coordenadas (requer lógica avançada para raio)' })
  @ApiQuery({ name: 'latitude', type: Number, description: 'Latitude do ponto central' })
  @ApiQuery({ name: 'longitude', type: Number, description: 'Longitude do ponto central' })
  @ApiQuery({ name: 'raioKm', type: Number, description: 'Raio de busca em quilômetros' })
  @ApiResponse({ status: 200, description: 'Retorna pontos turísticos próximos às coordenadas.' })
  buscarPorCoordenadas(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('raioKm') raioKm: number,
  ) {
    // Converter para números, pois os parâmetros de query são strings
    return this.pontoTuristicoService.buscarPorCoordenadas(+latitude, +longitude, +raioKm);
  }

  @Get('search/by-max-price/:precoMax')
  @ApiOperation({ summary: 'Busca pontos turísticos por preço máximo de viagem' })
  @ApiQuery({ name: 'precoMax', type: Number, description: 'Preço máximo para a viagem' })
  @ApiResponse({ status: 200, description: 'Retorna pontos turísticos com preço de viagem abaixo do máximo.' })
  buscarPorPreco(@Param('precoMax') precoMax: number) {
    return this.pontoTuristicoService.buscarPorPreco(+precoMax); // Converter para número
  }
}