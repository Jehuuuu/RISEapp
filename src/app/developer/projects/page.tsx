'use client'

import { useStore } from '@/lib/store'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import BusinessIcon from '@mui/icons-material/Business'
import AddIcon from '@mui/icons-material/Add'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import { motion } from 'framer-motion'

export default function DeveloperProjects() {
  const { projects, currentUser } = useStore()
  
  // Filter projects by current developer
  const myProjects = projects.filter(project => 
    project.developer === currentUser?.name
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-600 bg-emerald-50'
      case 'pending': return 'text-amber-600 bg-amber-50'
      case 'completed': return 'text-sky-600 bg-sky-50'
      default: return 'text-slate-600 bg-slate-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="w-4 h-4" />
      case 'pending': return <PendingIcon className="w-4 h-4" />
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />
      default: return <PendingIcon className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
          <p className="text-slate-600">{myProjects.length} active projects</p>
        </div>
        <Button
          className="gradient-primary text-white shadow-glow"
          leftIcon={<AddIcon className="w-5 h-5" />}
        >
          New Project
        </Button>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card elevation={1} padding="md" className="text-center">
          <BusinessIcon className="w-8 h-8 text-sky-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{myProjects.length}</p>
          <p className="text-sm text-slate-600">Total Projects</p>
        </Card>
        
        <Card elevation={1} padding="md" className="text-center">
          <TrendingUpIcon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(myProjects.reduce((sum, p) => sum + p.financial.currentAmount, 0))}
          </p>
          <p className="text-sm text-slate-600">Total Raised</p>
        </Card>
        
        <Card elevation={1} padding="md" className="text-center">
          <PeopleIcon className="w-8 h-8 text-violet-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">
            {myProjects.reduce((sum, p) => sum + p.investors, 0)}
          </p>
          <p className="text-sm text-slate-600">Investors</p>
        </Card>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {myProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
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
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                      {project.title}
                    </h3>
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
                  </div>
                  
                  {/* Progress */}
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
                  
                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<VisibilityIcon className="w-4 h-4" />}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<EditIcon className="w-4 h-4" />}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {myProjects.length === 0 && (
        <div className="text-center py-16">
          <BusinessIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Projects Yet</h3>
          <p className="text-slate-600 mb-6">Start your first project to begin raising funds</p>
          <Button
            className="gradient-primary text-white shadow-glow"
            leftIcon={<AddIcon className="w-5 h-5" />}
          >
            Create Your First Project
          </Button>
        </div>
      )}
    </div>
  )
} 