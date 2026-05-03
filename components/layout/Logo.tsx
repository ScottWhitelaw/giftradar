import Link from 'next/link'

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' }
  const iconSizes = { sm: 'w-6 h-6', md: 'w-8 h-8', lg: 'w-10 h-10' }

  return (
    <Link href="/dashboard" className="flex items-center gap-2 group">
      <div className={`${iconSizes[size]} bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
        </svg>
      </div>
      <span className={`${sizes[size]} font-bold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent`}>
        GiftRadar
      </span>
    </Link>
  )
}
