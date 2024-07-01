import { type NextRequest } from 'next/server'
import { jsonResponse } from '@/lib/utils'

export const runtime = "edge"

export async function POST(req: NextRequest) {
  return jsonResponse(200, { success: true })
}