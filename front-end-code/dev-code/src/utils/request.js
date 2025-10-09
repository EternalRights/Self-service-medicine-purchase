import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

/**
 * Axios 请求封装
 * 提供统一的请求处理、错误处理和 Token 管理
 */

// 创建 axios 实例
const service = axios.create({
  // 基础地址 - 根据环境变量配置
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  
  // 请求超时时间（毫秒）
  timeout: 30000,
  
  // 跨域请求时是否需要使用凭证
  withCredentials: true,
  
  // 请求头配置
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// HTTP 状态码错误信息映射
const httpStatusDic = {
  400: '请求参数错误',
  401: '未授权，请重新登录',
  403: '拒绝访问，权限不足',
  404: '请求的资源不存在',
  405: '请求方法不被允许',
  408: '请求超时，请检查网络连接',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持'
}

/**
 * 检查 Token 有效性
 */
const checkTokenValidity = () => {
  const authStore = useAuthStore()
  return authStore.token && authStore.tokenExpiry > Date.now()
}

/**
 * 刷新 Token（预留接口）
 */
const refreshToken = async () => {
  // 这里预留 Token 刷新逻辑
  // 在实际项目中，当 Token 过期时需要调用刷新接口
  console.warn('Token 可能已过期，需要刷新逻辑')
  return null
}

// 请求拦截器
service.interceptors.request.use(
  async (config) => {
    // 显示加载状态（可选）
    if (config.showLoading !== false) {
      // 可以在这里集成加载动画，如 NProgress
    }
    
    // Token 处理
    if (checkTokenValidity()) {
      const authStore = useAuthStore()
      config.headers.Authorization = `Bearer ${authStore.token}`
      config.headers['X-User-Id'] = authStore.userId
      config.headers['X-User-Name'] = encodeURIComponent(authStore.userName || '')
    }
    
    // 针对不同 Content-Type 处理数据
    if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      // FormData 数据处理
      if (config.data && !(config.data instanceof FormData)) {
        const formData = new FormData()
        Object.keys(config.data).forEach(key => {
          formData.append(key, config.data[key])
        })
        config.data = formData
      }
    }
    
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    console.log(`🚀 发起请求: ${config.method?.toUpperCase()} ${config.url}`, config)
    return config
  },
  (error) => {
    // 请求错误处理
    console.error('❌ 请求配置错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 隐藏加载状态
    if (response.config.showLoading !== false) {
      // 关闭加载动画
    }
    
    console.log(`✅ 请求成功: ${response.config.url}`, response.data)
    
    const { data, status } = response
    
    // 处理二进制流响应（如文件下载）
    if (response.config.responseType === 'blob') {
      return response
    }
    
    // 根据后端统一响应格式处理
    // 当前项目使用 Result<T> 包装结构: { code: number, msg: string, data: T }
    if (data && typeof data === 'object') {
      const { code, msg } = data
      
      // 业务成功（code为1表示成功）
      if (code === 1) {
        return data.data // 直接返回解包后的业务数据
      }
      
      // 业务错误处理
      if (code === 0) { // 后端定义 code=0 表示失败
        const errorMsg = msg || '操作失败'
        ElMessage.error(errorMsg)
        
        // 特殊错误码处理
        if ([401, 403].includes(code)) {
          const authStore = useAuthStore()
          authStore.logout()
          setTimeout(() => {
            window.location.href = '/auth/login'
          }, 1500)
        }
        
        return Promise.reject(new Error(errorMsg))
      }
    }
    
    // 对于非 Result<T> 包装的直接响应（如二进制流已提前处理），直接返回
    return data
  },
  (error) => {
    // 隐藏加载状态
    if (error.config?.showLoading !== false) {
      // 关闭加载动画
    }
    
    console.error('❌ 请求失败:', error)
    
    // 网络错误或请求超时
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        ElMessage.error('网络连接超时，请检查网络后重试')
      } else {
        ElMessage.error('网络连接失败，请检查网络设置')
      }
      return Promise.reject(error)
    }
    
    // HTTP 状态码错误处理
    const { status, data } = error.response
    const errorMessage = data?.message || httpStatusDic[status] || `网络错误: ${status}`
    
    switch (status) {
      case 401:
        // 未授权，清除登录状态
        const authStore = useAuthStore()
        authStore.logout()
        ElMessage.error('登录已过期，请重新登录')
        setTimeout(() => {
          window.location.href = '/auth/login'
        }, 1500)
        break
        
      case 403:
        ElMessage.error('权限不足，无法访问该资源')
        break
        
      case 404:
        ElMessage.error('请求的资源不存在')
        break
        
      case 500:
        ElMessage.error('服务器内部错误，请稍后重试')
        break
        
      default:
        ElMessage.error(errorMessage)
    }
    
    return Promise.reject(error)
  }
)

/**
 * 通用请求方法封装
 */

// GET 请求
export const get = (url, params = {}, config = {}) => {
  return service({
    url,
    method: 'get',
    params,
    ...config
  })
}

// POST 请求
export const post = (url, data = {}, config = {}) => {
  return service({
    url,
    method: 'post',
    data,
    ...config
  })
}

// PUT 请求
export const put = (url, data = {}, config = {}) => {
  return service({
    url,
    method: 'put',
    data,
    ...config
  })
}

// DELETE 请求
export const del = (url, params = {}, config = {}) => {
  return service({
    url,
    method: 'delete',
    params,
    ...config
  })
}

// PATCH 请求
export const patch = (url, data = {}, config = {}) => {
  return service({
    url,
    method: 'patch',
    data,
    ...config
  })
}

/**
 * 文件上传方法
 */
export const upload = (url, file, onProgress = null, config = {}) => {
  const formData = new FormData()
  formData.append('file', file)
  
  return service({
    url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percent)
      }
    },
    ...config
  })
}

/**
 * 文件下载方法
 */
export const download = (url, params = {}, filename = 'download') => {
  return service({
    url,
    method: 'get',
    params,
    responseType: 'blob'
  }).then(response => {
    // 创建 blob URL 并触发下载
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    link.click()
    window.URL.revokeObjectURL(downloadUrl)
  })
}

export default service