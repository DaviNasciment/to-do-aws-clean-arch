import TaskEntity from "@/core/task/entities/taskEntity";
import { Task } from "@/core/task/interfaces/taskInterface";
import { TaskRepository } from "@/modules/task/repositories/task";

export class TaskService implements TaskRepository {

    constructor(readonly taskRepository: TaskRepository) { }

    async createTask(task: Task): Promise<TaskEntity> {
        return await this.taskRepository.createTask(task);
    }
    async getAllTasksByUid(uid: string): Promise<TaskEntity[]> {
        return await this.taskRepository.getAllTasksByUid(uid);
    }
    async deleteTask(taskId: string): Promise<void> {
        return await this.taskRepository.deleteTask(taskId);
    }
    async updateTask(task: Task): Promise<TaskEntity> {
        return await this.taskRepository.updateTask(task)
    }
}
