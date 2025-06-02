'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SearchIcon from '@mui/icons-material/Search'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import CloseIcon from '@mui/icons-material/Close'
import Link from 'next/link'

interface FABAction {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  color: string
}

const fabActions: FABAction[] = [
  {
    icon: SearchIcon,
    label: 'Browse Projects',
    href: '/investor/browse',
    color: 'bg-sky-500'
  },
  {
    icon: TrendingUpIcon,
    label: 'Portfolio',
    href: '/investor/portfolio',
    color: 'bg-emerald-500'
  },
  {
    icon: AccountBalanceIcon,
    label: 'Dashboard',
    href: '/investor/dashboard',
    color: 'bg-violet-500'
  }
]

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {fabActions.map((action, index) => {
              const IconComponent = action.icon
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={action.href}>
                    <div 
                      className="flex items-center space-x-3 group cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="glass-card px-4 py-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                          {action.label}
                        </span>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center shadow-lg interactive-card`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 btn-premium rounded-2xl flex items-center justify-center shadow-glow text-white relative overflow-hidden"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <CloseIcon className="w-7 h-7" />
          ) : (
            <AddIcon className="w-7 h-7" />
          )}
        </motion.div>
      </motion.button>
    </div>
  )
} 