import { Task } from "@/core/task/interfaces/taskInterface";
import { TaskRepository } from "../../repositories/task";
import TaskEntity from "@/core/task/entities/taskEntity";


export class ApiTask implements TaskRepository {
  async createTask(task: Task): Promise<TaskEntity> {
    const res = await fetch("/api/task/createTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const createdTask: { data: Task } = await res.json();

    return createdTask.data;
  }

  async getAllTasksByUid(uid: string): Promise<TaskEntity[]> {
    const res = await fetch("/api/task/getAllTasksByUid?uid=" + uid, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const tasksObtaineds: TaskEntity[] = (await res.json()).data;

    const taskMounted = tasksObtaineds.map(task =>
      TaskEntity.montar({
        id: task.id,
        uid: task.uid,
        task: task.task,
        createdAt: task.createdAt,
        concludedAt: task.concludedAt,
        completed: task.completed,
      })
    );

    return taskMounted;
  }

  async deleteTask(taskId: string): Promise<void> {
    const res = await fetch("/api/task/deleteTask?id=" + taskId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      console.log("Task deletado com sucesso.")
    }
  }
  async updateTask(task: Task): Promise<TaskEntity> {
    const res = await fetch("/api/task/updateTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const updatedTask: { data: Task } = await res.json();

    return updatedTask.data;
  }
}