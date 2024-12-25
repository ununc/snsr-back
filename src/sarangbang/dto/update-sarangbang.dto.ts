import { PartialType } from '@nestjs/mapped-types';
import { CreateSarangBangDto } from './create-sarangbang.dto';

export class UpdateSarangBangDto extends PartialType(CreateSarangBangDto) {}
