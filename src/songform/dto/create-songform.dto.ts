import {
  IsString,
  IsDate,
  IsArray,
  IsNotEmpty,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SongItemDto {
  @IsString()
  url: string;

  @IsString()
  lyricOrder: string;

  @IsString()
  imageName: string;

  @IsString()
  title: string;
}

export class CreateSongformDto {
  @IsString()
  describe: string;

  @IsDate()
  @Type(() => Date)
  singdate: Date;

  @IsString()
  @IsNotEmpty()
  creatorPid: string;

  @IsBoolean()
  kind: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SongItemDto)
  songList: SongItemDto[];
}
