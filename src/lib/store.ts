import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Project, Investment, Transaction, Notification, UserRole } from './types'
import { generateMockData } from './mock-data'

interface AppState {
  // Auth state
  currentUser: User | null
  currentRole: UserRole
  isAuthenticated: boolean
  
  // Data state
  projects: Project[]
  investments: Investment[]
  users: User[]
  transactions: Transaction[]
  notifications: Notification[]
  
  // UI state
  isLoading: boolean
  
  // Actions
  login: (user: User) => void
  logout: () => void
  switchRole: (role: UserRole) => void
  setLoading: (loading: boolean) => void
  
  // Data actions
  createProject: (project: Omit<Project, 'id'>) => void
  investInProject: (projectId: string, amount: number) => void
  approveProject: (projectId: string) => void
  markNotificationAsRead: (notificationId: string) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  
  // Initialize data
  initializeData: () => void
}

const simulateApiCall = async (action: () => void) => {
  await new Promise(resolve => setTimeout(resolve, 800))
  action()
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      currentRole: 'investor',
      isAuthenticated: false,
      projects: [],
      investments: [],
      users: [],
      transactions: [],
      notifications: [],
      isLoading: false,

      // Auth actions
      login: (user: User) => {
        set({
          currentUser: user,
          currentRole: user.role,
          isAuthenticated: true
        })
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false
        })
      },

      switchRole: (role: UserRole) => {
        const { currentUser } = get()
        if (currentUser) {
          set({
            currentRole: role,
            currentUser: { ...currentUser, role }
          })
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      // Data actions
      createProject: (projectData) => {
        const { projects } = get()
        const newProject: Project = {
          ...projectData,
          id: `proj_${Date.now()}`,
        }
        set({ projects: [...projects, newProject] })
      },

      investInProject: async (projectId: string, amount: number) => {
        const { currentUser, projects, investments, transactions } = get()
        if (!currentUser) return

        set({ isLoading: true })
        
        await simulateApiCall(() => {
          // Update project funding
          const updatedProjects = projects.map(project => {
            if (project.id === projectId) {
              return {
                ...project,
                financial: {
                  ...project.financial,
                  currentAmount: project.financial.currentAmount + amount
                },
                investors: project.investors + 1
              }
            }
            return project
          })

          // Create investment record
          const newInvestment: Investment = {
            id: `inv_${Date.now()}`,
            userId: currentUser.id,
            projectId,
            amount,
            shares: amount / projects.find(p => p.id === projectId)!.financial.targetAmount,
            date: new Date().toISOString(),
            status: 'active',
            returns: []
          }

          // Create transaction record
          const newTransaction: Transaction = {
            id: `txn_${Date.now()}`,
            userId: currentUser.id,
            projectId,
            type: 'investment',
            amount,
            timestamp: new Date().toISOString(),
            status: 'completed',
            paymentMethod: 'bank_transfer'
          }

          set({
            projects: updatedProjects,
            investments: [...investments, newInvestment],
            transactions: [...transactions, newTransaction],
            isLoading: false
          })
        })
      },

      approveProject: (projectId: string) => {
        const { projects } = get()
        const updatedProjects = projects.map(project => {
          if (project.id === projectId) {
            return { ...project, status: 'funded' as const }
          }
          return project
        })
        set({ projects: updatedProjects })
      },

      markNotificationAsRead: (notificationId: string) => {
        const { notifications } = get()
        const updatedNotifications = notifications.map(notification => {
          if (notification.id === notificationId) {
            return { ...notification, read: true }
          }
          return notification
        })
        set({ notifications: updatedNotifications })
      },

      addNotification: (notificationData) => {
        const { notifications } = get()
        const newNotification: Notification = {
          ...notificationData,
          id: `notif_${Date.now()}`,
        }
        set({ notifications: [newNotification, ...notifications] })
      },

      initializeData: () => {
        const { projects } = get()
        
        // Only initialize if data is empty
        if (projects.length === 0) {
          const mockData = generateMockData()
          set({
            projects: mockData.projects,
            users: mockData.users,
            investments: mockData.investments,
            transactions: mockData.transactions,
            notifications: mockData.notifications
          })
        }
      }
    }),
    {
      name: 'rise-app-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        currentRole: state.currentRole,
        isAuthenticated: state.isAuthenticated,
        projects: state.projects,
        investments: state.investments,
        users: state.users,
        transactions: state.transactions,
        notifications: state.notifications
      })
    }
  )
) 