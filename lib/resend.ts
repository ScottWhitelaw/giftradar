import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://giftradar.app'
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'GiftRadar <reminders@giftradar.app>'

export async function sendBirthdayReminderEmail({
  to,
  contactName,
  daysUntil,
  relationship,
}: {
  to: string
  contactName: string
  daysUntil: number
  relationship: string
}) {
  const subject =
    daysUntil === 0
      ? `🎂 It's ${contactName}'s birthday today!`
      : `🎁 ${contactName}'s birthday is in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`

  const urgencyText =
    daysUntil === 0
      ? "Today is the day!"
      : daysUntil <= 7
      ? "Time to get a gift — it's coming up soon!"
      : daysUntil <= 14
      ? "Two weeks to go — a great time to start planning."
      : "A month away — plenty of time to find the perfect gift."

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#7c3aed,#9333ea);padding:32px 40px;text-align:center;">
      <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0 0 4px;">GiftRadar</p>
      <h1 style="color:white;font-size:28px;margin:0;font-weight:700;">Birthday Reminder 🎂</h1>
    </div>
    <div style="padding:32px 40px;">
      <p style="font-size:18px;color:#111827;font-weight:600;margin:0 0 8px;">
        ${daysUntil === 0 ? "🎉" : "📅"} ${contactName}'s birthday is ${daysUntil === 0 ? 'today' : `in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`}
      </p>
      <p style="color:#6b7280;font-size:15px;margin:0 0 24px;">
        ${urgencyText}
      </p>
      <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">
        Relationship: <strong style="color:#374151;">${relationship}</strong>
      </p>
      <a href="${APP_URL}/contacts" style="display:inline-block;background:#7c3aed;color:white;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:600;font-size:15px;">
        ✨ Get AI Gift Ideas
      </a>
      <p style="color:#9ca3af;font-size:12px;margin-top:32px;">
        You're receiving this because you set up birthday reminders in GiftRadar.<br>
        <a href="${APP_URL}/settings" style="color:#7c3aed;">Manage your notification settings</a>
      </p>
    </div>
  </div>
</body>
</html>`

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  })
}
