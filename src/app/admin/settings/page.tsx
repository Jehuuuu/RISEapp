'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SettingsIcon from '@mui/icons-material/Settings'
import SecurityIcon from '@mui/icons-material/Security'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PaymentIcon from '@mui/icons-material/Payment'
import BusinessIcon from '@mui/icons-material/Business'
import SaveIcon from '@mui/icons-material/Save'
import RestoreIcon from '@mui/icons-material/Restore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { motion } from 'framer-motion'

export default function AdminSettings() {
  const settingsCategories = [
    {
      title: 'Platform Configuration',
      icon: SettingsIcon,
      color: 'sky',
      settings: [
        { name: 'Minimum Investment Amount', value: '₱50,000', type: 'currency' },
        { name: 'Maximum Investment Amount', value: '₱10,000,000', type: 'currency' },
        { name: 'Platform Fee Rate', value: '5%', type: 'percentage' },
        { name: 'KYC Verification Required', value: 'Enabled', type: 'toggle' }
      ]
    },
    {
      title: 'Security Settings',
      icon: SecurityIcon,
      color: 'emerald',
      settings: [
        { name: 'Two-Factor Authentication', value: 'Required', type: 'toggle' },
        { name: 'Session Timeout', value: '30 minutes', type: 'time' },
        { name: 'Password Requirements', value: 'Strong', type: 'select' },
        { name: 'Login Attempt Limit', value: '5 attempts', type: 'number' }
      ]
    },
    {
      title: 'Payment & Banking',
      icon: PaymentIcon,
      color: 'violet',
      settings: [
        { name: 'Supported Banks', value: '12 banks', type: 'list' },
        { name: 'Payment Processing Fee', value: '2.5%', type: 'percentage' },
        { name: 'Withdrawal Processing Time', value: '1-3 business days', type: 'time' },
        { name: 'Auto-investment Feature', value: 'Enabled', type: 'toggle' }
      ]
    },
    {
      title: 'Project Management',
      icon: BusinessIcon,
      color: 'amber',
      settings: [
        { name: 'Project Approval Required', value: 'Enabled', type: 'toggle' },
        { name: 'Maximum Project Duration', value: '5 years', type: 'time' },
        { name: 'Developer Verification', value: 'Mandatory', type: 'toggle' },
        { name: 'Project Update Frequency', value: 'Monthly', type: 'select' }
      ]
    },
    {
      title: 'Notifications',
      icon: NotificationsIcon,
      color: 'red',
      settings: [
        { name: 'Email Notifications', value: 'Enabled', type: 'toggle' },
        { name: 'SMS Notifications', value: 'Enabled', type: 'toggle' },
        { name: 'Push Notifications', value: 'Enabled', type: 'toggle' },
        { name: 'Weekly Reports', value: 'Enabled', type: 'toggle' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
          <p className="text-slate-600">Configure platform parameters and policies</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            leftIcon={<RestoreIcon className="w-4 h-4" />}
          >
            Reset
          </Button>
          <Button
            className="gradient-primary text-white shadow-glow"
            leftIcon={<SaveIcon className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="space-y-6">
        {settingsCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <Card elevation={2} padding="lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-12 h-12 bg-${category.color}-100 rounded-xl flex items-center justify-center`}>
                  <category.icon className={`w-6 h-6 text-${category.color}-600`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{category.title}</h3>
                  <p className="text-sm text-slate-600">{category.settings.length} settings</p>
                </div>
              </div>

              <div className="space-y-3">
                {category.settings.map((setting, settingIndex) => (
                  <motion.div
                    key={setting.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (categoryIndex * 0.1) + (settingIndex * 0.05) }}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <div>
                      <h4 className="font-medium text-slate-900">{setting.name}</h4>
                      <p className="text-sm text-slate-600 capitalize">{setting.type} setting</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-medium text-slate-900">{setting.value}</p>
                        {setting.type === 'toggle' && (
                          <div className="flex items-center justify-end mt-1">
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${
                              setting.value === 'Enabled' ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}>
                              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                                setting.value === 'Enabled' ? 'translate-x-5' : 'translate-x-0.5'
                              }`}></div>
                            </div>
                          </div>
                        )}
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-slate-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* System Information */}
      <Card elevation={1} padding="lg" className="mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">System Information</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-600">Platform Version</p>
            <p className="font-semibold text-slate-900">v2.1.3</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Last Updated</p>
            <p className="font-semibold text-slate-900">Dec 15, 2024</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Server Status</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <p className="font-semibold text-emerald-600">Online</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-600">Maintenance Window</p>
            <p className="font-semibold text-slate-900">Sun 2:00-4:00 AM</p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <Button
          variant="outline"
          className="p-6 h-auto flex-col space-y-2"
        >
          <RestoreIcon className="w-8 h-8 text-slate-600" />
          <div className="text-center">
            <p className="font-semibold text-slate-900">Backup Settings</p>
            <p className="text-sm text-slate-600">Export current configuration</p>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="p-6 h-auto flex-col space-y-2"
        >
          <SettingsIcon className="w-8 h-8 text-slate-600" />
          <div className="text-center">
            <p className="font-semibold text-slate-900">System Logs</p>
            <p className="text-sm text-slate-600">View platform activity logs</p>
          </div>
        </Button>
      </div>
    </div>
  )
} 