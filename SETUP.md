# GiftRadar — Setup & Deployment Guide

## What you're deploying

GiftRadar is a Next.js 14 app that:
- Tracks contacts' birthdays
- Sends AI-generated gift suggestions via Claude (Anthropic)
- Sends birthday reminder emails via Resend
- Sends birthday reminder SMS via Twilio
- Runs a daily cron job on Vercel to check for upcoming birthdays

---

## Step 1 — Create a Supabase project (free)

1. Go to [supabase.com](https://supabase.com) and sign up or log in.
2. Click **New project**, give it a name (e.g. `giftradar`), choose a region, and set a database password.
3. Wait ~1 minute for the project to spin up.
4. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` *(keep secret!)*
5. Go to **SQL Editor** and run the contents of `supabase/migrations/001_initial_schema.sql` to create the tables.
6. Go to **Authentication → URL Configuration** and add your domain to **Redirect URLs**, e.g. `https://yourdomain.com/auth/callback`.

---

## Step 2 — Get an Anthropic API key (for gift suggestions)

1. Go to [console.anthropic.com](https://console.anthropic.com) and sign up.
2. Go to **API Keys** and create a new key.
3. Copy it → `ANTHROPIC_API_KEY`

---

## Step 3 — Create a Resend account (free email)

1. Go to [resend.com](https://resend.com) and sign up.
2. Go to **API Keys → Create API Key**.
3. Copy it → `RESEND_API_KEY`
4. (Optional) Add and verify your own domain in Resend for a custom `from` address.
5. Set `RESEND_FROM_EMAIL` to e.g. `GiftRadar <reminders@yourdomain.com>`  
   *On the free plan you can send from `onboarding@resend.dev` while testing.*

---

## Step 4 — Create a Twilio account (SMS)

1. Go to [twilio.com](https://twilio.com) and sign up.
2. From the Console Dashboard copy:
   - **Account SID** → `TWILIO_ACCOUNT_SID`
   - **Auth Token** → `TWILIO_AUTH_TOKEN`
3. Go to **Phone Numbers → Manage → Buy a number** and get a number with SMS capability.
4. Copy it in E.164 format (e.g. `+447712345678`) → `TWILIO_PHONE_NUMBER`
5. *Free trial accounts can only send to verified numbers. Verify yours under Verified Caller IDs.*

---

## Step 5 — Deploy to Vercel (free)

1. Push your code to GitHub (this repo is already set up).
2. Go to [vercel.com](https://vercel.com) and sign up with GitHub.
3. Click **Add New → Project** and import this repository.
4. Under **Environment Variables**, add all variables from `.env.local.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel URL, e.g. `https://giftradar.vercel.app`)
   - `CRON_SECRET` (generate with `openssl rand -hex 32`)
5. Click **Deploy**. Vercel will build and deploy automatically.
6. The cron job (`vercel.json`) runs every day at 08:00 UTC automatically on Vercel.

---

## Step 6 — Connect your own domain (optional)

1. In your Vercel project, go to **Settings → Domains**.
2. Add your domain (e.g. `giftradar.app`).
3. Vercel gives you DNS records — add them at your domain registrar (e.g. Namecheap, GoDaddy, Cloudflare).
4. Wait for DNS propagation (usually a few minutes with Cloudflare, up to 48h elsewhere).
5. Update `NEXT_PUBLIC_APP_URL` in your Vercel environment variables to your new domain.
6. Update the Supabase redirect URL to your new domain.

---

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Copy the example env file
cp .env.local.example .env.local
# Then fill in your actual values

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
