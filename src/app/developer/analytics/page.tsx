'use client'

import { useStore } from '@/lib/store'
import Card from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import BarChartIcon from '@mui/icons-material/BarChart'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TimelineIcon from '@mui/icons-material/Timeline'
import AssessmentIcon from '@mui/icons-material/Assessment'
import { motion } from 'framer-motion'

export default function DeveloperAnalytics() {
  const { projects, currentUser } = useStore()
  
  // Filter data by current developer
  const myProjects = projects.filter(project => 
    project.developer === currentUser?.name
  )

  // Calculate analytics
  const totalRaised = myProjects.reduce((sum, p) => sum + p.financial.currentAmount, 0)
  const totalTarget = myProjects.reduce((sum, p) => sum + p.financial.targetAmount, 0)
  const totalInvestors = myProjects.reduce((sum, p) => sum + p.investors, 0)
  const avgProjectROI = myProjects.reduce((sum, p) => sum + p.financial.projectedROI, 0) / myProjects.length || 0
  
  const performanceMetrics = [
    {
      title: 'Total Capital Raised',
      value: formatCurrency(totalRaised),
      change: '+12.5%',
      positive: true,
      icon: AttachMoneyIcon,
      color: 'sky'
    },
    {
      title: 'Active Projects',
      value: myProjects.filter(p => p.status === 'funding').length.toString(),
      change: '+2',
      positive: true,
      icon: BarChartIcon,
      color: 'emerald'
    },
    {
      title: 'Total Investors',
      value: totalInvestors.toString(),
      change: '+15.2%',
      positive: true,
      icon: PeopleIcon,
      color: 'violet'
    },
    {
      title: 'Average ROI',
      value: `${avgProjectROI.toFixed(1)}%`,
      change: '+0.8%',
      positive: true,
      icon: TrendingUpIcon,
      color: 'amber'
    }
  ]

  const projectPerformance = myProjects.map(project => ({
    ...project,
    fundingPercentage: (project.financial.currentAmount / project.financial.targetAmount) * 100,
    revenue: project.financial.currentAmount * 0.05 // 5% platform fee
  })).sort((a, b) => b.fundingPercentage - a.fundingPercentage)

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
        <p className="text-slate-600">Performance insights for your projects</p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {performanceMetrics.map((metric, index) => (
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

      {/* Funding Overview */}
      <Card elevation={2} padding="lg" className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Funding Overview</h3>
          <AssessmentIcon className="w-6 h-6 text-slate-600" />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="text-sm text-slate-600">Total Target</p>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(totalTarget)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Raised</p>
              <p className="text-xl font-bold text-sky-600">{formatCurrency(totalRaised)}</p>
            </div>
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="progress-bar h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalRaised / totalTarget) * 100, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-slate-600">
            <span>{Math.round((totalRaised / totalTarget) * 100)}% of total target</span>
            <span>{formatCurrency(totalTarget - totalRaised)} remaining</span>
          </div>
        </div>
      </Card>

      {/* Project Performance */}
      <Card elevation={2} padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Project Performance</h3>
          <TimelineIcon className="w-6 h-6 text-slate-600" />
        </div>
        
        <div className="space-y-4">
          {projectPerformance.slice(0, 5).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <img 
                src={project.images[0]} 
                alt={project.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">
                  {project.title}
                </h4>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-slate-600">{project.location.city}</span>
                  <span className="text-xs text-emerald-600 font-medium">
                    {project.fundingPercentage.toFixed(1)}% funded
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">
                  {formatCurrency(project.financial.currentAmount)}
                </p>
                <p className="text-xs text-slate-600">
                  {project.investors} investors
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {projectPerformance.length === 0 && (
          <div className="text-center py-12">
            <BarChartIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600">No project data available</p>
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <Card elevation={1} padding="lg" className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
          <VisibilityIcon className="w-5 h-5 text-slate-600" />
        </div>
        
        <div className="space-y-3">
          {[
            { time: '2 hours ago', action: 'New investment received', amount: '₱250,000', project: 'Ortigas Central Tower' },
            { time: '6 hours ago', action: 'Project milestone reached', amount: '75%', project: 'BGC Residences' },
            { time: '1 day ago', action: 'Funding target achieved', amount: '₱15M', project: 'Makati Heights' },
            { time: '2 days ago', action: 'New investor joined', amount: '₱500,000', project: 'Cebu Bay View' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                <p className="text-xs text-slate-600">{activity.project} • {activity.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-sky-600">{activity.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
} 