'use client'

import { useStore } from '@/lib/store'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SecurityIcon from '@mui/icons-material/Security'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import EditIcon from '@mui/icons-material/Edit'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import HomeIcon from '@mui/icons-material/Home'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/lib/types'
import { useState } from 'react'

export default function Profile() {
  const { currentUser, logout, switchRole } = useStore()
  const router = useRouter()
  const [showRoleSelector, setShowRoleSelector] = useState(false)

  if (!currentUser) return null

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleBackToDemo = () => {
    logout()
    router.push('/')
  }

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole)
    setShowRoleSelector(false)
    router.push(`/${newRole}/dashboard`)
  }

  const roles = [
    { value: 'investor' as UserRole, label: 'Investor', icon: '🏠', description: 'Invest in properties' },
    { value: 'developer' as UserRole, label: 'Developer', icon: '🏗️', description: 'List your projects' },
    { value: 'admin' as UserRole, label: 'Administrator', icon: '⚙️', description: 'Manage platform' }
  ]

  const menuItems = [
    {
      icon: PersonIcon,
      title: "Personal Information",
      description: "Update your profile details",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600"
    },
    {
      icon: NotificationsIcon,
      title: "Notifications",
      description: "Manage your notification preferences",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600"
    },
    {
      icon: SecurityIcon,
      title: "Security & Privacy",
      description: "Account security and data privacy",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      icon: SettingsIcon,
      title: "App Settings",
      description: "Preferences and app configuration",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600"
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="text-slate-600 capitalize">{currentUser.role} Account</p>
        </div>
        <Button
          onClick={() => setShowRoleSelector(true)}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <SwapHorizIcon className="w-4 h-4" />
          <span>Switch Role</span>
        </Button>
      </div>

      {/* Role Selector Modal */}
      {showRoleSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 mx-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Switch Role</h3>
            <div className="space-y-3">
              {roles.map((role) => (
                <Card
                  key={role.value}
                  className={`cursor-pointer transition-all ${
                    currentUser.role === role.value 
                      ? 'bg-sky-50 border-sky-200 ring-2 ring-sky-500' 
                      : 'hover:bg-slate-50'
                  }`}
                  onClick={() => handleRoleSwitch(role.value)}
                  padding="md"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{role.icon}</span>
                    <div>
                      <h4 className="font-semibold text-slate-900">{role.label}</h4>
                      <p className="text-sm text-slate-600">{role.description}</p>
                    </div>
                    {currentUser.role === role.value && (
                      <div className="ml-auto w-2 h-2 bg-sky-500 rounded-full"></div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowRoleSelector(false)}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-sky-600 border-sky-600 hover:bg-sky-50"
                onClick={handleBackToDemo}
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                Back to Demo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Content */}
      <div className="space-y-6">
        {/* User Profile Card */}
        <Card elevation={2} padding="lg" className="text-center">
          <div className="relative inline-block mb-4">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-24 h-24 rounded-full mx-auto border-4 border-white elevation-2"
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center border-4 border-white">
              <EditIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 mb-1">{currentUser.name}</h2>
          <p className="text-slate-600 mb-3">{currentUser.email}</p>
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 rounded-full">
            <VerifiedUserIcon className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-700 font-medium capitalize">{currentUser.kycStatus} Account</span>
          </div>
        </Card>

        {/* Stats */}
        {currentUser.role === 'investor' && (
          <div className="grid grid-cols-2 gap-4">
            <Card elevation={1} padding="md" className="text-center">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AccountBalanceWalletIcon className="w-6 h-6 text-sky-600" />
              </div>
              <p className="text-sm text-slate-500 font-medium">Portfolio Value</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(currentUser.stats.portfolioValue)}
              </p>
            </Card>
            
            <Card elevation={1} padding="md" className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUpIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-sm text-slate-500 font-medium">Total Returns</p>
              <p className="text-xl font-bold text-emerald-600">
                {formatCurrency(currentUser.stats.totalReturns)}
              </p>
            </Card>
          </div>
        )}

        {/* Badges */}
        {currentUser.badges.length > 0 && (
          <Card elevation={1} padding="lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <EmojiEventsIcon className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Achievements</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {currentUser.badges.map((badge, index) => (
                <div 
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-sky-50 to-sky-100 border border-sky-200 text-sky-800 text-sm rounded-full font-medium flex items-center space-x-2"
                >
                  <EmojiEventsIcon className="w-4 h-4" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Menu Items */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Account Settings</h2>
          
          {menuItems.map((item, index) => (
            <Card key={index} hover elevation={1} padding="none" className="cursor-pointer">
              <div className="p-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${item.iconBg} rounded-full flex items-center justify-center`}>
                    <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Account Actions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Account Actions</h2>
          
          {/* Upgrade Account (if applicable) */}
          {currentUser.kycStatus !== 'verified' && (
            <Card elevation={2} padding="none" className="overflow-hidden">
              <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <VerifiedUserIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Verify Your Account</h3>
                    <p className="text-sm text-white/90">Unlock higher investment limits</p>
                  </div>
                  <Button size="sm" variant="secondary">
                    Verify
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Logout */}
          <Card elevation={1} padding="none">
            <Button 
              variant="ghost" 
              className="w-full p-4 text-red-600 hover:bg-red-50 justify-start"
              onClick={handleLogout}
              leftIcon={<LogoutIcon className="w-5 h-5" />}
            >
              <div className="text-left">
                <div className="font-semibold">Sign Out</div>
                <div className="text-sm text-red-500">Sign out of your account</div>
              </div>
            </Button>
          </Card>
        </div>

        {/* App Info */}
        <Card padding="md" className="text-center bg-slate-50">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <h3 className="font-semibold text-slate-900">RISE Platform</h3>
            <p className="text-sm text-slate-600">Real Estate Investment Made Simple</p>
            <p className="text-xs text-slate-500">Version 1.0.0</p>
          </div>
        </Card>
      </div>
    </div>
  )
} 