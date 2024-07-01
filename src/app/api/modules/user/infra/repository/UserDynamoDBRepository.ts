import UserEntity from "@/core/user/entities/userEntity";
import { UserRepository } from "../../domain/repository/UserRepository";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);

export class UserDynamoDBRepository implements UserRepository {
    private tableName = "users";

    async createUser(user: UserEntity): Promise<UserEntity> {
        const emailExists = await this.getUserByEmail(user.email);

        if (emailExists) {
            throw new Error("Email already exists");
        }

        const params = {
            TableName: this.tableName,
            Item: {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                createdat: user.createdat
            },
        };

        await ddbDocClient.send(new PutCommand(params));
        return user;
    }

    async getUserByEmail(email: string): Promise<UserEntity | null> {
        const params = {
            TableName: "users",
            KeyConditionExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email
            },
            IndexName: "email-index"
        };

        const result = await ddbDocClient.send(new QueryCommand(params));
        return {...result.Items}[0] as UserEntity;
    }

    async getUserById(id: string): Promise<UserEntity | null> {
        const params = {
            TableName: "users",
            KeyConditionExpression: "id = :id",
            ExpressionAttributeValues: {
                ":id": id
            },
        };

        const result = await ddbDocClient.send(new QueryCommand(params));
        return {...result.Items}[0] as UserEntity;
    }
    async getUserByIdAuthenticated(idAuthenticated: string): Promise<UserEntity | null> {
        const params = {
            TableName: "users",
            KeyConditionExpression: "id = :id",
            ExpressionAttributeValues: {
                ":id": idAuthenticated
            },
        };

        const result = await ddbDocClient.send(new QueryCommand(params));
        return {...result.Items}[0] as UserEntity;
    }
}
