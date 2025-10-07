// src/stores/notification.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useWebSocket } from '@/composables/useWebSocket'
import { ElNotification } from 'element-plus'
import { MessageType } from '@/types/notification'
import { formatTime } from '@/utils/helpers'

// 导入音频文件
import highPrioritySound from '@/assets/high-priority-notification.mp3'
import normalPrioritySound from '@/assets/normal-notification.mp3'

// 导入图片文件
import medicineBoxIcon from '@/assets/medicine-box.png'
import shoppingCartIcon from '@/assets/shopping-cart.png'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  const unreadCount = ref(0)
  
  // 初始化WebSocket连接
  const { connect: connectWebSocket, close: closeWebSocket } = useWebSocket({
    url: import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws/notifications',
    onMessage: handleWebSocketMessage,
    onError: handleWebSocketError,
    onClose: handleWebSocketClose
  })
  
  // 连接WebSocket
  connectWebSocket()
  
  // 处理WebSocket消息
  function handleWebSocketMessage(event) {
    try {
      const message = JSON.parse(event.data)
      addNotification(message)
      
      // 播放声音提示
      if (message.message_type === MessageType.MEDICAL_CONSULT) {
        playNotificationSound('high')
      } else {
        playNotificationSound('normal')
      }
    } catch (error) {
      console.error('解析WebSocket消息失败:', error)
    }
  }
  
  // 处理WebSocket错误
  function handleWebSocketError(error) {
    console.error('WebSocket连接错误:', error)
    // 尝试重新连接
    setTimeout(() => connectWebSocket(), 5000)
  }
  
  // 处理WebSocket关闭
  function handleWebSocketClose(event) {
    console.log('WebSocket连接关闭:', event)
    // 尝试重新连接
    setTimeout(() => connectWebSocket(), 5000)
  }
  
  // 播放通知声音
  function playNotificationSound(priority) {
    const audio = new Audio()
    audio.src = priority === 'high' 
      ? highPrioritySound
      : normalPrioritySound
    audio.play().catch(error => {
      console.error('播放通知声音失败:', error)
    })
  }
  
  // 添加通知 - 保留原始函数名和结构
  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date(),
      isRead: false
    }
    
    notifications.value.unshift(newNotification)
    unreadCount.value += 1
    
    // 显示桌面通知
    showDesktopNotification(newNotification)
    
    // 限制通知数量
    if (notifications.value.length > 100) {
      notifications.value.pop()
    }
  }
  
   // 显示桌面通知
  function showDesktopNotification(notification) {
    if (!('Notification' in window)) {
      console.log('此浏览器不支持桌面通知')
      return
    }
    
    if (Notification.permission === 'granted') {
      const title = notification.title
      const options = {
        body: notification.content,
        icon: notification.message_type === MessageType.MEDICAL_CONSULT
          ? medicineBoxIcon
          : shoppingCartIcon
      }
      
      new Notification(title, options)
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showDesktopNotification(notification)
        }
      })
    }
  }
  
  // 标记通知为已读 - 保留原始函数名和结构
  const markAsRead = (notificationId) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification && !notification.isRead) {
      notification.isRead = true
      unreadCount.value -= 1
      // 调用API更新通知状态
      updateNotificationStatus(notificationId, true)
    }
  }
  
  // 标记所有通知为已读 - 保留原始函数名和结构
  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      if (!notification.isRead) {
        notification.isRead = true
      }
    })
    unreadCount.value = 0
    // 调用API标记所有通知为已读
    markAllNotificationsAsRead()
  }
  
  // 清除通知 - 保留原始函数名和结构
  const clearNotifications = () => {
    notifications.value = []
    unreadCount.value = 0
  }
  
  // 获取未读通知数量（计算属性）- 保留原始函数名和结构
  const getUnreadCount = computed(() => unreadCount.value)
  
  // 根据类型过滤通知 - 保留原始函数名和结构
  const getNotificationsByType = (type) => {
    return notifications.value.filter(notif => notif.message_type === type)
  }
  
  // 格式化通知时间
  const formatNotificationTime = (timestamp) => {
    return formatTime(timestamp)
  }
  
  // API调用函数
  async function updateNotificationStatus(id, isProcessed) {
    try {
      // 调用API更新通知状态
      await $api.orders.updateNotificationStatus(id, isProcessed)
    } catch (error) {
      console.error('更新通知状态失败:', error)
      // 恢复状态
      const notification = notifications.value.find(n => n.id === id)
      if (notification) {
        notification.isRead = !isProcessed
        unreadCount.value += isProcessed ? 1 : -1
      }
    }
  }
  
  async function markAllNotificationsAsRead() {
    try {
      // 调用API标记所有通知为已读
      await $api.orders.markAllNotificationsAsRead()
    } catch (error) {
      console.error('标记所有通知为已读失败:', error)
    }
  }
  
  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    getUnreadCount,
    getNotificationsByType,
    formatNotificationTime,
    closeWebSocket: closeWebSocket
  }
})