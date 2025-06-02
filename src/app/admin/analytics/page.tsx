'use client'

import { useStore } from '@/lib/store'
import Card from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import BusinessIcon from '@mui/icons-material/Business'
import AssessmentIcon from '@mui/icons-material/Assessment'
import { motion } from 'framer-motion'

export default function AdminAnalytics() {
  const { projects, users } = useStore()
  
  // Calculate platform metrics
  const totalUsers = users.length
  const totalProjects = projects.length
  const totalValue = projects.reduce((sum, p) => sum + p.financial.targetAmount, 0)
  const totalRaised = projects.reduce((sum, p) => sum + p.financial.currentAmount, 0)
  const totalInvestors = users.filter(u => u.role === 'investor').length
  const totalDevelopers = users.filter(u => u.role === 'developer').length
  const avgInvestment = totalInvestors > 0 ? totalRaised / totalInvestors : 0

  const platformMetrics = [
    {
      title: 'Total Platform Value',
      value: formatCurrency(totalValue),
      change: '+23.5%',
      positive: true,
      icon: AttachMoneyIcon,
      color: 'sky'
    },
    {
      title: 'Capital Raised',
      value: formatCurrency(totalRaised),
      change: '+18.2%',
      positive: true,
      icon: TrendingUpIcon,
      color: 'emerald'
    },
    {
      title: 'Active Users',
      value: totalUsers.toString(),
      change: '+12.1%',
      positive: true,
      icon: PeopleIcon,
      color: 'violet'
    },
    {
      title: 'Total Projects',
      value: totalProjects.toString(),
      change: '+8.7%',
      positive: true,
      icon: BusinessIcon,
      color: 'amber'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Platform Analytics</h1>
        <p className="text-slate-600">Comprehensive platform performance insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {platformMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card elevation={2} padding="lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-slate-600 font-medium">{metric.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{metric.value}</p>
                  <div className={`inline-flex items-center space-x-1 mt-2 ${
                    metric.positive ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    <TrendingUpIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{metric.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-${metric.color}-100 rounded-xl flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Platform Overview */}
      <Card elevation={2} padding="lg" className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Platform Performance</h3>
          <AssessmentIcon className="w-6 h-6 text-slate-600" />
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-slate-600">Platform Funding Rate</p>
            <p className="text-3xl font-bold text-emerald-600">
              {Math.round((totalRaised / totalValue) * 100)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Average Investment</p>
            <p className="text-3xl font-bold text-sky-600">
              {formatCurrency(avgInvestment)}
            </p>
          </div>
        </div>
        
        <div className="w-full bg-slate-200 rounded-full h-4 mb-4">
          <div 
            className="progress-bar h-4 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((totalRaised / totalValue) * 100, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm text-slate-600">
          <span>{formatCurrency(totalRaised)} raised of {formatCurrency(totalValue)} target</span>
          <span>{formatCurrency(totalValue - totalRaised)} remaining</span>
        </div>
      </Card>

      {/* User Breakdown */}
      <Card elevation={2} padding="lg" className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">User Distribution</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-sky-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
              <span className="font-medium text-slate-900">Investors</span>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-slate-900">{totalInvestors}</p>
              <p className="text-sm text-slate-600">{Math.round((totalInvestors / totalUsers) * 100)}%</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-violet-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
              <span className="font-medium text-slate-900">Developers</span>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-slate-900">{totalDevelopers}</p>
              <p className="text-sm text-slate-600">{Math.round((totalDevelopers / totalUsers) * 100)}%</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card elevation={1} padding="lg">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Platform Activity</h3>
        
        <div className="space-y-3">
          {[
            { time: '15 minutes ago', action: 'New project submitted', detail: 'Cebu Bay View by Vista Land', type: 'project' },
            { time: '1 hour ago', action: 'Large investment made', detail: '₱2.5M in BGC Residences', type: 'investment' },
            { time: '2 hours ago', action: 'Project milestone reached', detail: 'Makati Heights 90% funded', type: 'milestone' },
            { time: '4 hours ago', action: 'New developer registered', detail: 'Premium Properties Inc.', type: 'user' },
            { time: '6 hours ago', action: 'KYC verification completed', detail: '25 users verified today', type: 'verification' },
            { time: '8 hours ago', action: 'Project fully funded', detail: 'Ortigas Central Tower', type: 'completed' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                <p className="text-xs text-slate-600">{activity.detail}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">{activity.time}</p>
                <div className={`inline-block w-2 h-2 rounded-full mt-1 ${
                  activity.type === 'investment' ? 'bg-emerald-500' :
                  activity.type === 'project' ? 'bg-sky-500' :
                  activity.type === 'milestone' ? 'bg-amber-500' :
                  activity.type === 'completed' ? 'bg-violet-500' :
                  'bg-slate-400'
                }`}></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
} 