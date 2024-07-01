import { NextRequest, NextResponse } from "next/server";
import { makeUserService } from "../../modules/user/factories/makeUserService";

export async function GET(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json({ error: { message: 'Method not allowed' } }, { status: 405 });
  }

  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: { message: 'Email is required' } }, { status: 400 });
    }
    
    const { userService } = makeUserService();
    const result = await userService.getUserByEmail(email)

    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json({ error: { message: `Internal Server Error: ${error.message}` } }, {
      status: 500
    });
  }
}
