<!-- src/components/admin/RealTimeNotification.vue -->
<template>
  <div class="real-time-notification" :class="{ expanded }">
    <div class="notification-header" @click="toggleExpand">
      <div class="header-left">
        <el-icon :class="['toggle-icon', { 'rotate': expanded }]">
          <ArrowDown />
        </el-icon>
        <span class="header-title">实时消息看板</span>
        <el-tag v-if="unreadCount > 0" type="danger" class="unread-count">
          {{ unreadCount }}条未读
        </el-tag>
      </div>
      <div class="header-right">
        <el-button type="text" @click="markAllAsRead">
          全部标记为已读
        </el-button>
      </div>
    </div>
    
    <div class="notification-body">
      <div class="notification-list">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification-item"
          :class="{
            'unread': !notification.isRead,
            'high-priority': notification.message_type === MessageType.MEDICAL_CONSULT
          }"
        >
          <div class="notification-content">
            <div class="notification-title">
              <span class="priority-tag" v-if="notification.message_type === MessageType.MEDICAL_CONSULT">
                <el-icon><Warning /></el-icon>
                高优先级
              </span>
              {{ notification.title }}
            </div>
            <div class="notification-message">
              {{ notification.content }}
            </div>
            <div class="notification-time">
              {{ formatTime(notification.create_time) }}
            </div>
          </div>
          <div class="notification-actions">
            <el-button 
              v-if="!notification.isRead"
              type="text"
              size="small"
              @click="markAsRead(notification.id)"
            >
              标记为已读
            </el-button>
            <el-button 
              v-if="notification.message_type === MessageType.MEDICAL_CONSULT"
              type="primary"
              size="small"
              @click="handleConsultation(notification)"
            >
              处理咨询
            </el-button>
          </div>
        </div>
        
        <div v-if="notifications.length === 0" class="empty-notification">
          暂无新消息
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowDown, Warning } from '@element-plus/icons-vue'
import { useNotificationStore } from '@/stores/notification'
import { MessageType } from '@/types/notification'
import { formatTime } from '@/utils/helpers'

import highPrioritySound from '@/assets/high-priority-notification.mp3'
import normalPrioritySound from '@/assets/normal-notification.mp3'

const notificationStore = useNotificationStore()
// 展开状态
const expanded = ref(true)

// 获取通知数据
const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)

// 切换展开状态
const toggleExpand = () => {
  expanded.value = !expanded.value
}

// 标记为已读
const markAsRead = (id) => {
  notificationStore.markAsRead(id)
}

// 标记所有为已读
const markAllAsRead = () => {
  notificationStore.markAllAsRead()
}

// 处理用药咨询
const handleConsultation = (notification) => {
  // 这里可以跳转到订单管理页面或打开咨询处理界面
  console.log('处理用药咨询', notification)
  markAsRead(notification.id)
}

// 播放声音提示
const playSound = (priority) => {
  const audio = new Audio()
  audio.src = priority === 'high' 
    ? highPrioritySound
    : normalPrioritySound
  audio.play().catch(error => {
    console.error('播放通知声音失败:', error)
  })
}
// 监听新通知
onMounted(() => {
  // 实际项目中这里应该使用WebSocket或轮询获取新通知
  // 模拟代码已移除，由后端实时推送
})

</script>

<style scoped>
.real-time-notification {
  background-color: #0F1420;
  border: 1px solid #2D303D;
  border-radius: 4px;
  margin-bottom: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.real-time-notification.expanded {
  max-height: 300px;
}

.real-time-notification:not(.expanded) {
  max-height: 40px;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #1A1D29;
  cursor: pointer;
  border-bottom: 1px solid #2D303D;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle-icon {
  transition: transform 0.3s;
}

.toggle-icon.rotate {
  transform: rotate(180deg);
}

.header-title {
  font-weight: bold;
  color: #fff;
}

.unread-count {
  margin-left: 10px;
}

.notification-body {
  max-height: 250px;
  overflow-y: auto;
}

.notification-list {
  padding: 10px;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  margin-bottom: 8px;
  background-color: #1A1D29;
  border-radius: 4px;
  border-left: 4px solid #165DFF;
  transition: all 0.3s;
}

.notification-item.unread {
  background-color: rgba(22, 93, 255, 0.1);
  border-left-color: #165DFF;
}

.notification-item.high-priority {
  background-color: rgba(255, 107, 53, 0.1);
  border-left-color: #FF6B35;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: bold;
  margin-bottom: 6px;
  color: #fff;
}

.priority-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background-color: #FF6B35;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 8px;
}

.priority-tag .el-icon {
  margin-right: 4px;
}

.notification-message {
  font-size: 14px;
  color: #ccc;
  margin-bottom: 6px;
}

.notification-time {
  font-size: 12px;
  color: #999;
}

.notification-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.empty-notification {
  text-align: center;
  padding: 20px;
  color: #999;
}
</style>