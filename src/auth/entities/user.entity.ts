import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { UserInfo } from './user-info.entity';

/**
이 클래스가 데이터베이스의 테이블과 매핑되는 엔티티임을 나타냅니다.
TypeORM이 이 클래스를 기반으로 데이터베이스 테이블을 생성하거나 조작합니다.
*/
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  pid: string;

  @Column({ unique: true })
  id: string;

  @Column()
  password: string;

  /**
  User 엔티티와 UserInfo 엔티티 간의 일대일(1:1) 관계를 정의합니다
  */
  @OneToOne(() => UserInfo, (userInfo) => userInfo.user)
  userInfo: UserInfo;
  /**
  userInfo라는 이름의 속성을 정의하며, 타입은 UserInfo 엔티티입니다.
  이 속성을 통해 연관된 UserInfo 엔티티에 접근할 수 있습니다.
  */
}
