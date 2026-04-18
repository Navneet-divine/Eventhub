import { NextRequest, NextResponse } from 'next/server'
import { toggleBookEvent } from '@/lib/actions/event.actions'

type ToggleResult = {
  success?: boolean
  message?: string
  error?: string
}

export async function POST(req: NextRequest) {
  try {
    const { eventId, email } = await req.json()

    if (!eventId || !email) {
      return NextResponse.json({ success: false, error: 'Missing eventId or email' }, { status: 400 })
    }

    const result = (await toggleBookEvent(eventId, email)) as ToggleResult

    if (result && result.success) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: result.error || 'Failed to book event' }, { status: 500 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
