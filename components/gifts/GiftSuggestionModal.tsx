'use client'

import { useState } from 'react'
import { Contact, GiftSuggestion } from '@/types'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface Props {
  contact: Contact
  onClose: () => void
}

export function GiftSuggestionModal({ contact, onClose }: Props) {
  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetched, setFetched] = useState(false)

  async function fetchSuggestions() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/gift-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId: contact.id }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to get suggestions')
      setSuggestions(data.suggestions)
      setFetched(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Gift ideas for {contact.full_name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Budget: {contact.budget_range} · {contact.relationship}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {!fetched && !loading && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎁</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                AI-powered gift suggestions
              </h3>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                Claude will suggest 5 personalised gift ideas based on {contact.full_name}&apos;s interests, hobbies, and your budget.
              </p>
              <Button onClick={fetchSuggestions} size="lg">
                <span>✨</span>
                Get gift ideas
              </Button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-gray-600 font-medium">Finding perfect gifts…</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-4">
              {error}
            </div>
          )}

          {fetched && suggestions.length > 0 && (
            <div className="space-y-4">
              {suggestions.map((gift, i) => (
                <Card key={i} padding="sm" className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                      🎁
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="font-semibold text-gray-900">{gift.name}</h4>
                        <span className="text-purple-700 font-semibold text-sm bg-purple-50 px-3 py-1 rounded-full">
                          {gift.estimated_price}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{gift.description}</p>
                      <p className="text-xs text-gray-400 mt-2 italic">{gift.why}</p>
                    </div>
                  </div>
                </Card>
              ))}

              <div className="pt-2">
                <Button variant="secondary" onClick={fetchSuggestions} loading={loading} className="w-full">
                  Regenerate suggestions
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
