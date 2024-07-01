import { type NextRequest } from 'next/server'
import { setUserCookie } from '@/lib/auth'
import { jsonResponse } from '@/lib/utils'

export const runtime = "edge"

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: { message: 'Method not allowed' } })
  }

  try {
    const data = await req.json()

    const response = jsonResponse(200, { success: true, data })
    return await setUserCookie(response, data.id)
  } catch (err) {
    console.error(err)
    return jsonResponse(500, { error: { message: 'Authentication failed.' } })
  }
}