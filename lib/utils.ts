import { Contact, ContactWithDaysUntil } from '@/types'

export function getDaysUntilBirthday(day: number, month: number): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const thisYear = today.getFullYear()
  let next = new Date(thisYear, month - 1, day)

  if (next < today) {
    next = new Date(thisYear + 1, month - 1, day)
  }

  const diff = next.getTime() - today.getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

export function getNextBirthdayDate(day: number, month: number): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const thisYear = today.getFullYear()
  let next = new Date(thisYear, month - 1, day)

  if (next < today) {
    next = new Date(thisYear + 1, month - 1, day)
  }

  return next.toISOString().split('T')[0]
}

export function formatBirthday(day: number, month: number, year: number | null): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  const monthName = months[month - 1]
  return year ? `${day} ${monthName} ${year}` : `${day} ${monthName}`
}

export function getAge(day: number, month: number, year: number): number {
  const today = new Date()
  const thisYear = today.getFullYear()
  let age = thisYear - year

  const hadBirthdayThisYear =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day)

  if (!hadBirthdayThisYear) age -= 1
  return age
}

export function enrichContactsWithDays(contacts: Contact[]): ContactWithDaysUntil[] {
  return contacts
    .map((c) => ({
      ...c,
      days_until_birthday: getDaysUntilBirthday(c.birthday_day, c.birthday_month),
      next_birthday: getNextBirthdayDate(c.birthday_day, c.birthday_month),
    }))
    .sort((a, b) => a.days_until_birthday - b.days_until_birthday)
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
