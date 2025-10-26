import React, { useState, useEffect, useRef } from 'react'
import { useTodoStore } from '../store/todoStore'
import { StorageService } from '../services/storageService'
import NotificationService from '../services/notificationService'
import toast from 'react-hot-toast'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { exportTodos, importTodos, clearAllTodos, enableNotifications, scheduleReminders, checkOverdueTodos, testNotification } = useTodoStore()
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if (isOpen) {
      // 获取通知权限状态
      setNotificationPermission(NotificationService.getPermissionStatus())
    }
  }, [isOpen])

  const handleEnableNotifications = async () => {
    const granted = await enableNotifications()
    if (granted) {
      setNotificationPermission('granted')
      toast.success('通知权限已开启')
      // 为现有任务设置提醒
      scheduleReminders()
    } else {
      toast.error('通知权限被拒绝')
    }
  }

  const handleTestNotification = () => {
    if (notificationPermission === 'granted') {
      testNotification()
      toast.success('测试通知已发送')
    } else {
      toast.error('请先开启通知权限')
    }
  }

  const handleCheckOverdue = () => {
    checkOverdueTodos()
    toast.success('已检查逾期任务')
  }

  if (!isOpen) return null

  const handleExport = () => {
    try {
      exportTodos()
      toast.success('数据导出成功！')
    } catch (error) {
      toast.error('导出失败，请重试')
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      await importTodos(file)
      toast.success('数据导入成功！')
      onClose()
    } catch (error) {
      toast.error('导入失败，请检查文件格式')
    }

    // 清空文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClearAll = () => {
    if (window.confirm('确定要清空所有任务吗？此操作不可撤销。')) {
      clearAllTodos()
      toast.success('所有任务已清空')
      onClose()
    }
  }

  const storageStats = StorageService.getStorageStats()

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl p-8 w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto shadow-2xl shadow-black/20 border border-white/20 dark:border-gray-700/50 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">设置</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gray-500/20 group"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-8">
          {/* 数据管理 */}
          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              数据管理
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-3 px-5 py-4 text-left bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 border border-blue-200/50 dark:border-blue-800/50"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <div className="font-semibold">导出数据</div>
                  <div className="text-xs opacity-75">将所有任务导出为JSON文件</div>
                </div>
              </button>

              <button
                onClick={handleImportClick}
                className="w-full flex items-center gap-3 px-5 py-4 text-left bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 border border-green-200/50 dark:border-green-800/50"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <div>
                  <div className="font-semibold">导入数据</div>
                  <div className="text-xs opacity-75">从JSON文件导入任务</div>
                </div>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
          </div>

          {/* 通知设置 */}
          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-200">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.257 7.462L7.5 5.5l2.243 1.962M6.5 17h8.5a2.5 2.5 0 002.5-2.5V9a2.5 2.5 0 00-2.5-2.5H6.5A2.5 2.5 0 004 9v5.5A2.5 2.5 0 006.5 17z" />
              </svg>
              通知设置
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                <div>
                  <div className="font-semibold text-sm">通知权限</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {notificationPermission === 'granted' ? '✅ 已开启' : 
                     notificationPermission === 'denied' ? '❌ 已拒绝' : '⚠️ 未设置'}
                  </div>
                </div>
                {notificationPermission !== 'granted' && (
                  <button
                    onClick={handleEnableNotifications}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
                  >
                    开启通知
                  </button>
                )}
              </div>

              {notificationPermission === 'granted' && (
                <>
                  <button
                    onClick={handleTestNotification}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 border border-green-200/50 dark:border-green-800/50"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h8V9H4v2z" />
                    </svg>
                    <div>
                      <div className="font-semibold">测试通知</div>
                      <div className="text-xs opacity-75">发送一条测试通知</div>
                    </div>
                  </button>

                  <button
                    onClick={handleCheckOverdue}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 border border-orange-200/50 dark:border-orange-800/50"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="font-semibold">检查逾期任务</div>
                      <div className="text-xs opacity-75">立即检查并提醒逾期任务</div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 存储信息 */}
          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              存储信息
            </h3>
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700 dark:to-slate-700 rounded-xl p-5 border border-gray-200/50 dark:border-gray-600/50">
              <div className="flex justify-between text-sm mb-3">
                <span className="font-medium">已使用空间</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{(storageStats.used / 1024).toFixed(1)} KB</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                  style={{ width: `${Math.min(storageStats.percentage, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {storageStats.percentage.toFixed(1)}% 已使用
              </div>
            </div>
          </div>

          {/* 危险操作 */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">危险操作</h3>
            <button
              onClick={handleClearAll}
              className="w-full flex items-center gap-3 px-4 py-3 text-left bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <div>
                <div className="font-medium">清空所有数据</div>
                <div className="text-xs opacity-75">删除所有任务和设置</div>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}