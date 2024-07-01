import UserEntity from "@/core/user/entities/userEntity";

export interface UserRepository {
    createUser(user: UserEntity): Promise<UserEntity>;
    getUserByEmail(email: string): Promise<UserEntity | null>;
    getUserById(id: string): Promise<UserEntity | null>;
    getUserByIdAuthenticated(idAuthenticated: string): Promise<UserEntity | null>;
}