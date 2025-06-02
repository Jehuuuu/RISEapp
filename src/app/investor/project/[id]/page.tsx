'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatCurrency, getTimeAgo } from '@/lib/utils'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SecurityIcon from '@mui/icons-material/Security'
import PeopleIcon from '@mui/icons-material/People'
import DescriptionIcon from '@mui/icons-material/Description'
import VerifiedIcon from '@mui/icons-material/Verified'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShareIcon from '@mui/icons-material/Share'
import FavoriteIcon from '@mui/icons-material/Favorite'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { projects, currentUser } = useStore()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showInvestmentModal, setShowInvestmentModal] = useState(false)
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [isInvesting, setIsInvesting] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'updates' | 'investors'>('overview')

  const project = projects.find(p => p.id === params.id)

  if (!project) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Project not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  const fundingProgress = (project.financial.currentAmount / project.financial.targetAmount) * 100
  const remainingAmount = project.financial.targetAmount - project.financial.currentAmount
  const daysLeft = Math.ceil((new Date(project.timeline.fundingDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  const handleInvestment = async () => {
    if (!currentUser || !investmentAmount) return
    
    setIsInvesting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const amount = parseFloat(investmentAmount)
    const shares = amount / project.financial.targetAmount
    
    // Investment logic would be handled by the store/API
    console.log('Investment:', { userId: currentUser.id, projectId: project.id, amount, shares })
    
    setIsInvesting(false)
    setShowInvestmentModal(false)
    setInvestmentAmount('')
    
    // Show success message or redirect
    alert('Investment successful!')
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: DescriptionIcon },
    { id: 'documents', label: 'Documents', icon: SecurityIcon },
    { id: 'updates', label: 'Updates', icon: TrendingUpIcon },
    { id: 'investors', label: 'Investors', icon: PeopleIcon },
  ]

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              leftIcon={<ArrowBackIcon className="w-4 h-4" />}
            >
              Back
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <FavoriteIcon className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ShareIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative">
        <div className="h-64 bg-slate-200 overflow-hidden">
          <img 
            src={project.images[selectedImageIndex]} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Image thumbnails */}
        <div className="absolute bottom-4 left-4 flex space-x-2">
          {project.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedImageIndex ? 'border-sky-500' : 'border-white/50'
              }`}
            >
              <img src={image} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            project.status === 'funding' ? 'bg-amber-100 text-amber-800' :
            project.status === 'funded' ? 'bg-emerald-100 text-emerald-800' :
            project.status === 'construction' ? 'bg-violet-100 text-violet-800' :
            'bg-sky-100 text-sky-800'
          }`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Project Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{project.title}</h1>
          <div className="flex items-center text-slate-600 mb-3">
            <LocationOnIcon className="w-4 h-4 mr-1" />
            <span className="text-sm">{project.location.address}, {project.location.city}</span>
          </div>
          <p className="text-slate-700 leading-relaxed">{project.description}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card elevation={2} padding="md">
            <div className="text-center">
              <p className="text-2xl font-bold text-sky-600">{Math.round(fundingProgress)}%</p>
              <p className="text-sm text-slate-500 font-medium">Funded</p>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-sky-500 to-sky-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                />
              </div>
            </div>
          </Card>

          <Card elevation={2} padding="md">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{project.financial.projectedROI}%</p>
              <p className="text-sm text-slate-500 font-medium">Projected ROI</p>
              <p className="text-xs text-slate-400 mt-1">Annual returns</p>
            </div>
          </Card>
        </div>

        {/* Investment Summary */}
        <Card elevation={2} padding="lg">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Investment Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500 font-medium">Target Amount</p>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(project.financial.targetAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Raised So Far</p>
              <p className="text-xl font-bold text-emerald-600">{formatCurrency(project.financial.currentAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Min. Investment</p>
              <p className="text-lg font-semibold text-slate-900">{formatCurrency(project.financial.minimumInvestment)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Investors</p>
              <p className="text-lg font-semibold text-slate-900">{project.investors}</p>
            </div>
          </div>

          {daysLeft > 0 && project.status === 'funding' && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg flex items-center space-x-2">
              <CalendarTodayIcon className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-amber-800 font-medium">
                {daysLeft} days remaining to fund this project
              </span>
            </div>
          )}
        </Card>

        {/* Investment CTA */}
        {project.status === 'funding' && (
          <Card elevation={2} padding="lg" className="bg-gradient-to-r from-sky-50 to-sky-100 border border-sky-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready to Invest?</h3>
              <p className="text-sm text-slate-600 mb-4">
                Join {project.investors} investors building wealth through real estate
              </p>
              <Button 
                fullWidth 
                size="lg"
                onClick={() => setShowInvestmentModal(true)}
                className="mb-3"
              >
                Invest Now - From {formatCurrency(project.financial.minimumInvestment)}
              </Button>
              <p className="text-xs text-slate-500">
                Secured by real property • SEC regulated • Fully documented
              </p>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'documents' | 'updates' | 'investors')}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'text-sky-600 bg-sky-50 border-b-2 border-sky-500'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Property Details */}
              <Card elevation={1} padding="lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Property Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Property Type</p>
                    <p className="font-semibold text-slate-900 capitalize">{project.propertyType.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Total Units</p>
                    <p className="font-semibold text-slate-900">{project.totalUnits}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Price per sqm</p>
                    <p className="font-semibold text-slate-900">{formatCurrency(project.financial.pricePerSqm)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Avg. Unit Size</p>
                    <p className="font-semibold text-slate-900">{project.financial.averageUnitSize} sqm</p>
                  </div>
                </div>
              </Card>

              {/* Timeline */}
              <Card elevation={1} padding="lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-slate-900">Funding Started</p>
                      <p className="text-sm text-slate-500">{new Date(project.timeline.listingDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${fundingProgress >= 100 ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                    <div>
                      <p className="font-medium text-slate-900">Funding Deadline</p>
                      <p className="text-sm text-slate-500">{new Date(project.timeline.fundingDeadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                    <div>
                      <p className="font-medium text-slate-900">Construction Start</p>
                      <p className="text-sm text-slate-500">{new Date(project.timeline.constructionStart).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                    <div>
                      <p className="font-medium text-slate-900">Expected Turnover</p>
                      <p className="text-sm text-slate-500">{new Date(project.timeline.turnoverDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Amenities */}
              <Card elevation={1} padding="lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {project.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-slate-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card elevation={1} padding="lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Documents</h3>
                <div className="space-y-3">
                  {project.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DescriptionIcon className="w-5 h-5 text-slate-500" />
                        <div>
                          <p className="font-medium text-slate-900">{doc.name}</p>
                          <div className="flex items-center space-x-1">
                            {doc.verified ? (
                              <VerifiedIcon className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <WarningIcon className="w-3 h-3 text-amber-600" />
                            )}
                            <span className={`text-xs ${doc.verified ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {doc.verified ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'updates' && (
            <motion.div
              key="updates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card elevation={1} padding="lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Updates</h3>
                <div className="space-y-4">
                  {project.updates.map((update, index) => (
                    <div key={index} className="border-l-4 border-sky-500 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-900">{update.title}</h4>
                        <span className="text-sm text-slate-500">{getTimeAgo(update.date)}</span>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">{update.content}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'investors' && (
            <motion.div
              key="investors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card elevation={1} padding="lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Investor Community</h3>
                <div className="text-center py-8">
                  <PeopleIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-2">Join {project.investors} investors</p>
                  <p className="text-sm text-slate-500">Investor details available after investment</p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Investment Modal */}
      <AnimatePresence>
        {showInvestmentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowInvestmentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4">Invest in {project.title}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Investment Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">₱</span>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      placeholder={project.financial.minimumInvestment.toString()}
                      className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      min={project.financial.minimumInvestment}
                      max={remainingAmount}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Min: {formatCurrency(project.financial.minimumInvestment)} • 
                    Max: {formatCurrency(remainingAmount)}
                  </p>
                </div>

                {investmentAmount && parseFloat(investmentAmount) >= project.financial.minimumInvestment && (
                  <div className="p-3 bg-sky-50 rounded-lg">
                    <p className="text-sm text-sky-800">
                      <strong>Ownership:</strong> {((parseFloat(investmentAmount) / project.financial.targetAmount) * 100).toFixed(3)}%
                    </p>
                    <p className="text-sm text-sky-800">
                      <strong>Projected Annual Return:</strong> {formatCurrency(parseFloat(investmentAmount) * (project.financial.projectedROI / 100))}
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowInvestmentModal(false)}
                    disabled={isInvesting}
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    onClick={handleInvestment}
                    disabled={!investmentAmount || parseFloat(investmentAmount) < project.financial.minimumInvestment || isInvesting}
                  >
                    {isInvesting ? 'Processing...' : 'Confirm Investment'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 