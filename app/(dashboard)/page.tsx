import { createClient } from '@/lib/supabase/server'
import { enrichContactsWithDays } from '@/lib/utils'
import { Contact } from '@/types'
import Link from 'next/link'
import { DashboardClient } from './DashboardClient'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user!.id)
    .order('full_name')

  const enriched = enrichContactsWithDays((contacts || []) as Contact[])
  const upcoming = enriched.filter((c) => c.days_until_birthday <= 90)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upcoming Birthdays</h1>
        <p className="text-gray-500 mt-1">Birthdays in the next 90 days</p>
      </div>

      {upcoming.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎂</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No birthdays in the next 90 days</h3>
          <p className="text-gray-500 text-sm mb-6">
            Add some contacts to start tracking birthdays.
          </p>
          <Link
            href="/contacts/new"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
          >
            <span>+</span> Add a contact
          </Link>
        </div>
      )}

      {upcoming.length > 0 && (
        <DashboardClient contacts={upcoming} />
      )}

      {/* Stats strip */}
      {(contacts?.length ?? 0) > 0 && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard label="Total contacts" value={contacts?.length ?? 0} icon="👥" />
          <StatCard label="Birthdays this month" value={enriched.filter(c => {
            const m = new Date().getMonth() + 1
            return c.birthday_month === m
          }).length} icon="🎂" />
          <StatCard label="In next 90 days" value={upcoming.length} icon="📅" />
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  )
}
