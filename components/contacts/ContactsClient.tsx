'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ContactWithDaysUntil } from '@/types'
import { formatBirthday } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { GiftSuggestionModal } from '@/components/gifts/GiftSuggestionModal'

export function ContactsClient({ contacts }: { contacts: ContactWithDaysUntil[] }) {
  const [selectedContact, setSelectedContact] = useState<ContactWithDaysUntil | null>(null)
  const [search, setSearch] = useState('')

  const filtered = contacts.filter((c) =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.relationship.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search contacts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 text-sm py-12">No contacts match your search.</p>
      )}

      <div className="space-y-2">
        {filtered.map((contact) => (
          <div
            key={contact.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              {contact.full_name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{contact.full_name}</p>
              <p className="text-sm text-gray-500">
                🎂 {formatBirthday(contact.birthday_day, contact.birthday_month, contact.birthday_year)} · {contact.relationship}
              </p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Badge variant={contact.days_until_birthday <= 30 ? 'orange' : 'default'}>
                {contact.days_until_birthday === 0 ? 'Today!' : `${contact.days_until_birthday}d`}
              </Badge>

              <button
                onClick={() => setSelectedContact(contact)}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                title="Gift ideas"
              >
                🎁
              </button>

              <Link
                href={`/contacts/${contact.id}/edit`}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
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
