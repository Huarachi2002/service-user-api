import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectId,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ nullable: true})
  idPaciente?: number;

  @Column()
  nombreUsuario: string;

  @Column()
  contrasena: string; // Hash de la contraseña (será validado por el API Gateway)

  @Column()
  rol: Role;

  @Column({ nullable: true })
  tokenFcm?: string;

  @Column({ default: true })
  activo: boolean = true;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
