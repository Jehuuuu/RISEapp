'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import PersonIcon from '@mui/icons-material/Person'
import DescriptionIcon from '@mui/icons-material/Description'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import SecurityIcon from '@mui/icons-material/Security'
import { motion, AnimatePresence } from 'framer-motion'

type KYCStep = 'personal' | 'documents' | 'verification' | 'review' | 'completed'

interface PersonalInfo {
  firstName: string
  lastName: string
  middleName: string
  birthDate: string
  nationality: string
  address: string
  city: string
  zipCode: string
  phone: string
  email: string
  occupation: string
  sourceOfIncome: string
  monthlyIncome: string
}

interface DocumentInfo {
  governmentId: File | null
  proofOfAddress: File | null
  incomeProof: File | null
  selfie: File | null
}

export default function KYCPage() {
  const router = useRouter()
  const { currentUser } = useStore()
  const [currentStep, setCurrentStep] = useState<KYCStep>('personal')
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    nationality: 'Filipino',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
    email: currentUser?.email || '',
    occupation: '',
    sourceOfIncome: '',
    monthlyIncome: ''
  })
  
  const [documents, setDocuments] = useState<DocumentInfo>({
    governmentId: null,
    proofOfAddress: null,
    incomeProof: null,
    selfie: null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      router.push('/')
    }
  }, [currentUser, router])

  if (!currentUser) return null

  // If already verified, show status
  if (currentUser.kycStatus === 'verified') {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card elevation={2} padding="lg" className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <VerifiedUserIcon className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Account Verified</h2>
            <p className="text-slate-600 mb-6">
              Your account has been successfully verified. You can now access all platform features.
            </p>
            <Button onClick={() => router.back()}>
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  const steps = [
    { id: 'personal', label: 'Personal Info', icon: PersonIcon },
    { id: 'documents', label: 'Documents', icon: DescriptionIcon },
    { id: 'verification', label: 'Verification', icon: SecurityIcon },
    { id: 'review', label: 'Review', icon: CheckCircleIcon }
  ]

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: keyof DocumentInfo, file: File | null) => {
    setDocuments(prev => ({ ...prev, [field]: file }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Update user KYC status to pending
    // This would normally be handled by the backend
    
    setCurrentStep('completed')
    setIsSubmitting(false)
  }

  const canProceedFromPersonal = () => {
    return personalInfo.firstName && personalInfo.lastName && personalInfo.birthDate && 
           personalInfo.address && personalInfo.city && personalInfo.phone && 
           personalInfo.occupation && personalInfo.sourceOfIncome
  }

  const canProceedFromDocuments = () => {
    return documents.governmentId && documents.proofOfAddress && 
           documents.incomeProof && documents.selfie
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
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
          <h1 className="text-lg font-semibold text-slate-900">KYC Verification</h1>
          <div className="w-16" /> {/* Spacer */}
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between mt-4 max-w-md mx-auto">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep
            const isCompleted = steps.findIndex(s => s.id === currentStep) > index
            const IconComponent = step.icon
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted ? 'bg-emerald-500 border-emerald-500' :
                  isActive ? 'bg-sky-500 border-sky-500' :
                  'bg-slate-100 border-slate-300'
                }`}>
                  {isCompleted ? (
                    <CheckCircleIcon className="w-5 h-5 text-white" />
                  ) : (
                    <IconComponent className={`w-5 h-5 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`} />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    isCompleted ? 'bg-emerald-500' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {/* Personal Information Step */}
          {currentStep === 'personal' && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card elevation={2} padding="lg">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Personal Information</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={personalInfo.firstName}
                        onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="Juan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={personalInfo.lastName}
                        onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="Dela Cruz"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Middle Name</label>
                    <input
                      type="text"
                      value={personalInfo.middleName}
                      onChange={(e) => handlePersonalInfoChange('middleName', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={personalInfo.birthDate}
                      onChange={(e) => handlePersonalInfoChange('birthDate', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={personalInfo.address}
                      onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="123 Main Street, Barangay ABC"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        value={personalInfo.city}
                        onChange={(e) => handlePersonalInfoChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="Makati"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={personalInfo.zipCode}
                        onChange={(e) => handlePersonalInfoChange('zipCode', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="1234"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="+639171234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Occupation</label>
                    <input
                      type="text"
                      value={personalInfo.occupation}
                      onChange={(e) => handlePersonalInfoChange('occupation', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Source of Income</label>
                    <select
                      value={personalInfo.sourceOfIncome}
                      onChange={(e) => handlePersonalInfoChange('sourceOfIncome', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="">Select source</option>
                      <option value="employment">Employment</option>
                      <option value="business">Business</option>
                      <option value="investments">Investments</option>
                      <option value="freelance">Freelance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Income Range</label>
                    <select
                      value={personalInfo.monthlyIncome}
                      onChange={(e) => handlePersonalInfoChange('monthlyIncome', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="">Select range</option>
                      <option value="below-30k">Below ₱30,000</option>
                      <option value="30k-50k">₱30,000 - ₱50,000</option>
                      <option value="50k-100k">₱50,000 - ₱100,000</option>
                      <option value="100k-200k">₱100,000 - ₱200,000</option>
                      <option value="above-200k">Above ₱200,000</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    fullWidth
                    disabled={!canProceedFromPersonal()}
                    onClick={() => setCurrentStep('documents')}
                    rightIcon={<ArrowForwardIcon className="w-4 h-4" />}
                  >
                    Continue to Documents
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Documents Upload Step */}
          {currentStep === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card elevation={2} padding="lg">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Document Upload</h2>
                
                <div className="space-y-6">
                  {/* Government ID */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Government ID (Passport, Driver's License, SSS ID)
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-sky-400 transition-colors">
                      {documents.governmentId ? (
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                          <span className="text-sm text-slate-700">{documents.governmentId.name}</span>
                        </div>
                      ) : (
                        <div>
                          <CloudUploadIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload('governmentId', e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Proof of Address */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Proof of Address (Utility Bill, Bank Statement)
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-sky-400 transition-colors relative">
                      {documents.proofOfAddress ? (
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                          <span className="text-sm text-slate-700">{documents.proofOfAddress.name}</span>
                        </div>
                      ) : (
                        <div>
                          <CloudUploadIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload('proofOfAddress', e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Income Proof */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Proof of Income (Payslip, Certificate of Employment)
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-sky-400 transition-colors relative">
                      {documents.incomeProof ? (
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                          <span className="text-sm text-slate-700">{documents.incomeProof.name}</span>
                        </div>
                      ) : (
                        <div>
                          <CloudUploadIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload('incomeProof', e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Selfie */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Selfie with ID
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-sky-400 transition-colors relative">
                      {documents.selfie ? (
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                          <span className="text-sm text-slate-700">{documents.selfie.name}</span>
                        </div>
                      ) : (
                        <div>
                          <PhotoCameraIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm text-slate-600">Take or upload a selfie with your ID</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={(e) => handleFileUpload('selfie', e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <Button
                    fullWidth
                    disabled={!canProceedFromDocuments()}
                    onClick={() => setCurrentStep('verification')}
                    rightIcon={<ArrowForwardIcon className="w-4 h-4" />}
                  >
                    Continue to Verification
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setCurrentStep('personal')}
                    leftIcon={<ArrowBackIcon className="w-4 h-4" />}
                  >
                    Back
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Verification Step */}
          {currentStep === 'verification' && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card elevation={2} padding="lg">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Final Verification</h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-start space-x-3">
                      <WarningIcon className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-amber-900">Important Notice</h3>
                        <p className="text-sm text-amber-800 mt-1">
                          Please review all information carefully. Once submitted, your application 
                          will be reviewed by our compliance team within 24-48 hours.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900">Declaration</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input type="checkbox" className="mt-1" required />
                        <span className="text-sm text-slate-700">
                          I certify that all information provided is true and accurate to the best of my knowledge.
                        </span>
                      </label>
                      
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input type="checkbox" className="mt-1" required />
                        <span className="text-sm text-slate-700">
                          I agree to the Terms of Service and Privacy Policy.
                        </span>
                      </label>
                      
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input type="checkbox" className="mt-1" required />
                        <span className="text-sm text-slate-700">
                          I consent to RISE processing my personal data for verification purposes.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <Button
                    fullWidth
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setCurrentStep('documents')}
                    leftIcon={<ArrowBackIcon className="w-4 h-4" />}
                  >
                    Back
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Completion Step */}
          {currentStep === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card elevation={2} padding="lg" className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircleIcon className="w-8 h-8 text-sky-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Application Submitted</h2>
                <p className="text-slate-600 mb-6">
                  Your KYC verification has been submitted successfully. Our team will review 
                  your application within 24-48 hours.
                </p>
                <div className="p-4 bg-sky-50 rounded-lg mb-6">
                  <p className="text-sm text-sky-800">
                    <strong>What's next?</strong><br />
                    You'll receive an email notification once your verification is complete. 
                    In the meantime, you can browse available projects.
                  </p>
                </div>
                <Button onClick={() => router.push('/investor/browse')}>
                  Browse Projects
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 