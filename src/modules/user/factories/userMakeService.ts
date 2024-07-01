import { UserService } from "../services/user";
import { ApiUser } from "../infrastructure/api/user";

export const userMakeService = (): UserService => {
  const repository = new ApiUser();
  const service = new UserService(repository);
  return service;
};
