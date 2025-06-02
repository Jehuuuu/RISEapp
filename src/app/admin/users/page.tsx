'use client'

import { useStore } from '@/lib/store'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatCurrency, getTimeAgo } from '@/lib/utils'
import GroupIcon from '@mui/icons-material/Group'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import PendingIcon from '@mui/icons-material/Pending'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function AdminUsers() {
  const { users } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.kycStatus === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const getUserStats = () => {
    const total = users.length
    const verified = users.filter(u => u.kycStatus === 'verified').length
    const pending = users.filter(u => u.kycStatus === 'pending').length
    const investors = users.filter(u => u.role === 'investor').length
    const developers = users.filter(u => u.role === 'developer').length
    
    return { total, verified, pending, investors, developers }
  }

  const stats = getUserStats()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-emerald-600 bg-emerald-50'
      case 'pending': return 'text-amber-600 bg-amber-50'
      case 'rejected': return 'text-red-600 bg-red-50'
      default: return 'text-slate-600 bg-slate-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircleIcon className="w-4 h-4" />
      case 'pending': return <PendingIcon className="w-4 h-4" />
      case 'rejected': return <CancelIcon className="w-4 h-4" />
      default: return <PendingIcon className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'investor': return 'text-sky-600 bg-sky-50'
      case 'developer': return 'text-violet-600 bg-violet-50'
      case 'admin': return 'text-amber-600 bg-amber-50'
      default: return 'text-slate-600 bg-slate-50'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600">{filteredUsers.length} of {users.length} users</p>
        </div>
        <Button
          className="gradient-primary text-white shadow-glow"
          leftIcon={<PersonAddIcon className="w-5 h-5" />}
        >
          Invite User
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card elevation={1} padding="md" className="text-center">
          <GroupIcon className="w-8 h-8 text-sky-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-sm text-slate-600">Total Users</p>
        </Card>
        
        <Card elevation={1} padding="md" className="text-center">
          <VerifiedUserIcon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.verified}</p>
          <p className="text-sm text-slate-600">Verified</p>
        </Card>
        
        <Card elevation={1} padding="md" className="text-center">
          <GroupIcon className="w-8 h-8 text-violet-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.investors}</p>
          <p className="text-sm text-slate-600">Investors</p>
        </Card>
        
        <Card elevation={1} padding="md" className="text-center">
          <GroupIcon className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.developers}</p>
          <p className="text-sm text-slate-600">Developers</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card elevation={1} padding="lg" className="mb-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-4">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Roles</option>
              <option value="investor">Investors</option>
              <option value="developer">Developers</option>
              <option value="admin">Admins</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card elevation={2} padding="lg" hover className="cursor-pointer">
              <div className="flex items-center space-x-4">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
                      <p className="text-sm text-slate-600">{user.email}</p>
                      <p className="text-xs text-slate-500">{user.phone}</p>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertIcon className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      <span className="capitalize">{user.role}</span>
                    </div>
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.kycStatus)}`}>
                      {getStatusIcon(user.kycStatus)}
                      <span className="capitalize">{user.kycStatus}</span>
                    </div>
                  </div>
                  
                  {/* User Stats */}
                  {user.role === 'investor' && (
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-slate-500">Portfolio</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {formatCurrency(user.stats.portfolioValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Investments</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {user.stats.activeInvestments}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Returns</p>
                        <p className="text-sm font-semibold text-emerald-600">
                          {formatCurrency(user.stats.totalReturns)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      Joined {user.verificationDate ? getTimeAgo(user.verificationDate) : 'Recently'}
                    </p>
                    <div className="flex space-x-2">
                      {user.kycStatus === 'pending' && (
                        <>
                          <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-600">
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                            Reject
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-16">
          <GroupIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Users Found</h3>
          <p className="text-slate-600 mb-6">Try adjusting your search or filter criteria</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('')
              setFilterRole('all')
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