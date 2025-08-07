import { PartialType } from '@nestjs/swagger';
import { CreateAvaliacaoDto } from './create-avaliacao.dto';

// PartialType torna todos os campos de CreateAvaliacaoDto opcionais
export class UpdateAvaliacaoDto extends PartialType(CreateAvaliacaoDto) {}
