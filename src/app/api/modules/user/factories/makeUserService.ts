import { UserDynamoDBRepository } from "../infra/repository/UserDynamoDBRepository";
import { UserService } from "../infra/service/userService";

export const makeUserService = (): { userService: UserService } => {
    const userDynamoDBRepository = new UserDynamoDBRepository();
    const userService = new UserService(userDynamoDBRepository);
    return {
        userService
    };
}