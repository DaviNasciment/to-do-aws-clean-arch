import UserEntity from '@/core/user/entities/userEntity';
import { User } from '@/core/user/interfaces/userInterface';

export interface UserRepository {
  createToken(data: User): Promise<void>;
  authUser(email: string, password: string): Promise<User | null>
  createUser(user: User): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<UserEntity | null>;
  updateUser(user: User): Promise<User | null>;
  deleteUser(id: string): Promise<void>;
}
