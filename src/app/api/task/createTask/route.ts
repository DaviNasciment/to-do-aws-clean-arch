import { Task } from "@/core/task/interfaces/taskInterface";
import { NextRequest, NextResponse } from "next/server";
import { makeTaskService } from "../../modules/task/factories/makeTaskService";

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return Response.json({ error: { message: 'Method not allowed' } });
  }

  try {
    const data: Task = await req.json();
    const { taskService } = makeTaskService();
    await taskService.createTask(data);

    return Response.json({ data });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: { message: 'Internal Server Error' } }, {
      status: 500
    });
  }
}
