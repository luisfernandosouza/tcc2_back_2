import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

//
// O módulo prisma é bem simples, ele apenas define o serviço prisma.
//
@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService]
})
export class PrismaModule {}