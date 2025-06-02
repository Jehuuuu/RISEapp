'use client'

import { useStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import { formatCurrency, getTimeAgo } from '@/lib/utils'
import GroupIcon from '@mui/icons-material/Group'
import BusinessIcon from '@mui/icons-material/Business'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AssessmentIcon from '@mui/icons-material/Assessment'
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

  // Enhanced stats with premium styling
  const quickStats = [
    {
      title: 'Total Volume',
      value: formatCurrency(totalInvestmentVolume),
      change: 'All-time',
      isPositive: true,
      icon: AttachMoneyIcon,
      gradient: 'gradient-success',
      glow: 'shadow-glow-green'
    },
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      change: `${verifiedUsers} verified`,
      isPositive: true,
      icon: GroupIcon,
      gradient: 'gradient-primary',
      glow: 'shadow-glow'
    }
  ]

  return (
    <div className="min-h-screen gradient-surface">
      {/* Enhanced Header with Glass Effect */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-blue-500/10 to-indigo-600/20"></div>
        <div className="relative px-4 pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">
                Admin Dashboard ⚙️
              </h1>
              <p className="text-slate-600 text-lg">
                Platform overview and <span className="text-emerald-600 font-semibold">management</span>
              </p>
            </div>
            <div className="flex space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center">
                  <RefreshIcon className="w-6 h-6 text-slate-600" />
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                  <NotificationsIcon className="w-6 h-6 text-white" />
                </div>
                {pendingVerifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{pendingVerifications}</span>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-4 space-y-8 pb-20">
        {/* Premium Stats Cards */}
        <div className="grid grid-cols-1 gap-4">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="animate-slide-up"
              >
                <div className={`card-premium interactive-card rounded-2xl p-6 ${stat.glow}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-slate-600 text-sm font-medium mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`w-16 h-16 ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg animate-float`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUpIcon className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-600">
                      {stat.change}
                    </span>
                    <span className="text-slate-500 text-sm">platform growth</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* User & Project Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-highlight rounded-2xl p-6 interactive-card">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Platform Statistics</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-4 glass-card rounded-xl">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <GroupIcon className="w-6 h-6 text-sky-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{totalInvestors}</p>
                <p className="text-sm text-slate-500">Investors</p>
              </div>
              
              <div className="text-center p-4 glass-card rounded-xl">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BusinessIcon className="w-6 h-6 text-violet-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{totalDevelopers}</p>
                <p className="text-sm text-slate-500">Developers</p>
              </div>
              
              <div className="text-center p-4 glass-card rounded-xl">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BusinessIcon className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{activeProjects}</p>
                <p className="text-sm text-slate-500">Active</p>
              </div>
              
              <div className="text-center p-4 glass-card rounded-xl">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{completedProjects}</p>
                <p className="text-sm text-slate-500">Complete</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alerts & Pending Actions */}
        {pendingVerifications > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card-premium interactive-card rounded-2xl p-6 border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-amber-100">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                  <PendingActionsIcon className="w-8 h-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-900 mb-1">Pending Verifications</h3>
                  <p className="text-amber-700">{pendingVerifications} users awaiting KYC approval</p>
                </div>
                <Link href="/admin/users?filter=pending">
                  <Button className="btn-premium">
                    Review
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <Link href="/admin/users">
            <div className="card-premium interactive-card rounded-2xl p-6 text-center gradient-primary text-white shadow-glow">
              <GroupIcon className="w-8 h-8 mx-auto mb-3" />
              <h4 className="font-semibold text-lg mb-1">Manage Users</h4>
              <p className="text-sm opacity-90">View all users & KYC</p>
            </div>
          </Link>
          <Link href="/admin/analytics">
            <div className="card-premium interactive-card rounded-2xl p-6 text-center border-2 border-sky-200 text-sky-700">
              <AssessmentIcon className="w-8 h-8 mx-auto mb-3" />
              <h4 className="font-semibold text-lg mb-1">View Analytics</h4>
              <p className="text-sm opacity-80">Platform insights</p>
            </div>
          </Link>
        </motion.div>

        {/* Recent System Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-1 truncate">Recent System Activity</h2>
              <p className="text-slate-600">Latest transactions and user activities</p>
            </div>
            <div className="flex-shrink-0">
              <Button 
                variant="outline" 
                size="sm"
                rightIcon={<RefreshIcon className="w-4 h-4" />}
                className="w-full sm:w-auto min-w-[120px]"
              >
                Refresh
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
              >
                <div className="card-premium interactive-card rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <AttachMoneyIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-slate-900 text-sm leading-tight truncate">
                            {`${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} Transaction`}
                          </h4>
                          <p className="text-xs text-slate-600 truncate">
                            {transaction.type} • {getTimeAgo(transaction.timestamp)}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-sm text-slate-900">
                            {formatCurrency(transaction.amount)}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {transaction.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 