'use client'

import { useStore } from '@/lib/store'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import BusinessIcon from '@mui/icons-material/Business'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PeopleIcon from '@mui/icons-material/People'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function AdminProjects() {
  const { projects } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Filter and search projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.developer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const getProjectStats = () => {
    const total = projects.length
    const funding = projects.filter(p => p.status === 'funding').length
    const funded = projects.filter(p => p.status === 'funded').length
    const construction = projects.filter(p => p.status === 'construction').length
    const completed = projects.filter(p => p.status === 'completed').length
    const totalValue = projects.reduce((sum, p) => sum + p.financial.targetAmount, 0)
    const totalRaised = projects.reduce((sum, p) => sum + p.financial.currentAmount, 0)
    
    return { total, funding, funded, construction, completed, totalValue, totalRaised }
  }

  const stats = getProjectStats()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'funding': return 'text-sky-600 bg-sky-50'
      case 'funded': return 'text-emerald-600 bg-emerald-50'
      case 'construction': return 'text-amber-600 bg-amber-50'
      case 'completed': return 'text-violet-600 bg-violet-50'
      default: return 'text-slate-600 bg-slate-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'funding': return <PendingIcon className="w-4 h-4" />
      case 'funded': return <CheckCircleIcon className="w-4 h-4" />
      case 'construction': return <PendingIcon className="w-4 h-4" />
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />
      default: return <PendingIcon className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Project Management</h1>
        <p className="text-slate-600">{filteredProjects.length} of {projects.length} projects</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card elevation={1} padding="md" className="text-center">
          <BusinessIcon className="w-8 h-8 text-sky-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-sm text-slate-600">Total Projects</p>
        </Card>
        
        <Card elevation={1} padding="md" className="text-center">
          <CheckCircleIcon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.funded}</p>
          <p className="text-sm text-slate-600">Funded</p>
        </Card>
        
        <Card elevation={1} padding="md" className="text-center">
          <PendingIcon className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.funding}</p>
          <p className="text-sm text-slate-600">Active Funding</p>
        </Card>
        
        <Card elevation={1} padding="md" className="text-center">
          <BusinessIcon className="w-8 h-8 text-violet-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
          <p className="text-sm text-slate-600">Completed</p>
        </Card>
      </div>

      {/* Platform Overview */}
      <Card elevation={2} padding="lg" className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Platform Overview</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-600">Total Project Value</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalValue)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Capital Raised</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalRaised)}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Platform Funding Progress</span>
            <span>{Math.round((stats.totalRaised / stats.totalValue) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="progress-bar h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((stats.totalRaised / stats.totalValue) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      <Card elevation={1} padding="lg" className="mb-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects by title, developer, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Status</option>
            <option value="funding">Active Funding</option>
            <option value="funded">Funded</option>
            <option value="construction">Construction</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </Card>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card elevation={2} padding="lg" hover className="cursor-pointer">
              <div className="flex items-start space-x-4">
                <img 
                  src={project.images[0]} 
                  alt={project.title}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-slate-600">By {project.developer}</p>
                    </div>
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      <span className="capitalize">{project.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <LocationOnIcon className="w-4 h-4" />
                      <span>{project.location.city}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <PeopleIcon className="w-4 h-4" />
                      <span>{project.investors} investors</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BusinessIcon className="w-4 h-4" />
                      <span>{project.totalUnits} units</span>
                    </div>
                  </div>
                  
                  {/* Funding Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">Funding Progress</span>
                      <span className="text-sm font-medium text-slate-900">
                        {Math.round((project.financial.currentAmount / project.financial.targetAmount) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="progress-bar h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((project.financial.currentAmount / project.financial.targetAmount) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 mt-1">
                      <span>{formatCurrency(project.financial.currentAmount)} raised</span>
                      <span>{formatCurrency(project.financial.targetAmount)} target</span>
                    </div>
                  </div>
                  
                  {/* Financial Details */}
                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div>
                      <p className="text-xs text-slate-500">ROI</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {project.financial.projectedROI}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Min Investment</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatCurrency(project.financial.minimumInvestment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Rental Yield</p>
                      <p className="text-sm font-semibold text-emerald-600">
                        {project.financial.annualRentalYield}%
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      Listed: {new Date(project.timeline.listingDate).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<VisibilityIcon className="w-4 h-4" />}
                      >
                        Review
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<EditIcon className="w-4 h-4" />}
                      >
                        Manage
                      </Button>
                      {project.status === 'funding' && (
                        <Button
                          size="sm"
                          className="gradient-primary text-white"
                        >
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <BusinessIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Projects Found</h3>
          <p className="text-slate-600 mb-6">Try adjusting your search or filter criteria</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('')
              setFilterStatus('all')
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
} 