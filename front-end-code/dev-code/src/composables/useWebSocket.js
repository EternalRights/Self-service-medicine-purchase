// src/composables/useWebSocket.js
/**
 * 通用WebSocket组合式函数
 * 提供WebSocket连接管理、消息处理和状态监控能力
 */
import { ref, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

export function useWebSocket(config) {
  const { url, onMessage, onError, onClose } = config
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const lastError = ref(null)
  const ws = ref(null)

  // 连接WebSocket
  const connect = () => {
    if (isConnecting.value || isConnected.value) return

    isConnecting.value = true
    lastError.value = null

    try {
      ws.value = new WebSocket(url)

      ws.value.onopen = () => {
        isConnected.value = true
        isConnecting.value = false
        console.log('WebSocket连接成功:', url)
      }

      ws.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          // 使用传入的onMessage回调处理消息
          if (typeof onMessage === 'function') {
            onMessage(data)
          }
        } catch (e) {
          console.error('解析WebSocket消息失败:', e)
          if (typeof onError === 'function') {
            onError(e)
          }
        }
      }

      ws.value.onclose = (event) => {
        isConnected.value = false
        isConnecting.value = false
        console.log('WebSocket连接关闭:', event.code, event.reason)
        
        // 调用传入的onClose回调
        if (typeof onClose === 'function') {
          onClose(event)
        }
        
        // 自动重连机制
        setTimeout(() => {
          connect()
        }, 5000)
      }

      ws.value.onerror = (error) => {
        lastError.value = error
        console.error('WebSocket错误:', error)
        ElMessage.error('WebSocket连接异常')
        if (typeof onError === 'function') {
          onError(error)
        }
      }
    } catch (error) {
      isConnecting.value = false
      lastError.value = error
      console.error('创建WebSocket失败:', error)
      
      // 重试机制
      setTimeout(() => {
        connect()
      }, 5000)
    }
  }

  // 发送消息
  const send = (data) => {
    if (ws.value && isConnected.value) {
      try {
        ws.value.send(JSON.stringify(data))
      } catch (error) {
        console.error('发送消息失败:', error)
        ElMessage.error('消息发送失败')
      }
    } else {
      console.warn('WebSocket未连接，无法发送消息')
      ElMessage.warning('网络连接未建立')
    }
  }

  // 关闭连接
  const close = () => {
    if (ws.value) {
      ws.value.close()
      ws.value = null
    }
  }

  // 组件卸载时清理
  onUnmounted(() => {
    close()
  })

  return {
    // 状态
    isConnected,
    isConnecting,
    lastError,
    
    // 方法
    connect,
    send,
    close,
    
    // 原始WebSocket实例（谨慎使用）
    ws: ws.value
  }
}