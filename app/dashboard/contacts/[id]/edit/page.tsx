import { createClient } from '@/lib/supabase/server'
import { ContactForm } from '@/components/contacts/ContactForm'
import { Contact } from '@/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function EditContactPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: contact } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user!.id)
    .single()

  if (!contact) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/contacts"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to contacts
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit contact</h1>
        <p className="text-gray-500 mt-1">Update {contact.full_name}&apos;s details.</p>
      </div>

      <ContactForm contact={contact as Contact} userId={user!.id} />
    </div>
  )
}
