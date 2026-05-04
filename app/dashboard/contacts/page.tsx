import { createClient } from '@/lib/supabase/server'
import { Contact } from '@/types'
import { enrichContactsWithDays } from '@/lib/utils'
import Link from 'next/link'
import { ContactsClient } from '@/components/contacts/ContactsClient'

export default async function ContactsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user!.id)
    .order('full_name')

  const enriched = enrichContactsWithDays((contacts || []) as Contact[])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-500 mt-1">{enriched.length} {enriched.length === 1 ? 'person' : 'people'} saved</p>
        </div>
        <Link
          href="/dashboard/contacts/new"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-purple-700 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add contact
        </Link>
      </div>

      {enriched.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👥</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts yet</h3>
          <p className="text-gray-500 text-sm mb-6">
            Add your first contact to track their birthday and get personalised gift ideas.
          </p>
          <Link
            href="/dashboard/contacts/new"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
          >
            <span>+</span> Add your first contact
          </Link>
        </div>
      )}

      {enriched.length > 0 && <ContactsClient contacts={enriched} />}
    </div>
  )
}
