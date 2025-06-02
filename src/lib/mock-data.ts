import { User, Project, Investment, Transaction, Notification, PropertyType, ProjectStatus, UserRole } from './types'

// Filipino names and locations
const firstNames = ['Juan', 'Maria', 'Jose', 'Ana', 'Pedro', 'Rosa', 'Carlos', 'Elena', 'Miguel', 'Carmen', 'Rafael', 'Isabel', 'Antonio', 'Luz', 'Fernando', 'Grace', 'Ricardo', 'Diana', 'Eduardo', 'Sofia']
const lastNames = ['Santos', 'Reyes', 'Cruz', 'Garcia', 'Mendoza', 'Torres', 'Flores', 'Rivera', 'Gonzales', 'Rodriguez', 'Martinez', 'Lopez', 'Hernandez', 'Perez', 'Sanchez', 'Ramirez', 'Castillo', 'Morales', 'Aquino', 'Dela Cruz']

const locations = {
  'Metro Manila': ['Makati', 'BGC', 'Ortigas', 'Quezon City', 'Manila', 'Pasig', 'Mandaluyong', 'San Juan'],
  'Cebu': ['IT Park', 'Business Park', 'SRP', 'Lahug', 'Banilad', 'Ayala Center'],
  'Davao': ['Ecoland', 'Lanang', 'Bajada', 'Matina', 'Toril', 'Downtown']
}

const developers = ['Ayala Land Premier', 'SM Development Corporation', 'Megaworld Corporation', 'Robinsons Land Corporation', 'DMCI Homes', 'Century Properties', 'Alveo Land', 'Shang Properties']

const propertyNames = ['Skyline Tower', 'Fort Victoria', 'The Parkside', 'Metro Heights', 'City Garden', 'The Residence', 'Plaza Tower', 'Grand Central', 'Vista Verde', 'Royal Palm', 'Golden Gate', 'Marina Bay', 'Crown Plaza', 'Diamond Tower', 'Emerald Square']

const amenities = [
  'Infinity Pool', 'Sky Gym', 'Co-working Spaces', 'Retail Podium', 'Helipad', 'Concierge Service',
  'Clubhouse', 'Basketball Court', 'Tennis Court', 'Jogging Path', 'Kids Playground', 'Function Hall',
  'Business Center', 'Spa', 'Sauna', 'Steam Room', 'Game Room', 'Library', 'Outdoor BBQ Area'
]

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function generateName(): string {
  const firstName = getRandomElement(firstNames)
  const lastName = getRandomElement(lastNames)
  return `${firstName} ${lastName}`
}

function generateEmail(name: string): string {
  const cleanName = name.toLowerCase().replace(' ', '.')
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'email.com']
  return `${cleanName}@${getRandomElement(domains)}`
}

function generatePhone(): string {
  return `+639${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`
}

function generateProjectTitle(): string {
  const name = getRandomElement(propertyNames)
  const cities = Object.values(locations).flat()
  const city = getRandomElement(cities)
  return `${name} ${city}`
}

