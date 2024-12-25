import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSongformDto } from './dto/create-songform.dto';
import { UpdateSongformDto } from './dto/update-songform.dto';
import { Songform } from './entities/songform.entity';

@Injectable()
export class SongformService {
  constructor(
    @InjectRepository(Songform)
    private songformRepository: Repository<Songform>,
  ) {}

  create(createSongformDto: CreateSongformDto) {
    const songform = this.songformRepository.create(createSongformDto);
    return this.songformRepository.save(songform);
  }

  findAll() {
    return this.songformRepository.find();
  }

  findOne(id: string) {
    return this.songformRepository.findOneBy({ id });
  }

  async update(id: string, updateSongformDto: UpdateSongformDto) {
    const songform = await this.songformRepository.findOneBy({ id });
    if (!songform) {
      throw new Error('Songform not found');
    }

    Object.assign(songform, updateSongformDto);
    return this.songformRepository.save(songform);
  }

  async remove(id: string) {
    const songform = await this.songformRepository.findOneBy({ id });
    if (!songform) {
      throw new Error('Songform not found');
    }
    return this.songformRepository.remove(songform);
  }
}
