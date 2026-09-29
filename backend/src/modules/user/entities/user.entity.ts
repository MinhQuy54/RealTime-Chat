
import { BaseEntity } from 'src/common/base/base-entity.base';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'username' })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'hashed_password' })
    hashedPassword: string;

    @Column({ name: 'display_name' })
    displayName: string;

    @Column({ name: 'avatar_url' })
    avatarUrl: string;

    @Column({ name: 'bio' })
    bio: string;

    @Column({ nullable: true })
    phone?: string;
}
