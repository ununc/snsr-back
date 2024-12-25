import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SarangBang } from './entities/sarangbang.entity';
import { CreateSarangBangDto } from './dto/create-sarangbang.dto';
import { UpdateSarangBangDto } from './dto/update-sarangbang.dto';

@Injectable()
export class SarangBangService {
  constructor(
    @InjectRepository(SarangBang)
    private sarangBangRepository: Repository<SarangBang>,
  ) {}

  create(createSarangBangDto: CreateSarangBangDto) {
    const sarangBang = this.sarangBangRepository.create(createSarangBangDto);
    return this.sarangBangRepository.save(sarangBang);
  }

  findAll() {
    return this.sarangBangRepository.find();
  }

  findOne(id: string) {
    return this.sarangBangRepository.findOneBy({ id });
  }

  findByLeaderPid(leaderPid: string) {
    return this.sarangBangRepository.findOneBy({ leaderPid });
  }

  update(id: string, updateSarangBangDto: UpdateSarangBangDto) {
    return this.sarangBangRepository.update(id, updateSarangBangDto);
  }

  remove(id: string) {
    return this.sarangBangRepository.delete(id);
  }
}
