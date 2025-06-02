'use client'

import { useState, useMemo } from 'react'
import { useStore } from '@/lib/store'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { PropertyType, ProjectStatus } from '@/lib/types'
import SearchIcon from '@mui/icons-material/Search'
import SortIcon from '@mui/icons-material/Sort'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PeopleIcon from '@mui/icons-material/People'
import CloseIcon from '@mui/icons-material/Close'
import TuneIcon from '@mui/icons-material/Tune'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type SortOption = 'newest' | 'funding-progress' | 'roi' | 'minimum-investment' | 'deadline'

export default function BrowsePage() {
  const { projects } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<PropertyType[]>([])
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [minInvestment, setMinInvestment] = useState('')
  const [maxInvestment, setMaxInvestment] = useState('')
  const [minROI, setMinROI] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showFilters, setShowFilters] = useState(false)

  // Available filter options
  const propertyTypes: { value: PropertyType; label: string }[] = [
    { value: 'residential-condo', label: 'Residential Condo' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'mixed-use', label: 'Mixed Use' },
    { value: 'land', label: 'Land' },
  ]

  const statusOptions: { value: ProjectStatus; label: string; color: string }[] = [
    { value: 'funding', label: 'Funding', color: 'bg-amber-100 text-amber-800' },
    { value: 'funded', label: 'Funded', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'construction', label: 'Construction', color: 'bg-violet-100 text-violet-800' },
    { value: 'completed', label: 'Completed', color: 'bg-sky-100 text-sky-800' },
  ]

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'funding-progress', label: 'Funding Progress' },
    { value: 'roi', label: 'Highest ROI' },
    { value: 'minimum-investment', label: 'Lowest Min. Investment' },
    { value: 'deadline', label: 'Ending Soon' },
  ]

  // Get unique locations from projects
  const availableLocations = useMemo(() => {
    const locations = projects.map(p => p.location.city)
    return [...new Set(locations)].sort()
  }, [projects])

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    const filtered = projects.filter(project => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.location.city.toLowerCase().includes(query) ||
          project.developer.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Property type filter
      if (selectedPropertyTypes.length > 0) {
        if (!selectedPropertyTypes.includes(project.propertyType)) return false
      }

      // Status filter
      if (selectedStatus.length > 0) {
        if (!selectedStatus.includes(project.status)) return false
      }

      // Location filter
      if (selectedLocations.length > 0) {
        if (!selectedLocations.includes(project.location.city)) return false
      }

      // Investment amount filter
      if (minInvestment) {
        if (project.financial.minimumInvestment < parseFloat(minInvestment)) return false
      }
      if (maxInvestment) {
        if (project.financial.minimumInvestment > parseFloat(maxInvestment)) return false
      }

      // ROI filter
      if (minROI) {
        if (project.financial.projectedROI < parseFloat(minROI)) return false
      }

      return true
    })

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timeline.listingDate).getTime() - new Date(a.timeline.listingDate).getTime()
        case 'funding-progress':
          const progressA = (a.financial.currentAmount / a.financial.targetAmount) * 100
          const progressB = (b.financial.currentAmount / b.financial.targetAmount) * 100
          return progressB - progressA
        case 'roi':
          return b.financial.projectedROI - a.financial.projectedROI
        case 'minimum-investment':
          return a.financial.minimumInvestment - b.financial.minimumInvestment
        case 'deadline':
          return new Date(a.timeline.fundingDeadline).getTime() - new Date(b.timeline.fundingDeadline).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [projects, searchQuery, selectedPropertyTypes, selectedStatus, selectedLocations, minInvestment, maxInvestment, minROI, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedPropertyTypes([])
    setSelectedStatus([])
    setSelectedLocations([])
    setMinInvestment('')
    setMaxInvestment('')
    setMinROI('')
    setSortBy('newest')
  }

  const hasActiveFilters = searchQuery || selectedPropertyTypes.length > 0 || selectedStatus.length > 0 || 
    selectedLocations.length > 0 || minInvestment || maxInvestment || minROI

  return (
    <div className="min-h-screen gradient-surface pb-20">
      {/* Enhanced Header with Gradient Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-blue-500/10 to-indigo-600/20"></div>
        <div className="relative px-4 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Discover Projects</h1>
              <p className="text-slate-600 text-lg">{filteredProjects.length} premium opportunities</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<TuneIcon className="w-4 h-4" />}
                className={`btn-premium text-white border-none ${hasActiveFilters ? 'shadow-glow' : ''}`}
              >
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 px-2 py-0.5 bg-white/20 text-white text-xs rounded-full font-bold">
                    {[selectedPropertyTypes.length, selectedStatus.length, selectedLocations.length, 
                      minInvestment ? 1 : 0, maxInvestment ? 1 : 0, minROI ? 1 : 0].reduce((a, b) => a + b, 0)}
                  </span>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Enhanced Search Bar with Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="glass-card rounded-2xl p-1">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search premium real estate opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-transparent border-none rounded-xl focus:ring-2 focus:ring-sky-500/30 focus:outline-none text-slate-900 placeholder-slate-500 text-lg"
              />
              {searchQuery && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Premium Sort Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center space-x-3 overflow-x-auto pb-2 custom-scrollbar"
        >
          <SortIcon className="w-5 h-5 text-slate-600 flex-shrink-0" />
          {sortOptions.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortBy(option.value)}
              className={`px-6 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all shadow-lg ${
                sortBy === option.value
                  ? 'btn-premium text-white shadow-glow'
                  : 'glass-card text-slate-700 hover:shadow-premium'
              }`}
            >
              {option.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Card elevation={2} padding="lg" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Advanced Filters</h3>
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Property Types */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Property Type</label>
                  <div className="flex flex-wrap gap-2">
                    {propertyTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => {
                          setSelectedPropertyTypes(prev =>
                            prev.includes(type.value)
                              ? prev.filter(t => t !== type.value)
                              : [...prev, type.value]
                          )
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedPropertyTypes.includes(type.value)
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Project Status</label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => {
                          setSelectedStatus(prev =>
                            prev.includes(status.value)
                              ? prev.filter(s => s !== status.value)
                              : [...prev, status.value]
                          )
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedStatus.includes(status.value)
                            ? 'bg-sky-500 text-white'
                            : `${status.color} hover:opacity-80`
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Location</label>
                  <div className="flex flex-wrap gap-2">
                    {availableLocations.map((location) => (
                      <button
                        key={location}
                        onClick={() => {
                          setSelectedLocations(prev =>
                            prev.includes(location)
                              ? prev.filter(l => l !== location)
                              : [...prev, location]
                          )
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedLocations.includes(location)
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Investment Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Min Investment</label>
                    <input
                      type="number"
                      placeholder="₱25,000"
                      value={minInvestment}
                      onChange={(e) => setMinInvestment(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Max Investment</label>
                    <input
                      type="number"
                      placeholder="₱1,000,000"
                      value={maxInvestment}
                      onChange={(e) => setMaxInvestment(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Minimum ROI */}
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Minimum ROI (%)</label>
                  <input
                    type="number"
                    placeholder="8"
                    value={minROI}
                    onChange={(e) => setMinROI(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Projects Grid */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredProjects.map((project, index) => {
              const fundingProgress = (project.financial.currentAmount / project.financial.targetAmount) * 100
              const daysLeft = Math.ceil((new Date(project.timeline.fundingDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  layout
                >
                  <Link href={`/investor/project/${project.id}`}>
                    <div className="card-premium interactive-card rounded-3xl overflow-hidden shadow-premium">
                      <div className="relative">
                        {/* Enhanced Project Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={project.images[0]} 
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          
                          {/* Status Badge */}
                          <div className="absolute top-4 left-4">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                              className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-lg backdrop-blur-lg ${
                                project.status === 'funding' ? 'bg-amber-500/90 text-white' :
                                project.status === 'funded' ? 'bg-emerald-500/90 text-white' :
                                project.status === 'construction' ? 'bg-violet-500/90 text-white' :
                                'bg-sky-500/90 text-white'
                              }`}
                            >
                              {project.status.toUpperCase()}
                            </motion.div>
                          </div>

                          {/* ROI Badge */}
                          <div className="absolute top-4 right-4">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.4 }}
                              className="glass-card-dark rounded-2xl px-4 py-2"
                            >
                              <div className="text-center">
                                <div className="text-2xl font-bold text-white">{project.financial.projectedROI}%</div>
                                <div className="text-xs text-white/80 font-medium">ROI</div>
                              </div>
                            </motion.div>
                          </div>

                          {/* Project Title Overlay */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                              {project.title}
                            </h3>
                            <div className="flex items-center text-white/90">
                              <LocationOnIcon className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">{project.location.city}</span>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Project Details */}
                        <div className="p-6">
                          {/* Progress Section */}
                          <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-sm font-medium text-slate-600">Funding Progress</span>
                              <span className="text-lg font-bold text-slate-900">{Math.round(fundingProgress)}%</span>
                            </div>
                            <div className="relative w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(fundingProgress, 100)}%` }}
                                transition={{ 
                                  duration: 1.5, 
                                  delay: index * 0.1 + 0.5,
                                  ease: "easeOut"
                                }}
                                className="progress-bar h-3 rounded-full"
                              />
                            </div>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-4 glass-card rounded-2xl">
                              <div className="text-lg font-bold text-slate-900 mb-1">
                                {formatCurrency(project.financial.minimumInvestment)}
                              </div>
                              <div className="text-xs text-slate-500 font-medium">Min. Investment</div>
                            </div>
                            <div className="text-center p-4 glass-card rounded-2xl">
                              <div className="text-lg font-bold text-emerald-600 mb-1">
                                {formatCurrency(project.financial.currentAmount)}
                              </div>
                              <div className="text-xs text-slate-500 font-medium">Raised</div>
                            </div>
                            <div className="text-center p-4 glass-card rounded-2xl">
                              <div className="text-lg font-bold text-sky-600 mb-1">{project.investors}</div>
                              <div className="text-xs text-slate-500 font-medium">Investors</div>
                            </div>
                          </div>

                          {/* Footer Info */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2 text-slate-600">
                              <PeopleIcon className="w-4 h-4" />
                              <span className="font-medium">{project.developer}</span>
                            </div>
                            {project.status === 'funding' && daysLeft > 0 && (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 + 0.7 }}
                                className="flex items-center space-x-1 text-amber-600 font-semibold"
                              >
                                <CalendarTodayIcon className="w-4 h-4" />
                                <span>{daysLeft} days left</span>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <Card padding="lg" className="text-center">
              <div className="py-8">
                <SearchIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects found</h3>
                <p className="text-slate-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 