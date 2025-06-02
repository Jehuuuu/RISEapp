export type UserRole = 'investor' | 'developer' | 'admin'
export type ProjectStatus = 'funding' | 'funded' | 'construction' | 'completed'
export type PropertyType = 'residential-condo' | 'commercial' | 'mixed-use' | 'land'
export type TransactionType = 'investment' | 'dividend' | 'withdrawal' | 'rental_income'
export type NotificationType = 'investment_update' | 'new_opportunity' | 'returns_credited' | 'project_update' | 'funding_milestone'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  role: UserRole
  kycStatus: 'pending' | 'verified' | 'rejected'
  verificationDate?: string
  stats: {
    totalInvested: number
    activeInvestments: number
    totalReturns: number
    portfolioValue: number
  }
  investmentHistory: Investment[]
  preferences: {
    propertyTypes: PropertyType[]
    locations: string[]
    riskProfile: 'conservative' | 'moderate' | 'aggressive'
  }
  badges: string[]
}

export interface Project {
  id: string
  title: string
  developer: string
  description: string
  images: string[]
  location: {
    address: string
    city: string
    region: string
    coordinates: { lat: number; lng: number }
  }
  status: ProjectStatus
  propertyType: PropertyType
  totalUnits: number
  availableUnits: number
  financial: {
    targetAmount: number
    currentAmount: number
    minimumInvestment: number
    pricePerSqm: number
    averageUnitSize: number
    projectedROI: number
    annualRentalYield: number
    appreciationRate: number
  }
  timeline: {
    listingDate: string
    fundingDeadline: string
    constructionStart: string
    turnoverDate: string
  }
  amenities: string[]
  investors: number
  documents: Array<{
    name: string
    verified: boolean
  }>
  updates: Array<{
    date: string
    title: string
    content: string
  }>
}

export interface Investment {
  id: string
  userId: string
  projectId: string
  amount: number
  shares: number
  date: string
  status: 'active' | 'completed' | 'cancelled'
  returns: Array<{
    date: string
    amount: number
    type: TransactionType
  }>
}

export interface Transaction {
  id: string
  userId: string
  projectId?: string
  type: TransactionType
  amount: number
  timestamp: string
  status: 'pending' | 'completed' | 'failed'
  paymentMethod?: string
  bankDetails?: {
    bank: string
    accountLast4: string
  }
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
} 