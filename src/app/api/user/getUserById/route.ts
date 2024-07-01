import { NextRequest, NextResponse } from "next/server";
import { makeUserService } from "../../modules/user/factories/makeUserService";

export async function GET(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json({ error: { message: 'Method not allowed' } }, { status: 405 });
  }

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: { message: 'ID is required' } }, { status: 400 });
    }

    const { userService } = makeUserService();
    const result = await userService.getUserById(id)

    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json({ error: { message: `Internal Server Error: ${error.message}` } }, {
      status: 500
    });
  }
}
