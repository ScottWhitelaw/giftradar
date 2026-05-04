import { createClient } from '@/lib/supabase/server'
import { UserSettings } from '@/types'
import { SettingsClient } from '@/components/settings/SettingsClient'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: settings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your notification preferences.</p>
      </div>

      <SettingsClient
        userId={user!.id}
        userEmail={user!.email ?? ''}
        settings={settings as UserSettings | null}
      />
    </div>
  )
}
