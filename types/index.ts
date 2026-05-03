export type BudgetRange = '£0-£20' | '£20-£50' | '£50-£100' | '£100+'

export type Relationship =
  | 'Partner'
  | 'Spouse'
  | 'Mother'
  | 'Father'
  | 'Sister'
  | 'Brother'
  | 'Daughter'
  | 'Son'
  | 'Grandmother'
  | 'Grandfather'
  | 'Friend'
  | 'Best Friend'
  | 'Colleague'
  | 'Boss'
  | 'Neighbour'
  | 'Other'

export interface Contact {
  id: string
  user_id: string
  full_name: string
  birthday_day: number
  birthday_month: number
  birthday_year: number | null
  relationship: Relationship
  interests: string
  budget_range: BudgetRange
  notes: string | null
  created_at: string
  updated_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  email: string | null
  phone: string | null
  reminder_days: number[]
  created_at: string
  updated_at: string
}

export interface GiftSuggestion {
  name: string
  description: string
  estimated_price: string
  why: string
}

export interface ContactWithDaysUntil extends Contact {
  days_until_birthday: number
  next_birthday: string
}
