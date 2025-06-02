'use client'

import { useStore } from '@/lib/store'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatCurrency, getTimeAgo } from '@/lib/utils'
import BusinessIcon from '@mui/icons-material/Business'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import GroupIcon from '@mui/icons-material/Group'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AddIcon from '@mui/icons-material/Add'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import NotificationsIcon from '@mui/icons-material/Notifications'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Transaction, Notification, Project } from '@/lib/types'

export default function DeveloperDashboard() {
  const { currentUser, projects, transactions, notifications } = useStore()

  if (!currentUser) return null

  // Get developer's projects and related data
  const developerProjects = projects.filter((project: Project) => project.developer === currentUser.name)
  const developerTransactions = transactions.filter((txn: Transaction) => 
    developerProjects.some(p => p.id === txn.projectId)
  ).slice(0, 10)
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

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Developer Portal</h1>
          <p className="text-slate-600">Manage your projects and track performance</p>
        </div>
        <div className="relative">
          <Button variant="ghost" size="sm" className="relative">
            <NotificationsIcon className="w-5 h-5" />
            {developerNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {developerNotifications.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card elevation={2} padding="md">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <AttachMoneyIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-500 font-medium">Funds Raised</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(totalFundsRaised)}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUpIcon className="w-3 h-3 text-emerald-600" />
                <span className="text-xs text-emerald-600 font-medium">+{avgFundingProgress}% avg</span>
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
              <p className="text-sm text-slate-500 font-medium">Total Investors</p>
              <p className="text-xl font-bold text-slate-900">{totalInvestors}</p>
              <p className="text-xs text-slate-500 mt-1">
                Across {developerProjects.length} project{developerProjects.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Project Status Overview */}
      <div className="grid grid-cols-4 gap-3">
        <Card padding="md" className="text-center">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <PendingIcon className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-lg font-bold text-slate-900">{projectsByStatus.funding}</p>
          <p className="text-xs text-slate-500">Funding</p>
        </Card>
        
        <Card padding="md" className="text-center">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-bold text-slate-900">{projectsByStatus.funded}</p>
          <p className="text-xs text-slate-500">Funded</p>
        </Card>
        
        <Card padding="md" className="text-center">
          <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <BusinessIcon className="w-4 h-4 text-violet-600" />
          </div>
          <p className="text-lg font-bold text-slate-900">{projectsByStatus.construction}</p>
          <p className="text-xs text-slate-500">Building</p>
        </Card>
        
        <Card padding="md" className="text-center">
          <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingUpIcon className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-lg font-bold text-slate-900">{projectsByStatus.completed}</p>
          <p className="text-xs text-slate-500">Complete</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/developer/projects/new">
          <Button fullWidth className="h-16 flex flex-col space-y-1" leftIcon={<AddIcon className="w-6 h-6" />}>
            <span className="text-sm font-semibold">Add Project</span>
            <span className="text-xs opacity-80">Create new listing</span>
          </Button>
        </Link>
        <Link href="/developer/analytics">
          <Button variant="outline" fullWidth className="h-16 flex flex-col space-y-1" leftIcon={<VisibilityIcon className="w-6 h-6" />}>
            <span className="text-sm font-semibold">View Analytics</span>
            <span className="text-xs opacity-60">Performance insights</span>
          </Button>
        </Link>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Projects</h2>
          <Link href="/developer/projects">
            <Button variant="ghost" size="sm">View All</Button>
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
                  <Card hover elevation={2} padding="none" className="overflow-hidden">
                    <div className="p-5">
                      <div className="flex space-x-4">
                        <img 
                          src={project.images[0]} 
                          alt={project.title}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-slate-900 text-base">{project.title}</h3>
                              <div className="flex items-center text-slate-600 mt-1">
                                <LocationOnIcon className="w-3 h-3 mr-1" />
                                <span className="text-sm">{project.location.city}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                project.status === 'funding' ? 'bg-amber-100 text-amber-800' :
                                project.status === 'funded' ? 'bg-emerald-100 text-emerald-800' :
                                project.status === 'construction' ? 'bg-violet-100 text-violet-800' :
                                'bg-sky-100 text-sky-800'
                              }`}>
                                {project.status}
                              </span>
                              <Button variant="ghost" size="sm">
                                <MoreHorizIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div className="text-center bg-slate-50 rounded-lg py-2">
                              <p className="text-xs text-slate-500 font-medium">Target</p>
                              <p className="text-sm font-semibold text-slate-900">{formatCurrency(project.financial.targetAmount)}</p>
                            </div>
                            <div className="text-center bg-emerald-50 rounded-lg py-2">
                              <p className="text-xs text-emerald-700 font-medium">Raised</p>
                              <p className="text-sm font-semibold text-emerald-700">
                                {formatCurrency(project.financial.currentAmount)}
                              </p>
                            </div>
                            <div className="text-center bg-sky-50 rounded-lg py-2">
                              <p className="text-xs text-sky-700 font-medium">Investors</p>
                              <p className="text-sm font-semibold text-sky-700">{project.investors}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Funding Progress</span>
                              <span className="font-semibold text-slate-900">{Math.round(fundingProgress)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-sky-500 to-sky-600 h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                              />
                            </div>
                            {project.status === 'funding' && daysLeft > 0 && (
                              <div className="flex items-center text-xs text-slate-500">
                                <CalendarTodayIcon className="w-3 h-3 mr-1" />
                                <span>{daysLeft} days remaining</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {developerProjects.length === 0 && (
          <Card padding="lg" className="text-center">
            <div className="py-8">
              <BusinessIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects yet</h3>
              <p className="text-slate-600 mb-6">Start by creating your first real estate project</p>
              <Link href="/developer/projects/new">
                <Button rightIcon={<AddIcon className="w-4 h-4" />}>
                  Create Project
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <Card elevation={1} padding="none">
          {developerTransactions.map((transaction, index) => (
            <div key={transaction.id} className={`p-4 ${index !== developerTransactions.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <AttachMoneyIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">New Investment</p>
                    <p className="text-sm text-slate-500">
                      {getTimeAgo(transaction.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg text-emerald-600">
                    +{formatCurrency(transaction.amount)}
                  </p>
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-emerald-100 text-emerald-800">
                    {transaction.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {developerTransactions.length === 0 && (
            <div className="p-8 text-center">
              <AttachMoneyIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600">No recent activity</p>
            </div>
          )}
        </Card>
      </div>

      {/* Notifications */}
      {developerNotifications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Updates</h2>
          <div className="space-y-3">
            {developerNotifications.map((notification) => (
              <Card key={notification.id} elevation={1} padding="md" className="border-l-4 border-l-sky-500">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900">{notification.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {getTimeAgo(notification.timestamp)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 