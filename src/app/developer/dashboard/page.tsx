'use client'

import { useStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import BusinessIcon from '@mui/icons-material/Business'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import GroupIcon from '@mui/icons-material/Group'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AddIcon from '@mui/icons-material/Add'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import NotificationsIcon from '@mui/icons-material/Notifications'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Notification, Project } from '@/lib/types'

export default function DeveloperDashboard() {
  const { currentUser, projects, notifications } = useStore()

  if (!currentUser) return null

  // Get developer's projects and related data
  const developerProjects = projects.filter((project: Project) => project.developer === currentUser.name)
  const developerNotifications = notifications.filter((notif: Notification) => 
    notif.userId === currentUser.id && !notif.read
  ).slice(0, 5)

  // Calculate metrics
  const totalFundsRaised = developerProjects.reduce((sum, project) => 
    sum + project.financial.currentAmount, 0
  )
  const totalInvestors = developerProjects.reduce((sum, project) => 
    sum + project.investors, 0
  )
  const avgFundingProgress = developerProjects.length > 0 
    ? (developerProjects.reduce((sum, project) => 
        sum + (project.financial.currentAmount / project.financial.targetAmount), 0
      ) / developerProjects.length * 100).toFixed(1)
    : 0

  const projectsByStatus = {
    funding: developerProjects.filter(p => p.status === 'funding').length,
    funded: developerProjects.filter(p => p.status === 'funded').length,
    construction: developerProjects.filter(p => p.status === 'construction').length,
    completed: developerProjects.filter(p => p.status === 'completed').length,
  }

  // Enhanced stats with premium styling
  const quickStats = [
    {
      title: 'Funds Raised',
      value: formatCurrency(totalFundsRaised),
      change: `+${avgFundingProgress}% avg`,
      isPositive: true,
      icon: AttachMoneyIcon,
      gradient: 'gradient-success',
      glow: 'shadow-glow-green'
    },
    {
      title: 'Total Investors',
      value: totalInvestors.toString(),
      change: `${developerProjects.length} projects`,
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
                Developer Portal 🏗️
              </h1>
              <p className="text-slate-600 text-lg">
                Manage your projects and <span className="text-emerald-600 font-semibold">track performance</span>
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                <NotificationsIcon className="w-6 h-6 text-white" />
              </div>
              {developerNotifications.length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{developerNotifications.length}</span>
                </div>
              )}
            </motion.div>
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
                    <span className="text-slate-500 text-sm">from last month</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Project Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-highlight rounded-2xl p-6 interactive-card">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Project Status Overview</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-4 glass-card rounded-xl">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PendingIcon className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{projectsByStatus.funding}</p>
                <p className="text-sm text-slate-500">Funding</p>
              </div>
              
              <div className="text-center p-4 glass-card rounded-xl">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{projectsByStatus.funded}</p>
                <p className="text-sm text-slate-500">Funded</p>
              </div>
              
              <div className="text-center p-4 glass-card rounded-xl">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BusinessIcon className="w-6 h-6 text-violet-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{projectsByStatus.construction}</p>
                <p className="text-sm text-slate-500">Building</p>
              </div>
              
              <div className="text-center p-4 glass-card rounded-xl">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUpIcon className="w-6 h-6 text-sky-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{projectsByStatus.completed}</p>
                <p className="text-sm text-slate-500">Complete</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <Link href="/developer/projects/new">
            <div className="card-premium interactive-card rounded-2xl p-6 text-center gradient-primary text-white shadow-glow">
              <AddIcon className="w-8 h-8 mx-auto mb-3" />
              <h4 className="font-semibold text-lg mb-1">Add Project</h4>
              <p className="text-sm opacity-90">Create new listing</p>
            </div>
          </Link>
          <Link href="/developer/analytics">
            <div className="card-premium interactive-card rounded-2xl p-6 text-center border-2 border-sky-200 text-sky-700">
              <VisibilityIcon className="w-8 h-8 mx-auto mb-3" />
              <h4 className="font-semibold text-lg mb-1">View Analytics</h4>
              <p className="text-sm opacity-80">Performance insights</p>
            </div>
          </Link>
        </motion.div>

        {/* Active Projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-1 truncate">Active Projects</h2>
              <p className="text-slate-600">Monitor your development portfolio</p>
            </div>
            <div className="flex-shrink-0">
              <Link href="/developer/projects">
                <Button 
                  variant="outline" 
                  size="sm"
                  rightIcon={<VisibilityIcon className="w-4 h-4" />}
                  className="w-full sm:w-auto min-w-[140px]"
                >
                  View All
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {developerProjects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Link href={`/developer/projects/${project.id}`}>
                  <div className="card-premium interactive-card rounded-2xl overflow-hidden">
                    <div className="flex min-h-[120px]">
                      {/* Project Image */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 relative overflow-hidden rounded-l-2xl flex-shrink-0">
                        <img 
                          src={project.images[0]} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg ${
                            project.status === 'funding' 
                              ? 'bg-blue-500 text-white' 
                              : project.status === 'construction'
                              ? 'bg-orange-500 text-white'
                              : 'bg-green-500 text-white'
                          }`}>
                            {project.status === 'funding' && <PendingIcon className="w-3 h-3 flex-shrink-0" />}
                            {project.status === 'construction' && <PendingIcon className="w-3 h-3 flex-shrink-0" />}
                            {project.status === 'completed' && <CheckCircleIcon className="w-3 h-3 flex-shrink-0" />}
                            <span className="whitespace-nowrap capitalize">{project.status}</span>
                          </div>
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="flex-1 p-4 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-slate-900 text-base leading-tight mb-1 line-clamp-2">
                              {project.title}
                            </h3>
                            <p className="text-slate-600 text-sm truncate flex items-center">
                              <LocationOnIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                              {project.location.city}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0 min-w-[60px]">
                            <div className="text-lg font-bold text-blue-600">
                              {project.financial.projectedROI}%
                            </div>
                            <div className="text-xs text-slate-500">ROI</div>
                          </div>
                        </div>

                        {/* Enhanced Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs gap-2">
                            <span className="text-slate-600 truncate">
                              {formatCurrency(project.financial.minimumInvestment)} min
                            </span>
                            <span className="font-semibold text-slate-900 flex-shrink-0">
                              {Math.round((project.financial.currentAmount / project.financial.targetAmount) * 100)}% funded
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ 
                                width: `${Math.min((project.financial.currentAmount / project.financial.targetAmount) * 100, 100)}%` 
                              }}
                              transition={{ duration: 1, delay: 0.8 + index * 0.2 }}
                              className="progress-bar h-2 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 