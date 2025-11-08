import { Entity, Column, ObjectIdColumn, ObjectId, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('roles')
export class Role {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  name: string; // Ej: 'admin', 'user', 'moderator'

  @Column()
  description: string;

  @Column('simple-array')
  permissions: string[]; // Array de permisos asociados al rol

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
