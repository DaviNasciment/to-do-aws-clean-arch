import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { makeUserService } from "../../modules/user/factories/makeUserService";

interface UserJwtPayload {
  jti: string
  iat: number
  sub: string
  exp: number
}

export async function GET(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json({ error: { message: 'Method not allowed' } }, { status: 405 });
  }

  try {
    const verifiedToken = await verifyAuth(req).catch((err) => {
      console.error(err.message)
    }) as UserJwtPayload

    const { userService } = makeUserService();
    const result = await userService.getUserByIdAuthenticated(verifiedToken.sub)

    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json({ error: { message: `Internal Server Error: ${error.message}` } }, {
      status: 500
    });
  }
}
