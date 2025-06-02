'use client'

import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupIcon from '@mui/icons-material/Group'
import BusinessIcon from '@mui/icons-material/Business'
import BarChartIcon from '@mui/icons-material/BarChart'
import PersonIcon from '@mui/icons-material/Person'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin/dashboard', icon: DashboardIcon, label: 'Overview' },
  { href: '/admin/users', icon: GroupIcon, label: 'Users' },
  { href: '/admin/projects', icon: BusinessIcon, label: 'Projects' },
  { href: '/admin/analytics', icon: BarChartIcon, label: 'Analytics' },
  { href: '/profile', icon: PersonIcon, label: 'Profile' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { currentUser, isAuthenticated } = useStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      router.push('/')
      return
    }

    if (currentUser.role !== 'admin') {
      router.push(`/${currentUser.role}/dashboard`)
    }
  }, [isAuthenticated, currentUser, router])

  if (!isAuthenticated || !currentUser || currentUser.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {children}
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[428px] bg-white/95 backdrop-blur-lg border-t border-slate-200 px-6 py-3 elevation-4">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const IconComponent = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-200 touch-feedback min-h-[56px] justify-center ${
                  isActive 
                    ? 'text-sky-600 bg-sky-50 scale-105' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <IconComponent className={`w-6 h-6 mb-1 transition-transform duration-200 ${
                  isActive ? 'scale-110' : ''
                }`} />
                <span className={`text-xs font-medium transition-all duration-200 ${
                  isActive ? 'font-semibold' : ''
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-4 h-0.5 bg-sky-500 rounded-full mt-1 animate-pulse" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
} 