'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { User, UserRole, PropertyType } from '@/lib/types'
import { ArrowRight, TrendingUp, Shield, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

const onboardingSlides = [
  {
    title: "Invest in Real Estate",
    subtitle: "Start with as little as ₱25,000",
    description: "Join 5,000+ investors building wealth through fractional real estate ownership in prime Philippine locations.",
    icon: TrendingUp,
    stats: "₱2.5B+ invested"
  },
  {
    title: "Secure & Transparent",
    subtitle: "SEC-regulated platform",
    description: "All investments are backed by real properties with complete documentation and regulatory compliance.",
    icon: Shield,
    stats: "95% success rate"
  },
  {
    title: "Growing Community",
    subtitle: "Expert-verified projects",
    description: "Connect with fellow investors and access premium developments from top Philippine developers.",
    icon: Users,
    stats: "127 investors online"
  }
]

export default function HomePage() {
  const router = useRouter()
  const { currentUser, isAuthenticated, login, initializeData } = useStore()
  const [currentStep, setCurrentStep] = useState<'splash' | 'onboarding' | 'role-select' | 'login'>('splash')
  const [onboardingIndex, setOnboardingIndex] = useState(0)

  useEffect(() => {
    // Initialize mock data
    initializeData()

    // Auto-advance from splash screen
    const timer = setTimeout(() => {
      if (isAuthenticated && currentUser) {
        router.push(`/${currentUser.role}/dashboard`)
      } else {
        setCurrentStep('onboarding')
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [isAuthenticated, currentUser, router, initializeData])

  useEffect(() => {
    if (currentStep === 'onboarding') {
      const interval = setInterval(() => {
        setOnboardingIndex((prev) => {
          if (prev === onboardingSlides.length - 1) {
            setCurrentStep('role-select')
            return prev
          }
          return prev + 1
        })
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [currentStep])

  const handleRoleSelect = () => {
    setCurrentStep('login')
  }

  const handleQuickLogin = (userData: User) => {
    login(userData)
    router.push(`/${userData.role}/dashboard`)
  }

  const getDemoUser = (role: UserRole): User => {
    const demoUsers = {
      investor: {
        id: 'user_001',
        name: 'Maria Santos',
        email: 'maria.santos@gmail.com',
        phone: '+639171234567',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'investor' as const,
        kycStatus: 'verified' as const,
        verificationDate: '2023-06-15',
        stats: {
          totalInvested: 2500000,
          activeInvestments: 8,
          totalReturns: 425000,
          portfolioValue: 2925000
        },
        investmentHistory: [],
        preferences: {
          propertyTypes: ['residential-condo', 'commercial'] as PropertyType[],
          locations: ['Makati', 'BGC', 'Ortigas'],
          riskProfile: 'moderate' as const
        },
        badges: ['Early Investor', 'Verified KYC', 'Top 10%']
      },
      developer: {
        id: 'dev_001',
        name: 'Juan Cruz',
        email: 'juan.cruz@ayalaland.com',
        phone: '+639281234567',
        avatar: 'https://i.pravatar.cc/150?img=2',
        role: 'developer' as const,
        kycStatus: 'verified' as const,
        verificationDate: '2023-01-10',
        stats: {
          totalInvested: 0,
          activeInvestments: 0,
          totalReturns: 15800000,
          portfolioValue: 0
        },
        investmentHistory: [],
        preferences: {
          propertyTypes: ['residential-condo', 'mixed-use'] as PropertyType[],
          locations: ['Makati', 'BGC'],
          riskProfile: 'moderate' as const
        },
        badges: ['Verified Developer', 'Premium Partner', '5-Star Rating']
      },
      admin: {
        id: 'admin_001',
        name: 'Elena Rodriguez',
        email: 'elena.rodriguez@rise.ph',
        phone: '+639391234567',
        avatar: 'https://i.pravatar.cc/150?img=3',
        role: 'admin' as const,
        kycStatus: 'verified' as const,
        verificationDate: '2022-12-01',
        stats: {
          totalInvested: 0,
          activeInvestments: 0,
          totalReturns: 0,
          portfolioValue: 0
        },
        investmentHistory: [],
        preferences: {
          propertyTypes: ['residential-condo', 'commercial', 'mixed-use', 'land'] as PropertyType[],
          locations: ['Makati', 'BGC', 'Ortigas', 'Quezon City'],
          riskProfile: 'moderate' as const
        },
        badges: ['Platform Admin', 'Verified', 'Executive']
      }
    }
    return demoUsers[role]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
      <AnimatePresence mode="wait">
        {/* Splash Screen */}
        {currentStep === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen text-white"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <div className="text-6xl font-bold mb-4">RISE</div>
              <div className="text-xl opacity-80">Real Estate Investment Platform</div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 1.5 }}
                className="h-1 bg-white mt-6 rounded-full"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Onboarding Carousel */}
        {currentStep === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="min-h-screen text-white flex flex-col"
          >
            <div className="flex-1 flex flex-col justify-center px-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={onboardingIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8"
                  >
                    {(() => {
                      const IconComponent = onboardingSlides[onboardingIndex].icon
                      return <IconComponent className="w-10 h-10" />
                    })()}
                  </motion.div>
                  
                  <h1 className="text-3xl font-bold mb-2">
                    {onboardingSlides[onboardingIndex].title}
                  </h1>
                  
                  <p className="text-xl mb-4 opacity-90">
                    {onboardingSlides[onboardingIndex].subtitle}
                  </p>
                  
                  <p className="text-base opacity-75 mb-6 leading-relaxed px-4">
                    {onboardingSlides[onboardingIndex].description}
                  </p>
                  
                  <div className="text-2xl font-semibold text-yellow-300">
                    {onboardingSlides[onboardingIndex].stats}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress indicators */}
            <div className="flex justify-center space-x-2 pb-20">
              {onboardingSlides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === onboardingIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Role Selection */}
        {currentStep === 'role-select' && (
          <motion.div
            key="role-select"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="min-h-screen text-white flex flex-col justify-center px-6"
          >
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold mb-4">Choose Your Path</h1>
              <p className="text-lg opacity-80">How would you like to use RISE?</p>
            </div>

            <div className="space-y-4">
              <Card 
                className="bg-white/10 backdrop-blur border-white/20 text-white cursor-pointer hover:bg-white/20 transition-all"
                onClick={() => handleRoleSelect()}
              >
                <div className="flex items-center justify-between text-white mb-3">
                  <span className="text-lg font-semibold">🏠 Investor</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/80 mb-2">Invest in premium real estate projects</p>
                  <p className="text-sm text-green-300">127 investors online</p>
                </div>
              </Card>

              <Card 
                className="bg-white/10 backdrop-blur border-white/20 text-white cursor-pointer hover:bg-white/20 transition-all"
                onClick={() => handleRoleSelect()}
              >
                <div className="flex items-center justify-between text-white mb-3">
                  <span className="text-lg font-semibold">🏗️ Developer</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/80 mb-2">List your projects for funding</p>
                  <p className="text-sm text-blue-300">45 active developers</p>
                </div>
              </Card>

              <Card 
                className="bg-white/10 backdrop-blur border-white/20 text-white cursor-pointer hover:bg-white/20 transition-all"
                onClick={() => handleRoleSelect()}
              >
                <div className="flex items-center justify-between text-white mb-3">
                  <span className="text-lg font-semibold">⚙️ Administrator</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/80 mb-2">Manage platform operations</p>
                  <p className="text-sm text-purple-300">3 admins online</p>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Quick Login */}
        {currentStep === 'login' && (
          <motion.div
            key="login"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="min-h-screen text-white flex flex-col justify-center px-6"
          >
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold mb-4">Quick Demo Login</h1>
              <p className="text-lg opacity-80">Choose a demo account to explore</p>
            </div>

            <div className="space-y-4">
              {(['investor', 'developer', 'admin'] as UserRole[]).map((role) => {
                const user = getDemoUser(role)
                return (
                  <Card 
                    key={role}
                    className="bg-white/10 backdrop-blur border-white/20 text-white cursor-pointer hover:bg-white/20 transition-all"
                    onClick={() => handleQuickLogin(user)}
                  >
                    <div className="flex items-center space-x-4 p-4">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{user.name}</h3>
                        <p className="text-sm text-white/70 capitalize">{role}</p>
                        {role === 'investor' && (
                          <p className="text-xs text-green-300">
                            Portfolio: {formatCurrency(user.stats.portfolioValue)}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </Card>
                )
              })}
            </div>

            <Button
              variant="outline"
              className="mt-8 text-gray-800"
              onClick={() => setCurrentStep('role-select')}
            >
              Back to Role Selection
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
