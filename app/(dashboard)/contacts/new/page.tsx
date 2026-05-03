import { createClient } from '@/lib/supabase/server'
import { ContactForm } from '@/components/contacts/ContactForm'
import Link from 'next/link'

export default async function NewContactPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/contacts"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to contacts
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add a contact</h1>
        <p className="text-gray-500 mt-1">Fill in their details to track birthdays and get gift ideas.</p>
      </div>

      <ContactForm userId={user!.id} />
    </div>
  )
}
