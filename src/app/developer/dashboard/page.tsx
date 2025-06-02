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
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
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

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card-highlight rounded-2xl p-6 interactive-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Recent Projects</h3>
                <p className="text-slate-600">Your latest property developments</p>
              </div>
              <Link href="/developer/projects">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="btn-premium text-white border-none"
                >
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {developerProjects.slice(0, 3).map((project, index) => {
                const fundingProgress = (project.financial.currentAmount / project.financial.targetAmount) * 100
                const daysLeft = Math.ceil((new Date(project.timeline.fundingDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/developer/projects/${project.id}`}>
                      <div className="glass-card interactive-card rounded-2xl p-5 overflow-hidden">
                        <div className="flex space-x-4">
                          <img 
                            src={project.images[0]} 
                            alt={project.title}
                            className="w-20 h-20 rounded-xl object-cover shadow-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-slate-900 text-lg">{project.title}</h4>
                                <div className="flex items-center text-slate-600 mt-1">
                                  <LocationOnIcon className="w-4 h-4 mr-1" />
                                  <span className="text-sm">{project.location.city}</span>
                                </div>
                              </div>
                              <MoreHorizIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Funding Progress</span>
                                <span className="font-semibold text-slate-900">{fundingProgress.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div 
                                  className="progress-bar h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${fundingProgress}%` }}
                                />
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">
                                  {formatCurrency(project.financial.currentAmount)} raised
                                </span>
                                <span className="text-xs text-slate-500">
                                  {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 