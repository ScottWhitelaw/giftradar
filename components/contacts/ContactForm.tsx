'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Contact, BudgetRange, Relationship } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'

const RELATIONSHIPS: Relationship[] = [
  'Partner', 'Spouse', 'Mother', 'Father', 'Sister', 'Brother',
  'Daughter', 'Son', 'Grandmother', 'Grandfather',
  'Friend', 'Best Friend', 'Colleague', 'Boss', 'Neighbour', 'Other',
]

const BUDGETS: BudgetRange[] = ['£0-£20', '£20-£50', '£50-£100', '£100+']

const MONTHS = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' },
  { value: 3, label: 'March' }, { value: 4, label: 'April' },
  { value: 5, label: 'May' }, { value: 6, label: 'June' },
  { value: 7, label: 'July' }, { value: 8, label: 'August' },
  { value: 9, label: 'September' }, { value: 10, label: 'October' },
  { value: 11, label: 'November' }, { value: 12, label: 'December' },
]

interface Props {
  contact?: Contact
  userId: string
}

export function ContactForm({ contact, userId }: Props) {
  const router = useRouter()
  const isEdit = !!contact

  const [form, setForm] = useState({
    full_name: contact?.full_name ?? '',
    birthday_day: contact?.birthday_day?.toString() ?? '',
    birthday_month: contact?.birthday_month?.toString() ?? '',
    birthday_year: contact?.birthday_year?.toString() ?? '',
    relationship: contact?.relationship ?? 'Friend',
    interests: contact?.interests ?? '',
    budget_range: contact?.budget_range ?? '£20-£50',
    notes: contact?.notes ?? '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.full_name.trim()) e.full_name = 'Name is required'
    const day = parseInt(form.birthday_day)
    const month = parseInt(form.birthday_month)
    if (!form.birthday_day || isNaN(day) || day < 1 || day > 31) e.birthday_day = 'Enter a valid day (1–31)'
    if (!form.birthday_month || isNaN(month) || month < 1 || month > 12) e.birthday_month = 'Select a month'
    if (form.birthday_year) {
      const y = parseInt(form.birthday_year)
      if (isNaN(y) || y < 1900 || y > new Date().getFullYear()) e.birthday_year = 'Enter a valid year'
    }
    if (!form.interests.trim()) e.interests = 'Add some interests to get better gift suggestions'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setServerError(null)

    const supabase = createClient()
    const payload = {
      full_name: form.full_name.trim(),
      birthday_day: parseInt(form.birthday_day),
      birthday_month: parseInt(form.birthday_month),
      birthday_year: form.birthday_year ? parseInt(form.birthday_year) : null,
      relationship: form.relationship,
      interests: form.interests.trim(),
      budget_range: form.budget_range,
      notes: form.notes.trim() || null,
      user_id: userId,
    }

    let error
    if (isEdit) {
      ;({ error } = await supabase.from('contacts').update(payload).eq('id', contact.id))
    } else {
      ;({ error } = await supabase.from('contacts').insert(payload))
    }

    if (error) {
      setServerError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard/contacts')
    router.refresh()
  }

  async function handleDelete() {
    if (!contact) return
    if (!confirm(`Delete ${contact.full_name}? This cannot be undone.`)) return

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('contacts').delete().eq('id', contact.id)
    if (error) {
      setServerError(error.message)
      setLoading(false)
      return
    }
    router.push('/dashboard/contacts')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 text-base">Personal details</h2>

        <Input
          id="full_name"
          label="Full name *"
          placeholder="e.g. Sarah Johnson"
          value={form.full_name}
          onChange={(e) => set('full_name', e.target.value)}
          error={errors.full_name}
        />

        <Select
          id="relationship"
          label="Relationship *"
          value={form.relationship}
          onChange={(e) => set('relationship', e.target.value)}
        >
          {RELATIONSHIPS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </Select>

        {/* Birthday */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Birthday *</label>
          <div className="grid grid-cols-3 gap-3">
            <Input
              id="birthday_day"
              type="number"
              placeholder="Day"
              min={1}
              max={31}
              value={form.birthday_day}
              onChange={(e) => set('birthday_day', e.target.value)}
              error={errors.birthday_day}
            />
            <Select
              id="birthday_month"
              value={form.birthday_month}
              onChange={(e) => set('birthday_month', e.target.value)}
              error={errors.birthday_month}
            >
              <option value="">Month</option>
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </Select>
            <Input
              id="birthday_year"
              type="number"
              placeholder="Year (optional)"
              min={1900}
              max={new Date().getFullYear()}
              value={form.birthday_year}
              onChange={(e) => set('birthday_year', e.target.value)}
              error={errors.birthday_year}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 text-base">Gift preferences</h2>

        <Textarea
          id="interests"
          label="Interests & hobbies *"
          placeholder="e.g. loves cooking, enjoys hiking, obsessed with sci-fi books, listens to jazz, plays guitar..."
          value={form.interests}
          onChange={(e) => set('interests', e.target.value)}
          error={errors.interests}
          rows={4}
          hint="The more detail you add, the better the gift suggestions will be."
        />

        <Select
          id="budget_range"
          label="Budget range *"
          value={form.budget_range}
          onChange={(e) => set('budget_range', e.target.value)}
        >
          {BUDGETS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </Select>

        <Textarea
          id="notes"
          label="Notes (optional)"
          placeholder="Anything else worth knowing — allergies, things they already have, sizes, etc."
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          rows={3}
        />
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" loading={loading} className="flex-1 sm:flex-none">
          {isEdit ? 'Save changes' : 'Add contact'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        {isEdit && (
          <Button
            type="button"
            variant="danger"
            size="lg"
            onClick={handleDelete}
            disabled={loading}
            className="ml-auto"
          >
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}
