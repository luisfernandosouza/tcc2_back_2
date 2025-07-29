import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService] // Export if other modules (e.g., PontoTuristico) need to interact with CategoriesService
})
export class CategoriesModule {}