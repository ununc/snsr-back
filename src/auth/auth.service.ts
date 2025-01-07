import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserInfo } from './entities/user-info.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { Menu } from 'src/menu/entities/menu.entity';
import { Group } from 'src/group/entities/group.entity';

const targetGroupNames = [
  '목사님',
  '부장집사님',
  '대표리더',
  '새가족국장',
  '미디어국장',
  '예배국장',
  '찬양국장',
  '행사국장',
  '총괄국회계',
];

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { id, password, ...userInfoData } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({ id, password: hashedPassword });
    await this.userRepository.save(user);

    const userInfo = this.userInfoRepository.create({
      ...userInfoData,
      user,
      role_list: [],
    });
    await this.userInfoRepository.save(userInfo);
    delete userInfo.user;
    return userInfo;
  }

  async signIn(signInDto: SignInDto) {
    const { id, password } = signInDto;
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userInfo'],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userInfo = user.userInfo;
    const { roleNames, menuList } = await this.getRoleMenuListSet(
      userInfo.role_list,
    );

    const payload = { sub: user.pid, username: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      userInfo,
      roleNames,
      menuList,
    };
  }

  async resetPassword(id: string) {
    // 비밀번호 암호화 (기존 회원가입에서 사용하는 것과 동일한 방식으로)
    const hashedPassword = await bcrypt.hash('1234567', 10);

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 비밀번호 업데이트
    user.password = hashedPassword;
    await this.userRepository.save(user);

    return {
      message: '비밀번호가 성공적으로 초기화되었습니다.',
    };
  }

  async getNewRoleMenu(pid: string) {
    const userInfo = await this.userInfoRepository.findOne({
      where: { pid },
    });

    return await this.getRoleMenuListSet(userInfo.role_list);
  }

  async getRoleMenuListSet(role_list: string[]) {
    const groupList = await this.groupRepository.findBy({
      id: In(role_list),
    });

    const allMenuIds = [];
    const roleNames = [];
    for (const group of groupList) {
      allMenuIds.push(...group.menu_id_list);
      roleNames.push({ name: group.name, id: group.id });
    }

    const uniqueMenuIds = [...new Set(allMenuIds)];
    const menus = await this.menuRepository.findBy({
      id: In(uniqueMenuIds),
    });

    // description과 owner가 모두 있는 메뉴만 그룹화 및 권한 통합
    const menuMap = new Map();

    menus.forEach((menu) => {
      if (!menu.owner) {
        // owner가 없는 메뉴는 그대로 유지
        menuMap.set(menu.id, menu);
        return;
      }

      const key = `${menu.description}-${menu.owner}`;
      const existingMenu = menuMap.get(key);

      if (!existingMenu) {
        menuMap.set(key, menu);
      } else {
        // 둘 중 하나라도 쓰기 권한이 있으면 true로 설정
        existingMenu.can_write = existingMenu.can_write || menu.can_write;
      }
    });
    return {
      roleNames,
      menuList: Array.from(menuMap.values()),
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({ where: { pid: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );
    user.password = hashedNewPassword;
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  async updateUserInfo(updateUserInfoDto: UpdateUserInfoDto) {
    const userInfo = await this.userInfoRepository.findOne({
      where: { pid: updateUserInfoDto.pid },
    });
    if (!userInfo) {
      throw new NotFoundException('User info not found');
    }

    Object.assign(userInfo, updateUserInfoDto);
    await this.userInfoRepository.save(userInfo);

    return userInfo;
  }

  async remove(pid: string) {
    const userInfo = await this.userInfoRepository.findOne({
      where: { pid },
      relations: ['user'],
    });

    if (userInfo?.user) {
      // User만 삭제하면 UserInfo의 user_pid는 자동으로 null이 됩니다
      await this.userRepository.delete(userInfo.user.pid);
    }
  }

  async findAll() {
    return this.userInfoRepository.find();
  }

  async findRelativeAddress(daechung: boolean, sarang: string) {
    let targetGroups = targetGroupNames;
    if (sarang !== '새가족') {
      targetGroups = [...targetGroupNames, '목양리더'];
    }
    const groups = await this.groupRepository.findBy({
      name: In(targetGroups),
    });

    const filtered = groups.filter((group) => group.user_pid_list.length);

    const result = await Promise.all(
      filtered.map(async (group) => {
        if (group.name === '목양리더' && sarang !== '새가족') {
          const leaders = await this.userInfoRepository.find({
            where: {
              pid: In(group.user_pid_list),
            },
            select: ['name', 'email', 'phone', 'daechung'],
          });
          const targetLeader = leaders.filter(
            (user) => user.name === sarang && user.daechung === daechung,
          );
          return {
            role: group.name,
            user: targetLeader,
          };
        }
        const userInfo = await this.userInfoRepository.find({
          where: {
            pid: In(group.user_pid_list),
          },
          select: ['name', 'email', 'phone', 'daechung'],
        });
        return {
          role: group.name,
          user: userInfo,
        };
      }),
    );

    return result.flat();
  }
}
