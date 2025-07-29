import { Module } from '@nestjs/common';
import { PontosTuristicosService } from './pontos-turisticos.service';
import { PontosTuristicosController } from './pontos-turisticos.controller';

@Module({
  controllers: [PontosTuristicosController],
  providers: [PontosTuristicosService],
})
export class PontosTuristicosModule {}
