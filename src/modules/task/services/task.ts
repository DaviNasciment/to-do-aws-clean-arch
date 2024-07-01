import { Task } from "@/core/task/interfaces/taskInterface";
import { TaskRepository } from "../repositories/task";
import TaskEntity from "@/core/task/entities/taskEntity";

export class TaskService {
  private readonly apiTask: TaskRepository;

  constructor(private readonly taskRepository: TaskRepository) {
    this.apiTask = this.taskRepository;
  }

  async createTask(task: Task): Promise<TaskEntity> {
    try {
      const newTask = TaskEntity.criar(task)
      const res = await this.apiTask.createTask(newTask)

      if (!res.id) {
        throw new Error("Task creation response is missing an ID");
      }

      return newTask;
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error("Erro ao criar task");
    }
  }
  async getAllTasksByUid(uid: string): Promise<TaskEntity[]> {
    try {
      const res = await this.apiTask.getAllTasksByUid(uid)
      return res
    } catch (error) {
      console.error("Error getting task:", error);
      throw new Error("Erro ao pegar todas as task");
    }
  }
  async deleteTask(taskId: string): Promise<void> {
    try {
      await this.apiTask.deleteTask(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Erro ao deletar task");
    }
  }
  async updateTask(task: Task): Promise<TaskEntity> {
    try {
      const newTask = TaskEntity.criar(task)
      const res = await this.apiTask.updateTask(newTask)

      if (!res.id) {
        throw new Error("Task update response is missing an ID");
      }

      return newTask;
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error("Erro ao atualizar task");
    }
  }
}