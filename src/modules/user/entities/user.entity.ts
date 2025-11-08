import { Entity, Column, ObjectIdColumn, ObjectId, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string; // Hash de la contraseña (será validado por el API Gateway)

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column('simple-array')
  roles: string[]; // Array de IDs de roles o nombres de roles

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  lastLogin: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
