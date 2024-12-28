import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { CreateSongformDto } from './dto/create-songform.dto';
import { UpdateSongformDto } from './dto/update-songform.dto';
import { Songform } from './entities/songform.entity';
import { UserInfo } from 'src/auth/entities/user-info.entity';
import { SongItemWithNames } from './songform.controller';

@Injectable()
export class SongformService {
  constructor(
    @InjectRepository(Songform)
    private readonly songformRepository: Repository<Songform>,
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
  ) {}

  async create(createSongformDto: CreateSongformDto) {
    const songform = new Songform();
    songform.kind = createSongformDto.kind;
    songform.describe = createSongformDto.describe;
    songform.singdate = createSongformDto.singdate;
    songform.creatorPid = createSongformDto.creatorPid;
    songform.songList = createSongformDto.songList.map((item) => ({
      url: item.url,
      lyricOrder: item.lyricOrder,
      imageName: item.imageName,
      title: item.title,
    }));

    return await this.songformRepository.save(songform);
  }

  findAll() {
    return this.songformRepository.find();
  }

  async findOne(id: string): Promise<SongItemWithNames> {
    const result = await this.songformRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('찾을 수 없는 송폼입니다.');
    }

    const songform = {
      ...result,
      creatorName: '',
      updaterName: '',
    };
    // creatorPid와 updaterPid에 해당하는 UserInfo 조회
    const [creator, updater] = await Promise.all([
      songform.creatorPid
        ? this.userInfoRepository.findOne({
            select: {
              name: true,
              pid: true,
            },
            where: { pid: songform.creatorPid },
          })
        : null,
      songform.updaterPid
        ? this.userInfoRepository.findOne({
            select: {
              name: true,
              pid: true,
            },
            where: { pid: songform.updaterPid },
          })
        : null,
    ]);
    if (creator?.name) {
      songform.creatorName = creator.name;
    }
    if (updater?.name) {
      songform.updaterName = updater.name;
    }
    return songform;
  }

  async findByMonth(
    kind: boolean,
    yearMonth: string,
  ): Promise<SongItemWithNames[]> {
    // 1. 먼저 송폼 목록을 조회합니다
    const results = await this.songformRepository.find({
      select: {
        id: true,
        singdate: true,
        createdAt: true,
        creatorPid: true,
        updatedAt: true,
        updaterPid: true,
      },
      where: {
        kind,
        singdate: Between(
          new Date(`${yearMonth}-01`),
          new Date(
            new Date(`${yearMonth}-01`).getFullYear(),
            new Date(`${yearMonth}-01`).getMonth() + 1,
            0,
            23,
            59,
            59,
            999,
          ),
        ),
      },
      order: {
        createdAt: 'ASC',
      },
    });

    // 2. 모든 유니크한 pid 목록을 추출합니다
    const uniquePids = [
      ...new Set(
        results.flatMap((song) =>
          [song.creatorPid, song.updaterPid].filter(Boolean),
        ),
      ),
    ];

    // 3. 한 번의 쿼리로 모든 필요한 유저 정보를 조회합니다
    const userInfos =
      uniquePids.length > 0
        ? await this.userInfoRepository.find({
            select: {
              name: true,
              pid: true,
            },
            where: {
              pid: In(uniquePids),
            },
          })
        : [];

    // 4. pid로 빠르게 검색하기 위해 Map으로 변환합니다
    const userMap = new Map(userInfos.map((user) => [user.pid, user.name]));

    // 5. 각 송폼에 유저 이름을 추가합니다
    return results.map((song) => ({
      ...song,
      creatorName: song.creatorPid ? userMap.get(song.creatorPid) || '' : '',
      updaterName: song.updaterPid ? userMap.get(song.updaterPid) || '' : '',
    }));
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
