import { Module } from '@nestjs/common';
import { PreferenciaService } from './preferencias.service';
import { PreferenciaController } from './preferencias.controller';

@Module({
  controllers: [PreferenciaController],
  providers: [PreferenciaService],
})
export class PreferenciasModule {}
