import React from 'react'
import { useTodoStore } from '../store/todoStore'

export const DailyStats: React.FC = () => {
  const { dailyStats } = useTodoStore()
  const stats = dailyStats()

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          每日任务统计
        </h3>
      </div>
      
      <div className="space-y-3">
        {/* 今日创建 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">今日创建</span>
          </div>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {stats.todayCreated}
          </span>
        </div>

        {/* 今日完成 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">今日完成</span>
          </div>
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
            {stats.todayCompleted}
          </span>
        </div>

        {/* 今日到期 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">今日到期</span>
          </div>
          <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
            {stats.todayDue}
          </span>
        </div>

        {/* 今日逾期 */}
        {stats.todayOverdue > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">今日逾期</span>
            </div>
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
              {stats.todayOverdue}
            </span>
          </div>
        )}

        {/* 空状态提示 */}
        {stats.todayCreated === 0 && stats.todayDue === 0 && (
          <div className="text-center py-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              今日暂无任务活动
            </p>
          </div>
        )}
      </div>
    </div>
  )
}