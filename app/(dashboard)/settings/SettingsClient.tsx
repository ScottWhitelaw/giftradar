'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UserSettings } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'

const REMINDER_OPTIONS = [
  { value: 7, label: '7 days before' },
  { value: 14, label: '14 days before' },
  { value: 30, label: '30 days before' },
  { value: 60, label: '60 days before' },
]

interface Props {
  userId: string
  userEmail: string
  settings: UserSettings | null
}

export function SettingsClient({ userId, userEmail, settings }: Props) {
  const [email, setEmail] = useState(settings?.email ?? userEmail ?? '')
  const [reminderDays, setReminderDays] = useState<number[]>(
    settings?.reminder_days ?? [30, 14, 7]
  )
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleDay(day: number) {
    setReminderDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (reminderDays.length === 0) {
      setError('Select at least one reminder interval.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: upsertError } = await supabase
      .from('user_settings')
      .upsert(
        { user_id: userId, email: email || null, reminder_days: reminderDays },
        { onConflict: 'user_id' }
      )

    if (upsertError) {
      setError(upsertError.message)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email notifications</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Where should we send birthday reminders?
          </p>
        </CardHeader>

        <Input
          id="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          hint="We'll send reminder emails to this address."
        />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reminder timing</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            When should we notify you before each birthday?
          </p>
        </CardHeader>

        <div className="space-y-3">
          {REMINDER_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                  reminderDays.includes(value)
                    ? 'bg-purple-600 border-purple-600'
                    : 'border-gray-300 group-hover:border-purple-400'
                }`}
                onClick={() => toggleDay(value)}
              >
                {reminderDays.includes(value) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700 select-none" onClick={() => toggleDay(value)}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Settings saved successfully.
        </div>
      )}

      <Button type="submit" size="lg" loading={loading}>
        Save settings
      </Button>
    </form>
  )
}
