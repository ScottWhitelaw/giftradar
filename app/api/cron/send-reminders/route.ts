import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendBirthdayReminderEmail } from '@/lib/resend'
import { getDaysUntilBirthday } from '@/lib/utils'
import { Contact, UserSettings } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const supabase = createServiceClient()

  const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')

  if (contactsError) {
    console.error('Failed to fetch contacts:', contactsError)
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }

  const { data: allSettings, error: settingsError } = await supabase
    .from('user_settings')
    .select('*')

  if (settingsError) {
    console.error('Failed to fetch settings:', settingsError)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }

  const settingsMap = new Map<string, UserSettings>(
    (allSettings || []).map((s: UserSettings) => [s.user_id, s])
  )

  let emailsSent = 0
  let errors = 0

  for (const contact of (contacts || []) as Contact[]) {
    const settings = settingsMap.get(contact.user_id)
    if (!settings) continue

    const reminderDays: number[] = settings.reminder_days || [30, 14, 7]
    const daysUntil = getDaysUntilBirthday(contact.birthday_day, contact.birthday_month)

    if (!reminderDays.includes(daysUntil)) continue

    if (settings.email) {
      try {
        await sendBirthdayReminderEmail({
          to: settings.email,
          contactName: contact.full_name,
          daysUntil,
          relationship: contact.relationship,
        })
        emailsSent++
      } catch (err) {
        console.error(`Email failed for ${contact.full_name}:`, err)
        errors++
      }
    }
  }

  console.log(`Cron complete: ${emailsSent} emails, ${errors} errors`)
  return NextResponse.json({ emailsSent, errors })
}
