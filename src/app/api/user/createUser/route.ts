import { NextRequest, NextResponse } from "next/server";
import UserEntity from "@/core/user/entities/userEntity";
import { makeUserService } from "../../modules/user/factories/makeUserService"

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return Response.json({ error: { message: 'Method not allowed' } });
  }

  try {
    const data: UserEntity = await req.json();
    const { userService } = makeUserService();
    await userService.createUser(data);
    return Response.json({ data });
  } catch (error: any) {
    console.error('Database error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: { message: 'Email already exists' } }, {
        status: 400
      });
    }
    return NextResponse.json({ error: { message: 'Internal Server Error' } }, {
      status: 500
    });
  }
}
