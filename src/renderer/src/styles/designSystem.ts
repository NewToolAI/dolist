// 设计系统 - 统一的样式常量和类名
export const designSystem = {
  // 输入框样式
  input: {
    base: "px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
    hover: "hover:border-gray-300 dark:hover:border-gray-600",
    small: "px-3 py-2 text-xs",
    medium: "px-3 py-2.5 text-sm",
    large: "px-4 py-3 text-sm"
  },

  // 按钮样式
  button: {
    // 基础样式
    base: "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
    
    // 尺寸
    sizes: {
      small: "px-3 py-1.5 text-xs",
      medium: "px-4 py-2 text-sm", 
      large: "px-6 py-3 text-base"
    },

    // 变体
    variants: {
      primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md",
      secondary: "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
      ghost: "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500",
      danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md",
      success: "text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md"
    },

    // 图标按钮
    icon: {
      small: "p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200",
      medium: "p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200",
      colored: {
        blue: "p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-all duration-200",
        red: "p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200",
        green: "p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-all duration-200"
      }
    }
  },

  // 过滤器按钮样式
  filter: {
    base: "w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
    active: {
      all: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30",
      active: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30", 
      completed: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30",
      overdue: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30"
    },
    inactive: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
  },

  // 卡片样式
  card: {
    base: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-lg shadow-sm",
    hover: "hover:shadow-md transition-shadow duration-200",
    interactive: "cursor-pointer hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-colors duration-200"
  },

  // 模态框样式
  modal: {
    overlay: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300",
    content: "bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto shadow-md border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-300"
  },

  // 状态指示器
  status: {
    dot: "w-2 h-2 rounded-full",
    colors: {
      blue: "bg-blue-500",
      orange: "bg-orange-500", 
      green: "bg-green-500",
      red: "bg-red-500",
      gray: "bg-gray-400"
    }
  },

  // 文本样式
  text: {
    title: "text-lg font-semibold text-gray-800 dark:text-gray-200",
    subtitle: "text-base font-semibold text-gray-800 dark:text-gray-200",
    body: "text-sm text-gray-700 dark:text-gray-300",
    caption: "text-xs text-gray-500 dark:text-gray-400",
    muted: "text-gray-500 dark:text-gray-400"
  }
}

// 工具函数：组合样式类
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

// 预设组合样式
export const presets = {
  // 输入框预设
  inputDefault: cn(designSystem.input.base, designSystem.input.hover),
  inputSmall: cn(designSystem.input.base, designSystem.input.hover, designSystem.input.small),
  inputMedium: cn(designSystem.input.base, designSystem.input.hover, designSystem.input.medium),

  // 按钮预设
  buttonPrimary: cn(designSystem.button.base, designSystem.button.sizes.medium, designSystem.button.variants.primary),
  buttonSecondary: cn(designSystem.button.base, designSystem.button.sizes.medium, designSystem.button.variants.secondary),
  buttonGhost: cn(designSystem.button.base, designSystem.button.sizes.medium, designSystem.button.variants.ghost),
  buttonDanger: cn(designSystem.button.base, designSystem.button.sizes.medium, designSystem.button.variants.danger),

  // 图标按钮预设
  iconButton: designSystem.button.icon.medium,
  iconButtonBlue: designSystem.button.icon.colored.blue,
  iconButtonRed: designSystem.button.icon.colored.red,
  iconButtonGreen: designSystem.button.icon.colored.green
}