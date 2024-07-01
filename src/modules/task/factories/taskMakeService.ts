import { ApiTask } from "../infrastructure/api/task";
import { TaskService } from "../services/task";

export const taskMakeService = (): TaskService => {
  const repository = new ApiTask();
  const service = new TaskService(repository);
  return service;
};
