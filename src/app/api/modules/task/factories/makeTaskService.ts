import { TaskService } from "@/modules/task/services/task";
import { TaskDynamoDBRepository } from "../infra/repository/taskDynamoDBRepository";

export const makeTaskService = (): { taskService: TaskService } => {
    const taskDynamoDBRepository = new TaskDynamoDBRepository();
    const taskService = new TaskService(taskDynamoDBRepository);
    return {
        taskService
    };
}