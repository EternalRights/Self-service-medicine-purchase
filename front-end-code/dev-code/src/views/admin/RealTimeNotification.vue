import { useWebSocket } from '@/composables/useWebSocket'
const notificationStore = useNotificationStore()
// 展开状态
const expanded = ref(true)

// WebSocket管理
const wsConfig = {
  url: import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws/notifications',
  onMessage: (data) => {
    notificationStore.addNotification(data)
    playSound(data.message_type === MessageType.MEDICAL_CONSULT ? 'high' : 'normal')
  },
  onError: (error) => {
    console.error('WebSocket连接错误:', error)
  }
}
const { connect, close } = useWebSocket(wsConfig)

// 监听WebSocket消息
onMounted(() => {
  // 启动WebSocket连接
  connect()
  
  // 组件卸载时清理
  onUnmounted(() => {
    close()
  })
})