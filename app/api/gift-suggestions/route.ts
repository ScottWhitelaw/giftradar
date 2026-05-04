import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { Contact, GiftSuggestion } from '@/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { contactId } = await request.json()
  if (!contactId) {
    return NextResponse.json({ error: 'contactId is required' }, { status: 400 })
  }

  const { data: contact, error: contactError } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', contactId)
    .eq('user_id', user.id)
    .single()

  if (contactError || !contact) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
  }

  const c = contact as Contact
  const prompt = `You are a thoughtful gift advisor. Suggest 5 personalised gift ideas for the following person.

Person: ${c.full_name}
Relationship: ${c.relationship}
Interests and hobbies: ${c.interests}
Budget range: ${c.budget_range}
${c.notes ? `Additional notes: ${c.notes}` : ''}

Return ONLY a valid JSON array (no markdown, no explanation) with exactly 5 objects, each with these fields:
- name: short gift name (3-6 words)
- description: 1-2 sentences describing the gift
- estimated_price: specific price like "~£25" or "£15-£30"
- why: one sentence explaining why this suits them personally

The estimated price must fall within the budget range: ${c.budget_range}.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    let suggestions: GiftSuggestion[]
    try {
      suggestions = JSON.parse(text)
    } catch {
      console.error('JSON parse failed. Raw response:', text)
      return NextResponse.json({ error: `AI returned invalid response: ${text.slice(0, 200)}` }, { status: 500 })
    }

    return NextResponse.json({ suggestions })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Gift suggestion error:', message)
    return NextResponse.json({ error: `Claude API error: ${message}` }, { status: 500 })
  }
}
