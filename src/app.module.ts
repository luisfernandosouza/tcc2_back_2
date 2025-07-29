import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoriesModule } from './categories/categories.module';
import { PontosTuristicosModule } from './pontos-turisticos/pontos-turisticos.module';

@Module({
  imports: [UserModule, AuthModule, CategoriesModule, PontosTuristicosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
