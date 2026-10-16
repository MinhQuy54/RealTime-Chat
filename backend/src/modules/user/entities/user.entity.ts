
import { BaseEntity } from 'src/common/base/base-entity.base';
import { RoleSettingEntity } from 'src/modules/core/auth/entities/role_settings.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'username', unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'hashed_password' })
    hashedPassword: string;

    @Column({ name: 'display_name' })
    displayName: string;

    @Column({ name: 'avatar_url', nullable: true })
    avatarUrl?: string;

    @Column({ name: 'bio', nullable: true })
    bio?: string;

    @Column({ nullable: true })
    phone?: string;

    @ManyToOne(() => RoleSettingEntity, (roleSetting) => roleSetting.users)
    @JoinColumn({ name: 'role_setting_id' })
    roleSetting?: RoleSettingEntity;
}
