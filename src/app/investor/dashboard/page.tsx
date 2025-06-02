'use client'

import { useStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import BarChartIcon from '@mui/icons-material/BarChart'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PersonIcon from '@mui/icons-material/Person'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import StarIcon from '@mui/icons-material/Star'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { motion } from 'framer-motion'
import Link from 'next/link'
import FloatingActionButton from '@/components/ui/FloatingActionButton'

export default function InvestorDashboard() {
  const { currentUser, projects } = useStore()

  if (!currentUser) return null

  // Enhanced mock data for premium dashboard
  const quickStats = [
    {
      title: 'Total Portfolio',
      value: formatCurrency(currentUser.stats.portfolioValue),
      change: '+12.5%',
      isPositive: true,
      icon: AccountBalanceWalletIcon,
      gradient: 'gradient-primary',
      glow: 'shadow-glow'
    },
    {
      title: 'Monthly Returns',
      value: formatCurrency(125000),
      change: '+8.2%',
      isPositive: true,
      icon: TrendingUpIcon,
      gradient: 'gradient-success',
      glow: 'shadow-glow-green'
    },
    {
      title: 'Active Investments',
      value: currentUser.stats.activeInvestments.toString(),
      change: '+2',
      isPositive: true,
      icon: BarChartIcon,
      gradient: 'gradient-warning',
      glow: 'shadow-glow'
    }
  ]

  const featuredProjects = projects.filter(p => p.status === 'funding').slice(0, 3)

  // Calculate portfolio performance (mock data for demo)
  const portfolioChange = 12.5 // percentage
  const monthlyReturns = 8750

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
                Welcome back, {currentUser.name.split(' ')[0]} 👋
              </h1>
              <p className="text-slate-600 text-lg">
                Your wealth is growing <span className="text-emerald-600 font-semibold">+12.5%</span> this month
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
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
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
                    {stat.isPositive ? (
                      <TrendingUpIcon className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <TrendingDownIcon className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-semibold ${stat.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                    <span className="text-slate-500 text-sm">from last month</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Portfolio Performance Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-highlight rounded-2xl p-6 interactive-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Portfolio Overview</h3>
                <p className="text-slate-600">Your investment performance this quarter</p>
              </div>
              <Link href="/investor/portfolio">
                <Button 
                  variant="outline" 
                  size="sm" 
                  rightIcon={<ArrowOutwardIcon className="w-4 h-4" />}
                  className="btn-premium text-white border-none"
                >
                  View Details
                </Button>
              </Link>
            </div>
            
            {/* Enhanced Progress Visualization */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 glass-card rounded-xl">
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    {formatCurrency(currentUser.stats.totalInvested)}
                  </div>
                  <div className="text-sm text-slate-600">Total Invested</div>
                </div>
                <div className="text-center p-4 glass-card rounded-xl">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">
                    {formatCurrency(currentUser.stats.portfolioValue - currentUser.stats.totalInvested)}
                  </div>
                  <div className="text-sm text-slate-600">Total Returns</div>
                </div>
              </div>
              
              {/* Animated Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Investment Goal Progress</span>
                  <span className="font-semibold text-slate-900">72%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '72%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="progress-bar h-3 rounded-full"
                  />
                </div>
                <p className="text-xs text-slate-500">₱780K of ₱1M goal reached</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Featured Investment Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Featured Opportunities</h2>
              <p className="text-slate-600">Handpicked investments for you</p>
            </div>
            <Link href="/investor/browse">
              <Button 
                variant="outline" 
                size="sm"
                rightIcon={<ArrowOutwardIcon className="w-4 h-4" />}
              >
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Link href={`/investor/project/${project.id}`}>
                  <div className="card-premium interactive-card rounded-2xl overflow-hidden">
                    <div className="flex">
                      {/* Project Image */}
                      <div className="w-24 h-24 relative overflow-hidden rounded-l-2xl">
                        <img 
                          src={project.images[0]} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <div className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                            <StarIcon className="w-3 h-3" />
                            <span>Featured</span>
                          </div>
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">
                              {project.title}
                            </h3>
                            <p className="text-slate-600 text-sm">{project.location.city}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-emerald-600">
                              {project.financial.projectedROI}%
                            </div>
                            <div className="text-xs text-slate-500">ROI</div>
                          </div>
                        </div>

                        {/* Enhanced Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600">
                              {formatCurrency(project.financial.minimumInvestment)} min
                            </span>
                            <span className="font-semibold text-slate-900">
                              {Math.round((project.financial.currentAmount / project.financial.targetAmount) * 100)}% funded
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ 
                                width: `${(project.financial.currentAmount / project.financial.targetAmount) * 100}%` 
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 gap-4"
        >
          <Link href="/investor/browse">
            <div className="card-highlight interactive-card rounded-2xl p-6 text-center">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3 shadow-glow">
                <BarChartIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Explore Projects</h3>
              <p className="text-sm text-slate-600">Discover new opportunities</p>
            </div>
          </Link>
          
          <Link href="/profile">
            <div className="card-highlight interactive-card rounded-2xl p-6 text-center">
              <div className="w-12 h-12 gradient-success rounded-xl flex items-center justify-center mx-auto mb-3 shadow-glow-green">
                <PersonIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">My Profile</h3>
              <p className="text-sm text-slate-600">Manage account settings</p>
            </div>
          </Link>
        </motion.div>
      </div>
      
      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  )
} 