'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface DataPoint {
  month: string
  value: number
  returns: number
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string }>
  label?: string
}

interface PerformanceChartProps {
  data: DataPoint[]
  type?: 'line' | 'area'
  height?: number
  showGrid?: boolean
  animated?: boolean
}

export default function PerformanceChart({ 
  data, 
  type = 'area', 
  height = 200, 
  showGrid = true,
  animated = true 
}: PerformanceChartProps) {
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="text-sm font-medium text-slate-900">{label}</p>
          <p className="text-sm text-sky-600">
            Value: <span className="font-semibold">{formatCurrency(payload[0].value)}</span>
          </p>
          {payload[1] && (
            <p className="text-sm text-emerald-600">
              Returns: <span className="font-semibold">+{formatCurrency(payload[1].value)}</span>
            </p>
          )}
        </div>
      )
    }
    return null
  }

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#0ea5e9"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
            animationDuration={animated ? 1000 : 0}
          />
          <Area
            type="monotone"
            dataKey="returns"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorReturns)"
            animationDuration={animated ? 1500 : 0}
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
        <XAxis 
          dataKey="month" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#64748b' }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#64748b' }}
          tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#0ea5e9"
          strokeWidth={3}
          dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2 }}
          animationDuration={animated ? 1000 : 0}
        />
        <Line
          type="monotone"
          dataKey="returns"
          stroke="#10b981"
          strokeWidth={3}
          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          animationDuration={animated ? 1500 : 0}
        />
      </LineChart>
    </ResponsiveContainer>
  )
} 