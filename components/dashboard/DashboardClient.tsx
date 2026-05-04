'use client'

import { useState } from 'react'
import { ContactWithDaysUntil } from '@/types'
import { formatBirthday } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { GiftSuggestionModal } from '@/components/gifts/GiftSuggestionModal'
import Link from 'next/link'

function getUrgencyBadge(days: number) {
  if (days === 0) return { label: 'Today! 🎉', variant: 'red' as const }
  if (days <= 7) return { label: `${days}d away`, variant: 'red' as const }
  if (days <= 14) return { label: `${days}d away`, variant: 'orange' as const }
  if (days <= 30) return { label: `${days}d away`, variant: 'blue' as const }
  return { label: `${days}d away`, variant: 'default' as const }
}

export function DashboardClient({ contacts }: { contacts: ContactWithDaysUntil[] }) {
  const [selectedContact, setSelectedContact] = useState<ContactWithDaysUntil | null>(null)

  return (
    <>
      <div className="space-y-3">
        {contacts.map((contact) => {
          const urgency = getUrgencyBadge(contact.days_until_birthday)
          return (
            <div
              key={contact.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {contact.full_name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{contact.full_name}</h3>
                  <Badge variant={urgency.variant}>{urgency.label}</Badge>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  🎂 {formatBirthday(contact.birthday_day, contact.birthday_month, contact.birthday_year)} · {contact.relationship}
                </p>
                {contact.budget_range && (
                  <p className="text-xs text-gray-400 mt-0.5">Budget: {contact.budget_range}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setSelectedContact(contact)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors"
                  title="Get gift ideas"
                >
                  <span>🎁</span>
                  <span className="hidden sm:inline">Gift ideas</span>
                </button>
                <Link
                  href={`/dashboard/contacts/${contact.id}/edit`}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                  title="Edit contact"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {selectedContact && (
        <GiftSuggestionModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      )}
    </>
  )
}
