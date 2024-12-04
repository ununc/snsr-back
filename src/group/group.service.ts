import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UserInfo } from 'src/auth/entities/user-info.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    const newGroup = this.groupRepository.create(createGroupDto);
    const savedGroup = await this.groupRepository.save(newGroup);

    if (savedGroup.user_pid_list?.length) {
      const users = await this.userInfoRepository.findBy({
        pid: In(savedGroup.user_pid_list),
      });
      await Promise.all(
        users.map((user) => {
          user.role_list = [...(user.role_list || []), savedGroup.id];
          return this.userInfoRepository.save(user);
        }),
      );
    }

    return savedGroup;
  }

  findAll() {
    return this.groupRepository.find();
  }

  findOne(id: string) {
    return this.groupRepository.findOne({ where: { id } });
  }

  async update(id: string, updateGroupDto: Partial<CreateGroupDto>) {
    const existingGroup = await this.groupRepository.findOne({ where: { id } });
    if (!existingGroup) {
      throw new Error('Group not found');
    }

    const removedUserPids = existingGroup.user_pid_list.filter(
      (pid) => !updateGroupDto.user_pid_list?.includes(pid),
    );

    const addedUserPids =
      updateGroupDto.user_pid_list?.filter(
        (pid) => !existingGroup.user_pid_list.includes(pid),
      ) || [];

    const updatedGroup = await this.groupRepository.save({
      ...existingGroup,
      ...updateGroupDto,
    });

    if (removedUserPids.length) {
      const removedUsers = await this.userInfoRepository.findBy({
        pid: In(removedUserPids),
      });

      await Promise.all(
        removedUsers.map((user) => {
          user.role_list = user.role_list.filter((groupId) => groupId !== id);
          return this.userInfoRepository.save(user);
        }),
      );
    }

    if (addedUserPids.length) {
      const addedUsers = await this.userInfoRepository.findBy({
        pid: In(addedUserPids),
      });

      await Promise.all(
        addedUsers.map((user) => {
          user.role_list = [...(user.role_list || []), id];
          return this.userInfoRepository.save(user);
        }),
      );
    }

    return updatedGroup;
  }

  async remove(id: string) {
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) {
      throw new Error('Group not found');
    }

    if (group.user_pid_list?.length) {
      const users = await this.userInfoRepository.findBy({
        pid: In(group.user_pid_list),
      });

      await Promise.all(
        users.map((user) => {
          user.role_list = user.role_list.filter((groupId) => groupId !== id);
          return this.userInfoRepository.save(user);
        }),
      );
    }
    return this.groupRepository.remove(group);
  }
}
