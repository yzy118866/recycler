// models/UserRegisterWithRole.ts
import { UserRegister } from 'src/client';
import { RoleEnum } from './RoleEnum';

export interface UserRegisterWithRole extends UserRegister {
  role: RoleEnum | null;
}