export function generateMockData() {
  // Generate users first
  const users: User[] = []
  
  // Create demo users for each role
  users.push({
    id: 'user_001',
    name: 'Maria Santos',
    email: 'maria.santos@gmail.com',
    phone: '+639171234567',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'investor',
    kycStatus: 'verified',
    verificationDate: '2023-06-15',
    stats: {
      totalInvested: 2500000,
      activeInvestments: 8,
      totalReturns: 425000,
      portfolioValue: 2925000
    },
    investmentHistory: [],
    preferences: {
      propertyTypes: ['residential-condo', 'commercial'],
      locations: ['Makati', 'BGC', 'Ortigas'],
      riskProfile: 'moderate'
    },
    badges: ['Early Investor', 'Verified KYC', 'Top 10%']
  })

  users.push({
    id: 'dev_001',
    name: 'Juan Cruz',
    email: 'juan.cruz@ayalaland.com',
    phone: '+639281234567',
    avatar: 'https://i.pravatar.cc/150?img=2',
    role: 'developer',
    kycStatus: 'verified',
    verificationDate: '2023-01-10',
    stats: {
      totalInvested: 0,
      activeInvestments: 0,
      totalReturns: 15800000,
      portfolioValue: 0
    },
    investmentHistory: [],
    preferences: {
      propertyTypes: ['residential-condo', 'mixed-use'],
      locations: ['Makati', 'BGC'],
      riskProfile: 'moderate'
    },
    badges: ['Verified Developer', 'Premium Partner', '5-Star Rating']
  })

  users.push({
    id: 'admin_001',
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@rise.ph',
    phone: '+639391234567',
    avatar: 'https://i.pravatar.cc/150?img=3',
    role: 'admin',
    kycStatus: 'verified',
    verificationDate: '2022-12-01',
    stats: {
      totalInvested: 0,
      activeInvestments: 0,
      totalReturns: 0,
      portfolioValue: 0
    },
    investmentHistory: [],
    preferences: {
      propertyTypes: ['residential-condo', 'commercial', 'mixed-use', 'land'],
      locations: ['Makati', 'BGC', 'Ortigas', 'Quezon City'],
      riskProfile: 'moderate'
    },
    badges: ['Platform Admin', 'Verified', 'Executive']
  })

  // Generate additional users
  for (let i = 4; i <= 50; i++) {
    const name = generateName()
    const role: UserRole = Math.random() > 0.8 ? 'developer' : 'investor'
    
    users.push({
      id: `user_${String(i).padStart(3, '0')}`,
      name,
      email: generateEmail(name),
      phone: generatePhone(),
      avatar: `https://i.pravatar.cc/150?img=${i}`,
      role,
      kycStatus: Math.random() > 0.1 ? 'verified' : 'pending',
      verificationDate: Math.random() > 0.1 ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      stats: {
        totalInvested: Math.floor(Math.random() * 5000000) + 100000,
        activeInvestments: Math.floor(Math.random() * 15) + 1,
        totalReturns: Math.floor(Math.random() * 1000000) + 10000,
        portfolioValue: Math.floor(Math.random() * 6000000) + 110000
      },
      investmentHistory: [],
      preferences: {
        propertyTypes: getRandomElements(['residential-condo', 'commercial', 'mixed-use', 'land'], Math.floor(Math.random() * 3) + 1) as PropertyType[],
        locations: getRandomElements(Object.values(locations).flat(), Math.floor(Math.random() * 4) + 1),
        riskProfile: getRandomElement(['conservative', 'moderate', 'aggressive'])
      },
      badges: getRandomElements(['Early Investor', 'Verified KYC', 'Top 10%', 'Loyalty Member', 'Beta Tester'], Math.floor(Math.random() * 3))
    })
  }

  // Generate projects
  const projects: Project[] = []
  const statuses: ProjectStatus[] = ['funding', 'funded', 'construction', 'completed']
  const propertyTypes: PropertyType[] = ['residential-condo', 'commercial', 'mixed-use', 'land']

  for (let i = 1; i <= 25; i++) {
    const allCities = Object.values(locations).flat()
    const city = getRandomElement(allCities)
    const region = Object.keys(locations).find(key => locations[key as keyof typeof locations].includes(city)) || 'Metro Manila'
    const status = getRandomElement(statuses)
    const propertyType = getRandomElement(propertyTypes)
    const targetAmount = Math.floor(Math.random() * 2000000000) + 100000000
    const currentAmount = status === 'funding' ? Math.floor(targetAmount * (Math.random() * 0.8 + 0.1)) : targetAmount
    
    projects.push({
      id: `proj_${String(i).padStart(3, '0')}`,
      title: generateProjectTitle(),
      developer: getRandomElement(developers),
      description: `A premium ${propertyType.replace('-', ' ')} development in the heart of ${city}. This project features modern architecture, world-class amenities, and strategic location perfect for investment and lifestyle.`,
      images: [
        `https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop`,
        `https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop`,
        `https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&h=600&fit=crop`,
        `https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop`,
        `https://images.unsplash.com/photo-1571208077326-f26d2c4d7080?w=800&h=600&fit=crop`
      ],
      location: {
        address: `${Math.floor(Math.random() * 999) + 1} ${getRandomElement(['Main', 'Central', 'Business', 'Corporate', 'Premium'])} Street`,
        city,
        region,
        coordinates: {
          lat: 14.5547 + (Math.random() - 0.5) * 0.5,
          lng: 121.0244 + (Math.random() - 0.5) * 0.5
        }
      },
      status,
      propertyType,
      totalUnits: Math.floor(Math.random() * 800) + 100,
      availableUnits: status === 'funding' ? Math.floor(Math.random() * 400) + 50 : 0,
      financial: {
        targetAmount,
        currentAmount,
        minimumInvestment: 25000,
        pricePerSqm: Math.floor(Math.random() * 200000) + 150000,
        averageUnitSize: Math.floor(Math.random() * 80) + 30,
        projectedROI: Math.floor(Math.random() * 15) + 12,
        annualRentalYield: Math.floor(Math.random() * 5) + 4,
        appreciationRate: Math.floor(Math.random() * 8) + 8
      },
      timeline: {
        listingDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
        fundingDeadline: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
        constructionStart: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        turnoverDate: new Date(Date.now() + (Math.random() * 1095 + 730) * 24 * 60 * 60 * 1000).toISOString()
      },
      amenities: getRandomElements(amenities, Math.floor(Math.random() * 8) + 4),
      investors: Math.floor(Math.random() * 300) + 50,
      documents: [
        { name: 'SEC Registration', verified: true },
        { name: 'Building Permit', verified: true },
        { name: 'Environmental Compliance', verified: Math.random() > 0.1 },
        { name: 'Fire Safety Certificate', verified: Math.random() > 0.2 },
        { name: 'Tax Declaration', verified: true }
      ],
      updates: [
        {
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          title: 'Construction Progress Update',
          content: 'Latest construction milestones achieved ahead of schedule. Foundation work completed successfully.'
        },
        {
          date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
          title: 'Permit Approval',
          content: 'All necessary permits have been approved by local government authorities.'
        }
      ]
    })
  }

  // Generate investments
  const investments: Investment[] = []
  const transactions: Transaction[] = []
  
  for (let i = 1; i <= 100; i++) {
    const userId = getRandomElement(users.filter(u => u.role === 'investor')).id
    const projectId = getRandomElement(projects).id
    const amount = Math.floor(Math.random() * 500000) + 25000
    const date = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    
    const investment: Investment = {
      id: `inv_${String(i).padStart(3, '0')}`,
      userId,
      projectId,
      amount,
      shares: amount / projects.find(p => p.id === projectId)!.financial.targetAmount,
      date,
      status: getRandomElement(['active', 'completed']),
      returns: []
    }
    
    // Generate some returns for this investment
    if (Math.random() > 0.3) {
      for (let j = 0; j < Math.floor(Math.random() * 6) + 1; j++) {
        investment.returns.push({
          date: new Date(new Date(date).getTime() + j * 30 * 24 * 60 * 60 * 1000).toISOString(),
          amount: Math.floor(amount * 0.005 * (Math.random() * 0.5 + 0.5)),
          type: getRandomElement(['dividend', 'rental_income'])
        })
      }
    }
    
    investments.push(investment)
    
    // Create corresponding transaction
    transactions.push({
      id: `txn_${String(i).padStart(3, '0')}`,
      userId,
      projectId,
      type: 'investment',
      amount,
      timestamp: date,
      status: 'completed',
      paymentMethod: getRandomElement(['bank_transfer', 'gcash', 'paymaya']),
      bankDetails: {
        bank: getRandomElement(['BDO', 'BPI', 'Metrobank', 'Security Bank']),
        accountLast4: Math.floor(Math.random() * 9999).toString().padStart(4, '0')
      }
    })
  }

  // Generate notifications
  const notifications: Notification[] = []
  const notificationTemplates = [
    {
      type: 'returns_credited' as const,
      title: 'Monthly Returns Credited',
      messageTemplate: '₱{amount} rental income from {project}'
    },
    {
      type: 'new_opportunity' as const,
      title: 'New Investment Opportunity',
      messageTemplate: '{project} now open for investment'
    },
    {
      type: 'project_update' as const,
      title: 'Project Update',
      messageTemplate: '{project} posted a new construction update'
    },
    {
      type: 'funding_milestone' as const,
      title: 'Funding Milestone',
      messageTemplate: '{project} reached {percentage}% funding!'
    }
  ]

  for (let i = 1; i <= 150; i++) {
    const userId = getRandomElement(users).id
    const project = getRandomElement(projects)
    const template = getRandomElement(notificationTemplates)
    
    const message = template.messageTemplate
      .replace('{project}', project.title)
      .replace('{amount}', Math.floor(Math.random() * 50000 + 1000).toLocaleString())
      .replace('{percentage}', Math.floor(Math.random() * 30 + 70).toString())
    
    notifications.push({
      id: `notif_${String(i).padStart(3, '0')}`,
      userId,
      type: template.type,
      title: template.title,
      message,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      read: Math.random() > 0.4,
      actionUrl: template.type === 'new_opportunity' ? `/investor/project/${project.id}` : '/investor/portfolio'
    })
  }

  return {
    users,
    projects,
    investments,
    transactions,
    notifications
  }
} 