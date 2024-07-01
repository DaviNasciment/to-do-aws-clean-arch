import TaskEntity from "@/core/task/entities/taskEntity";
import { Task } from "@/core/task/interfaces/taskInterface";
import { TaskRepository } from "@/modules/task/repositories/task";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand,
    UpdateCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);

export class TaskDynamoDBRepository implements TaskRepository {
    private tableName = "tasks";

    async createTask(task: Task): Promise<Task> {
        const params = {
            TableName: this.tableName,
            Item: {
                id: task.id,
                uid: task.uid,
                task: task.task,
                completed: task.completed,
                createdAt: task.createdAt
            },
        };

        await ddbDocClient.send(new PutCommand(params));
        return task;
    }
    async getAllTasksByUid(uid: string): Promise<TaskEntity[]> {
        const params = {
            TableName: this.tableName,
            IndexName: "uid-index",
            KeyConditionExpression: "uid = :uid",
            ExpressionAttributeValues: {
                ":uid": uid
            },
        };

        const result = await ddbDocClient.send(new QueryCommand(params));
        return result.Items as TaskEntity[];
    }
    async deleteTask(taskId: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                id: taskId
            },
        };

        await ddbDocClient.send(new DeleteCommand(params));
    }

    async updateTask(task: Task): Promise<TaskEntity> {
        const params = {
            TableName: this.tableName,
            Key: {
                id: task.id
            },
            UpdateExpression: "set task = :task, completed = :completed",
            ExpressionAttributeValues: {
                ":task": task.task,
                ":completed": task.completed,
            },
            ReturnValues: "ALL_NEW" as const
        };

        const result = await ddbDocClient.send(new UpdateCommand(params));
        return result.Attributes as TaskEntity;
    }
}
