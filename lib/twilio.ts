import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://giftradar.app'
const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER!

export async function sendBirthdayReminderSMS({
  to,
  contactName,
  daysUntil,
}: {
  to: string
  contactName: string
  daysUntil: number
}) {
  const body =
    daysUntil === 0
      ? `🎂 GiftRadar: It's ${contactName}'s birthday TODAY! Get gift ideas: ${APP_URL}`
      : `🎁 GiftRadar: ${contactName}'s birthday is in ${daysUntil} day${daysUntil === 1 ? '' : 's'}. Get AI gift ideas: ${APP_URL}`

  return client.messages.create({
    body,
    from: FROM_NUMBER,
    to,
  })
}
