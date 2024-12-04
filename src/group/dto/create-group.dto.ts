import { IsString, IsArray } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsArray()
  user_pid_list: string[];

  @IsArray()
  menu_id_list: string[];
}
