import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../styles/designSystem'

interface DatePickerProps {
  value?: string
  onChange: (date: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  min?: string
  placeholder?: string
  className?: string
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  // 当日期选择器被打开时触发（仅在从关闭到打开的瞬间触发一次）
  onOpen?: () => void
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value = '',
  onChange,
  onKeyDown,
  min,
  placeholder = '截止日期',
  className = '',
  size = 'medium',
  disabled = false,
  onOpen
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  )
  const [viewDate, setViewDate] = useState<Date>(
    value ? new Date(value) : new Date()
  )
  
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 监听外部点击关闭日期选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 更新选中日期
  useEffect(() => {
    if (value) {
      const date = new Date(value)
      setSelectedDate(date)
      setViewDate(date)
    } else {
      setSelectedDate(null)
    }
  }, [value])

  // 获取月份的天数
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  // 获取月份第一天是星期几
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  // 格式化日期显示
  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  // 处理日期选择
  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    
    // 检查最小日期限制
    if (min && newDate < new Date(min)) {
      return
    }
    
    setSelectedDate(newDate)
    onChange(newDate.toISOString().split('T')[0])
    setIsOpen(false)
  }

  // 处理月份切换
  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setViewDate(newDate)
  }

  // 处理年份切换
  const handleYearChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate)
    if (direction === 'prev') {
      newDate.setFullYear(newDate.getFullYear() - 1)
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1)
    }
    setViewDate(newDate)
  }

  // 生成日历天数
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(viewDate)
    const firstDay = getFirstDayOfMonth(viewDate)
    const days = []

    // 添加上个月的空白天数
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // 添加当月的天数
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  // 检查日期是否被禁用
  const isDateDisabled = (day: number | null) => {
    if (!day || !min) return false
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    return date < new Date(min)
  }

  // 检查日期是否是今天
  const isToday = (day: number | null) => {
    if (!day) return false
    const today = new Date()
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    return date.toDateString() === today.toDateString()
  }

  // 检查日期是否被选中
  const isSelected = (day: number | null) => {
    if (!day || !selectedDate) return false
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    return date.toDateString() === selectedDate.toDateString()
  }

  // 尺寸样式
  const sizeClasses = {
    small: 'px-3 py-2 text-xs',
    medium: 'px-3 py-2.5 text-sm',
    large: 'px-4 py-3 text-base'
  }

  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ]

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* 输入框 */}
      <div
        className={cn(
          'relative cursor-pointer',
          sizeClasses[size],
          'text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-700 rounded-lg',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent',
          'transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600',
          'flex items-center justify-between',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => {
          if (disabled) return
          const nextOpen = !isOpen
          setIsOpen(nextOpen)
          // 仅当从关闭变为打开时，通知外部
          if (nextOpen) {
            onOpen?.()
          }
        }}
      >
        <span className={cn(
          selectedDate ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
        )}>
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
        
        {/* 日历图标 */}
        <svg 
          className="w-4 h-4 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {/* 日期选择器弹出层 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white/95 dark:bg-gray-800/95 border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-xl shadow-gray-900/10 dark:shadow-black/20 backdrop-blur-md p-4 min-w-[300px] animate-in fade-in zoom-in-95 duration-200">
          {/* 头部：年月导航 */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2">
              {/* 年份控制 */}
              <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1">
                <button
                  onClick={() => handleYearChange('prev')}
                  className="p-1.5 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="mx-3 font-semibold text-gray-900 dark:text-gray-100 min-w-[60px] text-center text-sm">
                  {viewDate.getFullYear()}
                </span>
                <button
                  onClick={() => handleYearChange('next')}
                  className="p-1.5 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* 月份控制 */}
              <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1">
                <button
                  onClick={() => handleMonthChange('prev')}
                  className="p-1.5 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="mx-3 font-semibold text-gray-900 dark:text-gray-100 min-w-[40px] text-center text-sm">
                  {months[viewDate.getMonth()]}
                </span>
                <button
                  onClick={() => handleMonthChange('next')}
                  className="p-1.5 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {weekDays.map((day) => (
              <div
                key={day}
                className="h-8 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-700/30 rounded-md"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 日期网格 */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => (
              <button
                key={index}
                onClick={() => day && !isDateDisabled(day) && handleDateSelect(day)}
                disabled={!day || isDateDisabled(day)}
                className={cn(
                  'h-9 w-9 flex items-center justify-center text-sm rounded-lg transition-all duration-200 font-medium',
                  !day ? 'invisible' : '',
                  day && !isDateDisabled(day) ? 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105 hover:shadow-sm' : '',
                  isSelected(day) ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-500/25 scale-105' : '',
                  isToday(day) && !isSelected(day) ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800' : '',
                  isDateDisabled(day) ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50' : '',
                  day && !isSelected(day) && !isToday(day) && !isDateDisabled(day) ? 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100' : ''
                )}
              >
                {day}
              </button>
            ))}
          </div>

          {/* 底部操作 */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
            <button
              onClick={() => {
                setSelectedDate(null)
                onChange('')
                setIsOpen(false)
              }}
              className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
            >
              清除
            </button>
            
            <button
              onClick={() => {
                const today = new Date()
                
                // 检查最小日期限制
                if (min && today < new Date(min)) {
                  return
                }
                
                setViewDate(today)
                setSelectedDate(today)
                onChange(today.toISOString().split('T')[0])
                setIsOpen(false)
              }}
              className="px-4 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200 hover:shadow-sm border border-blue-200/50 dark:border-blue-800/50 hover:scale-105"
            >
              今天
            </button>
            
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 border border-gray-200/50 dark:border-gray-600/50"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 隐藏的原生input用于键盘事件 */}
      <input
        ref={inputRef}
        type="hidden"
        value={value}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}