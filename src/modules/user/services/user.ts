import UserEntity, { NovoUserEntityDTO } from "@/core/user/entities/userEntity";
import { User } from "@/core/user/interfaces/userInterface";
import { UserRepository } from "../repositories/user";

export class UserService {
  readonly apiUsers: UserRepository;

  constructor(readonly userRepository: UserRepository) {
    this.apiUsers = userRepository;
  }

  async authUser(email: string, password: string): Promise<UserEntity | null> {
    try {
      const dataUser = await this.getUserByEmail(email);
      if (!dataUser) {
        throw new Error("Email/senha incorreta.");
      }

      const comparePasswords = UserEntity.compareHash(dataUser.password, password);
      if (!comparePasswords) {
        throw new Error("Email/senha incorreta.");
      }

      await this.apiUsers.createToken(dataUser);
      return new UserEntity(dataUser);
    } catch (error) {
      console.error("Erro ao autenticar usuário:", error);
      throw new Error("Email/senha incorreta.");
    }
  }

  async createUser(novoUser: NovoUserEntityDTO): Promise<UserEntity> {
    try {
      const novoUsuario = UserEntity.criar(novoUser);
      const res = await this.apiUsers.createUser(novoUsuario);
      if (!res.id) {
        throw new Error("User creation response is missing an ID");
      }
      return novoUsuario;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Já existe um usuário cadastrado com este mesmo e-mail");
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const res = await this.apiUsers.getUserById(id);
      return res;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    try {
      const res = await this.apiUsers.getUserByEmail(email);
      return res;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}