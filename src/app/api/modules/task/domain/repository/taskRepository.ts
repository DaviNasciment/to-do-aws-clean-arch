import TaskEntity from "@/core/task/entities/taskEntity";
import { Task } from "@/core/task/interfaces/taskInterface";

export interface taskRepository {
    createTask(task: Task): Promise<TaskEntity>;
    getAllTasksByUid(uid: string): Promise<TaskEntity[]>;
    deleteTask(taskId: string): Promise<void>;
    updateTask(task: Task): Promise<TaskEntity>;
}