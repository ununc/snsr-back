import {
  IsString,
  IsDate,
  IsArray,
  IsNotEmpty,
  ValidateNested,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SongItemDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  lyricOrder: string;

  @IsString()
  @IsNotEmpty()
  imageName: string;
}

export class CreateSongformDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  describe: string;

  @IsDate()
  @Type(() => Date)
  singdate: Date;

  @IsString()
  @IsNotEmpty()
  creatorPid: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SongItemDto)
  songList: SongItemDto[];
}
