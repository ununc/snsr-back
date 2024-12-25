import { PartialType } from '@nestjs/mapped-types';
import { CreateSongformDto } from './create-songform.dto';

export class UpdateSongformDto extends PartialType(CreateSongformDto) {
  updaterPid: string;
}
