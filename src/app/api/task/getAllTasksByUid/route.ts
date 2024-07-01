import { NextRequest, NextResponse } from "next/server";
import { makeTaskService } from "../../modules/task/factories/makeTaskService";

export async function GET(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json({ error: { message: 'Method not allowed' } }, { status: 405 });
  }

  try {
    const uid = req.nextUrl.searchParams.get('uid');
    if (!uid) {
      return NextResponse.json({ error: { message: 'Uid is required' } }, { status: 400 });
    }
    
    const { taskService } = makeTaskService();
    const result = await taskService.getAllTasksByUid(uid)

    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json({ error: { message: `Internal Server Error: ${error.message}` } }, {
      status: 500
    });
  }
}
