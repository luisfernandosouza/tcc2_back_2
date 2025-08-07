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
  UseGuards,
} from '@nestjs/common';
import { AvaliacaoService } from './avaliacao.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Avaliações')
@Controller('avaliacoes')
export class AvaliacaoController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova avaliação' })
  @ApiResponse({ status: 201, description: 'Avaliação criada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário ou Ponto Turístico não encontrado.' })
  async create(@Body() createAvaliacaoDto: CreateAvaliacaoDto) {
    return this.avaliacaoService.create(createAvaliacaoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todas as avaliações' })
  @ApiResponse({ status: 200, description: 'Lista de avaliações.' })
  findAll() {
    return this.avaliacaoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna uma avaliação por ID' })
  @ApiResponse({ status: 200, description: 'Avaliação encontrada.' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.avaliacaoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza uma avaliação existente' })
  @ApiResponse({ status: 200, description: 'Avaliação atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada.' })
  update(@Param('id') id: string, @Body() updateAvaliacaoDto: UpdateAvaliacaoDto) {
    return this.avaliacaoService.update(id, updateAvaliacaoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Exclui uma avaliação por ID' })
  @ApiResponse({ status: 204, description: 'Avaliação excluída com sucesso.' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada.' })
  remove(@Param('id') id: string) {
    return this.avaliacaoService.remove(id);
  }
}