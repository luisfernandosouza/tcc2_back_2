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
import { PreferenciaService } from './preferencias.service';
import { CreatePreferenciaDto } from './dto/create-preferencia.dto';
import { UpdatePreferenciaDto } from './dto/update-preferencia.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Preferências')
@Controller('preferencias')
export class PreferenciaController {
  constructor(private readonly preferenciaService: PreferenciaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova preferência' })
  @ApiResponse({ status: 201, description: 'Preferencia criada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário ou Ponto Turístico não encontrado.' })
  async create(@Body() createPreferenciaDto: CreatePreferenciaDto) {
    return this.preferenciaService.create(createPreferenciaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todas as preferências' })
  @ApiResponse({ status: 200, description: 'Lista de preferências.' })
  findAll() {
    return this.preferenciaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna uma preferência por ID' })
  @ApiResponse({ status: 200, description: 'Preferencia encontrada.' })
  @ApiResponse({ status: 404, description: 'Preferencia não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.preferenciaService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza uma preferência existente' })
  @ApiResponse({ status: 200, description: 'Preferencia atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Preferencia não encontrada.' })
  update(@Param('id') id: string, @Body() updatePreferenciaDto: UpdatePreferenciaDto) {
    return this.preferenciaService.update(id, updatePreferenciaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Exclui uma preferência por ID' })
  @ApiResponse({ status: 204, description: 'Preferencia excluída com sucesso.' })
  @ApiResponse({ status: 404, description: 'Preferencia não encontrada.' })
  remove(@Param('id') id: string) {
    return this.preferenciaService.remove(id);
  }
}