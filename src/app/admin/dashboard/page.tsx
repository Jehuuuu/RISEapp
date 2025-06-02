'use client'

import { useStore } from '@/lib/store'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatCurrency, getTimeAgo } from '@/lib/utils'
import GroupIcon from '@mui/icons-material/Group'
import BusinessIcon from '@mui/icons-material/Business'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import AssessmentIcon from '@mui/icons-material/Assessment'
import SecurityIcon from '@mui/icons-material/Security'
import NotificationsIcon from '@mui/icons-material/Notifications'
import RefreshIcon from '@mui/icons-material/Refresh'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AdminDashboard() {
  const { users, projects, transactions } = useStore()

  // Calculate platform metrics
  const totalUsers = users.length
  const totalInvestors = users.filter(u => u.role === 'investor').length
  const totalDevelopers = users.filter(u => u.role === 'developer').length
  const verifiedUsers = users.filter(u => u.kycStatus === 'verified').length
  const pendingVerifications = users.filter(u => u.kycStatus === 'pending').length

  const totalInvestmentVolume = transactions
    .filter(t => t.type === 'investment' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const activeProjects = projects.filter(p => p.status === 'funding' || p.status === 'construction').length
  const completedProjects = projects.filter(p => p.status === 'completed').length

  // Recent activity
  const recentTransactions = transactions
    .filter(t => t.status === 'completed')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)

  const recentUsers = users
    .sort((a, b) => new Date(b.verificationDate || 0).getTime() - new Date(a.verificationDate || 0).getTime())
    .slice(0, 5)

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600">Platform overview and management</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <RefreshIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="relative">
            <NotificationsIcon className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendingVerifications}
            </span>
          </Button>
        </div>
      </div>

      {/* Key Platform Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card elevation={2} padding="md">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <AttachMoneyIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-500 font-medium">Total Volume</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(totalInvestmentVolume)}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUpIcon className="w-3 h-3 text-emerald-600" />
                <span className="text-xs text-emerald-600 font-medium">All-time</span>
              </div>
            </div>
          </div>
        </Card>

        <Card elevation={2} padding="md">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
              <GroupIcon className="w-6 h-6 text-sky-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-500 font-medium">Total Users</p>
              <p className="text-xl font-bold text-slate-900">{totalUsers}</p>
              <p className="text-xs text-slate-500 mt-1">
                {verifiedUsers} verified
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* User & Project Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card padding="md" className="text-center">
          <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <GroupIcon className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-lg font-bold text-slate-900">{totalInvestors}</p>
          <p className="text-xs text-slate-500">Investors</p>
        </Card>
        
        <Card padding="md" className="text-center">
          <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <BusinessIcon className="w-4 h-4 text-violet-600" />
          </div>
          <p className="text-lg font-bold text-slate-900">{totalDevelopers}</p>
          <p className="text-xs text-slate-500">Developers</p>
        </Card>
        
        <Card padding="md" className="text-center">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <BusinessIcon className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-lg font-bold text-slate-900">{activeProjects}</p>
          <p className="text-xs text-slate-500">Active</p>
        </Card>
        
        <Card padding="md" className="text-center">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-bold text-slate-900">{completedProjects}</p>
          <p className="text-xs text-slate-500">Complete</p>
        </Card>
      </div>

      {/* Alerts & Pending Actions */}
      {pendingVerifications > 0 && (
        <Card elevation={2} padding="none" className="overflow-hidden border-l-4 border-l-amber-500">
          <div className="bg-amber-50 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <PendingActionsIcon className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900">Pending Verifications</h3>
                <p className="text-sm text-amber-700">{pendingVerifications} users awaiting KYC approval</p>
              </div>
              <Link href="/admin/users?filter=pending">
                <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                  Review
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/admin/users">
          <Button fullWidth className="h-16 flex flex-col space-y-1" leftIcon={<GroupIcon className="w-6 h-6" />}>
            <span className="text-sm font-semibold">Manage Users</span>
            <span className="text-xs opacity-80">View all users & KYC</span>
          </Button>
        </Link>
        <Link href="/admin/analytics">
          <Button variant="outline" fullWidth className="h-16 flex flex-col space-y-1" leftIcon={<AssessmentIcon className="w-6 h-6" />}>
            <span className="text-sm font-semibold">View Analytics</span>
            <span className="text-xs opacity-60">Platform insights</span>
          </Button>
        </Link>
      </div>

      {/* Recent Platform Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
          <Link href="/admin/transactions">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
        
        <Card elevation={1} padding="none">
          {recentTransactions.map((transaction, index) => {
            const user = users.find(u => u.id === transaction.userId)
            
            return (
              <div key={transaction.id} className={`p-4 ${index !== recentTransactions.length - 1 ? 'border-b border-slate-100' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'investment' ? 'bg-sky-100' : 
                      transaction.type === 'dividend' ? 'bg-emerald-100' : 'bg-amber-100'
                    }`}>
                      {transaction.type === 'investment' ? (
                        <TrendingUpIcon className="w-5 h-5 text-sky-600" />
                      ) : transaction.type === 'dividend' ? (
                        <AttachMoneyIcon className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <SecurityIcon className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 capitalize">
                        {transaction.type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-slate-500">
                        {user?.name} • {getTimeAgo(transaction.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-lg ${
                      transaction.type === 'investment' ? 'text-sky-600' : 'text-emerald-600'
                    }`}>
                      {transaction.type === 'investment' ? '' : '+'}{formatCurrency(transaction.amount)}
                    </p>
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-emerald-100 text-emerald-800">
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
          
          {recentTransactions.length === 0 && (
            <div className="p-8 text-center">
              <AssessmentIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600">No recent transactions</p>
            </div>
          )}
        </Card>
      </div>

      {/* Recent User Registrations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Users</h2>
          <Link href="/admin/users">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
        
        <div className="space-y-3">
          {recentUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card elevation={1} padding="md" hover>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900">{user.name}</h3>
                      <p className="text-sm text-slate-600 capitalize">{user.role}</p>
                      <p className="text-xs text-slate-500">
                        {user.verificationDate ? getTimeAgo(user.verificationDate) : 'Pending verification'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.kycStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                      user.kycStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.kycStatus}
                    </span>
                    {user.kycStatus === 'verified' && (
                      <VerifiedUserIcon className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {recentUsers.length === 0 && (
          <Card padding="lg" className="text-center">
            <div className="py-8">
              <PersonAddIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No recent users</h3>
              <p className="text-slate-600">New user registrations will appear here</p>
            </div>
          </Card>
        )}
      </div>

      {/* System Health */}
      <Card elevation={1} padding="md">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">System Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
            <div>
              <p className="font-medium text-slate-900">Platform Health</p>
              <p className="text-sm text-emerald-600">All systems operational</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <SecurityIcon className="w-6 h-6 text-sky-600" />
            <div>
              <p className="font-medium text-slate-900">Security Status</p>
              <p className="text-sm text-sky-600">No threats detected</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 