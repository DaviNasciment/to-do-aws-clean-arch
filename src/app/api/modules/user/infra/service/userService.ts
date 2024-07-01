import UserEntity from "@/core/user/entities/userEntity";
import { UserRepository } from "../../domain/repository/UserRepository";

export class UserService implements UserRepository {

    constructor(readonly userRepository: UserRepository) {}

    async createUser(userEntity: UserEntity): Promise<UserEntity> {
        return await this.userRepository.createUser(userEntity);
    }

    async getUserByEmail(email: string): Promise<UserEntity | null> {
        return await this.userRepository.getUserByEmail(email);
    }

    async getUserById(id: string): Promise<UserEntity | null> {
        return await this.userRepository.getUserById(id)
    }
    async getUserByIdAuthenticated(idAuthenticated: string): Promise<UserEntity | null> {
        return await this.userRepository.getUserByIdAuthenticated(idAuthenticated)
    }
}
