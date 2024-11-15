import { type NextRequest } from 'next/server'
import { expireUserCookie } from '@/lib/auth'
import { jsonResponse } from '@/lib/utils'

export const runtime = "edge"

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: { message: 'Method not allowed' } })
  }
  return expireUserCookie(jsonResponse(200, { success: true }))
}