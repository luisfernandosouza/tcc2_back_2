import { PartialType } from '@nestjs/swagger';
import { CreatePreferenciaDto } from './create-preferencia.dto';

export class UpdatePreferenciaDto extends PartialType(CreatePreferenciaDto) {}
