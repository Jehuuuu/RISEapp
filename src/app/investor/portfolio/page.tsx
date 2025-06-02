'use client'

import { useStore } from '@/lib/store'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatCurrency, getTimeAgo } from '@/lib/utils'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { motion } from 'framer-motion'
import Link from 'next/link'
import PerformanceChart from '@/components/charts/PerformanceChart'

export default function Portfolio() {
  const { currentUser, projects, investments, transactions } = useStore()

  if (!currentUser) return null

  // Get user's investments and related data
  const userInvestments = investments.filter(inv => inv.userId === currentUser.id)
  const userTransactions = transactions.filter(txn => txn.userId === currentUser.id)
  
  // Get projects user has invested in
  const investedProjects = projects.filter(project => 
    userInvestments.some(inv => inv.projectId === project.id)
  )

  // Calculate total returns
  const totalReturns = userInvestments.reduce((sum, inv) => 
    sum + inv.returns.reduce((returnSum, ret) => returnSum + ret.amount, 0), 0
  )

  // Calculate portfolio change percentage
  const portfolioChangePercent = totalReturns > 0 ? ((totalReturns / currentUser.stats.totalInvested) * 100).toFixed(1) : 0

  // Performance data for chart
  const performanceData = [
    { month: 'Jan', value: 2500000, returns: 0 },
    { month: 'Feb', value: 2625000, returns: 125000 },
    { month: 'Mar', value: 2756000, returns: 256000 },
    { month: 'Apr', value: 2825000, returns: 325000 },
    { month: 'May', value: 2892000, returns: 392000 },
    { month: 'Jun', value: 2925000, returns: 425000 },
  ]

  return (
    <div className="min-h-screen gradient-surface pb-20">
      {/* Enhanced Header with Glass Effect */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-sky-500/10 to-blue-600/20"></div>
        <div className="relative px-4 pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-gradient mb-2">My Portfolio</h1>
            <p className="text-slate-600 text-lg">Track your wealth building journey</p>
          </motion.div>
        </div>
      </div>

      <div className="px-4 space-y-8">
        {/* Enhanced Portfolio Summary */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="card-premium interactive-card rounded-2xl p-6 shadow-glow-green">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 gradient-success rounded-2xl flex items-center justify-center shadow-lg animate-float">
                  <AccountBalanceWalletIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-600 text-sm font-medium mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-slate-900 mb-1">
                    {formatCurrency(currentUser.stats.portfolioValue)}
                  </p>
                  <div className="flex items-center space-x-1">
                    <TrendingUpIcon className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-600">+{portfolioChangePercent}%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card-premium interactive-card rounded-2xl p-6 shadow-glow">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg animate-float">
                  <ShowChartIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-600 text-sm font-medium mb-1">Total Returns</p>
                  <p className="text-2xl font-bold text-slate-900 mb-1">
                    {formatCurrency(totalReturns)}
                  </p>
                  <p className="text-xs text-slate-500">
                    From {userInvestments.length} investment{userInvestments.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="glass-card rounded-2xl p-4 text-center interactive-card">
            <div className="w-12 h-12 gradient-warning rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <AccountBalanceIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-xl font-bold text-slate-900 mb-1">{currentUser.stats.activeInvestments}</div>
            <div className="text-xs text-slate-500 font-medium">Active</div>
          </div>
          
          <div className="glass-card rounded-2xl p-4 text-center interactive-card">
            <div className="w-12 h-12 gradient-success rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <TrendingUpIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-xl font-bold text-slate-900 mb-1">
              {(currentUser.stats.portfolioValue / currentUser.stats.totalInvested * 100 - 100).toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500 font-medium">ROI</div>
          </div>
          
          <div className="glass-card rounded-2xl p-4 text-center interactive-card">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <AccountBalanceWalletIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-xl font-bold text-slate-900 mb-1">
              {formatCurrency(currentUser.stats.totalInvested).replace('₱', '')}
            </div>
            <div className="text-xs text-slate-500 font-medium">Invested</div>
          </div>
        </motion.div>

        {/* Performance Chart */}
        <Card elevation={2} padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Portfolio Performance</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
                <span className="text-slate-600">Portfolio Value</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-slate-600">Returns</span>
              </div>
            </div>
          </div>
          <PerformanceChart 
            data={performanceData} 
            type="area" 
            height={180}
            animated={true}
          />
        </Card>

        {/* Active Investments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Active Investments</h2>
            <Link href="/investor/browse">
              <Button variant="outline" size="sm" rightIcon={<ArrowOutwardIcon className="w-4 h-4" />}>
                Add More
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {investedProjects.map((project, index) => {
              const investment = userInvestments.find(inv => inv.projectId === project.id)
              if (!investment) return null

              const investmentReturns = investment.returns.reduce((sum, ret) => sum + ret.amount, 0)
              const currentValue = investment.amount + investmentReturns
              const profitLoss = investmentReturns
              const profitLossPercent = ((profitLoss / investment.amount) * 100).toFixed(1)

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/investor/project/${project.id}`}>
                    <Card hover elevation={2} padding="none" className="overflow-hidden">
                      <div className="p-5">
                        <div className="flex space-x-4">
                          <div className="relative">
                            <img 
                              src={project.images[0]} 
                              alt={project.title}
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                              <TrendingUpIcon className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-slate-900 text-base">{project.title}</h3>
                                <div className="flex items-center text-slate-600 mt-1">
                                  <LocationOnIcon className="w-3 h-3 mr-1" />
                                  <span className="text-sm">{project.location.city}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                  Invested {getTimeAgo(investment.date)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-slate-900 text-lg">
                                  {formatCurrency(currentValue)}
                                </p>
                                <div className="flex items-center justify-end space-x-1">
                                  <TrendingUpIcon className="w-3 h-3 text-emerald-600" />
                                  <span className="text-sm text-emerald-600 font-medium">
                                    +{profitLossPercent}%
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 grid grid-cols-3 gap-4">
                              <div className="text-center bg-slate-50 rounded-lg py-2">
                                <p className="text-xs text-slate-500 font-medium">Invested</p>
                                <p className="text-sm font-semibold text-slate-900">{formatCurrency(investment.amount)}</p>
                              </div>
                              <div className="text-center bg-emerald-50 rounded-lg py-2">
                                <p className="text-xs text-emerald-700 font-medium">Returns</p>
                                <p className="text-sm font-semibold text-emerald-700">
                                  +{formatCurrency(investmentReturns)}
                                </p>
                              </div>
                              <div className="text-center bg-sky-50 rounded-lg py-2">
                                <p className="text-xs text-sky-700 font-medium">Ownership</p>
                                <p className="text-sm font-semibold text-sky-700">
                                  {(investment.shares * 100).toFixed(2)}%
                                </p>
                              </div>
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

          {investedProjects.length === 0 && (
            <Card padding="lg" className="text-center">
              <div className="py-8">
                <AccountBalanceIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No investments yet</h3>
                <p className="text-slate-600 mb-6">Start building your real estate portfolio today</p>
                <Link href="/investor/browse">
                  <Button rightIcon={<ArrowOutwardIcon className="w-4 h-4" />}>
                    Browse Projects
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Recent Transactions */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Transactions</h2>
          <Card elevation={1} padding="none">
            {userTransactions.slice(0, 10).map((transaction, index) => (
              <div key={transaction.id} className={`p-4 ${index !== Math.min(userTransactions.length - 1, 9) ? 'border-b border-slate-100' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'investment' ? 'bg-sky-100' : 'bg-emerald-100'
                    }`}>
                      {transaction.type === 'investment' ? (
                        <AccountBalanceIcon className="w-5 h-5 text-sky-600" />
                      ) : (
                        <AccountBalanceWalletIcon className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 capitalize">
                        {transaction.type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-slate-500">
                        {getTimeAgo(transaction.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-lg ${
                      transaction.type === 'investment' ? 'text-sky-600' : 'text-emerald-600'
                    }`}>
                      {transaction.type === 'investment' ? '' : '+'}{formatCurrency(transaction.amount)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      transaction.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      transaction.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {userTransactions.length === 0 && (
              <div className="p-8 text-center">
                <AccountBalanceWalletIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">No transactions yet</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
} 