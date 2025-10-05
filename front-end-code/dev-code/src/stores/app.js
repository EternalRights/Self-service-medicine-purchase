// src/stores/app.js
import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { get } from '@/utils/request';
import { BusinessStatus } from '@/types/app';

/**
 * 应用全局状态管理
 * 管理营业状态、全局配置等共享状态
 */
export const useAppStore = defineStore('app', () => {
  // 状态定义
  const businessStatus = ref(BusinessStatus.OPEN); // 默认营业中
  const isLoading = ref(false);
  const globalNotifications = ref([]);
  const currentTime = ref(new Date());
  
  // 计算属性
  const isOpen = computed(() => businessStatus.value === BusinessStatus.OPEN);
  const isClosed = computed(() => businessStatus.value === BusinessStatus.CLOSED);
  
  // 营业状态样式
  const businessStatusStyle = computed(() => {
    return isOpen.value 
      ? { color: '#67C23A', backgroundColor: '#f0f9eb' } // 营业中 - 绿色
      : { color: '#909399', backgroundColor: '#f4f4f5' }; // 暂停营业 - 灰色
  });
  
  // 营业状态文本
  const businessStatusText = computed(() => {
    return isOpen.value ? '营业中' : '暂停营业';
  });
  
  // 初始化应用状态
  const initAppState = async () => {
    try {
      isLoading.value = true;
      
      // 从后端获取营业状态
      const response = await get('/app/business-status');
      businessStatus.value = response.data.status;
      
      // 启动时间更新器
      startTimeUpdater();
      
      ElMessage.success('应用状态初始化成功');
    } catch (error) {
      ElMessage.error('获取应用状态失败: ' + error.message);
    } finally {
      isLoading.value = false;
    }
  };
  
  // 更新营业状态 (管理员专用)
  const updateBusinessStatus = async (newStatus) => {
    try {
      isLoading.value = true;
      
      // 模拟API调用
      // 实际项目中: await post('/admin/business-status', { status: newStatus });
      businessStatus.value = newStatus;
      
      // 持久化到本地存储
      localStorage.setItem('business_status', newStatus);
      
      ElMessage.success(`营业状态已更新为: ${newStatus === BusinessStatus.OPEN ? '营业中' : '暂停营业'}`);
      return true;
    } catch (error) {
      ElMessage.error('更新营业状态失败: ' + error.message);
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  // 添加全局通知
  const addGlobalNotification = (notification) => {
    globalNotifications.value.push({
      ...notification,
      id: Date.now(),
      timestamp: new Date()
    });
    
    // 限制通知数量
    if (globalNotifications.value.length > 50) {
      globalNotifications.value.shift();
    }
  };
  
  // 清除通知
  const clearNotifications = () => {
    globalNotifications.value = [];
  };
  
  // 时间更新器
  const startTimeUpdater = () => {
    setInterval(() => {
      currentTime.value = new Date();
    }, 60000); // 每分钟更新一次
  };
  
  // 格式化时间
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // 格式化日期
  const formatDate = (date) => {
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };
  
  // 组件挂载时初始化
  onMounted(() => {
    // 从本地存储恢复状态
    const savedStatus = localStorage.getItem('business_status');
    if (savedStatus) {
      businessStatus.value = savedStatus;
    }
    
    initAppState();
  });
  
  return {
    // 状态
    businessStatus,
    isLoading,
    globalNotifications,
    currentTime,
    
    // 计算属性
    isOpen,
    isClosed,
    businessStatusStyle,
    businessStatusText,
    
    // 方法
    initAppState,
    updateBusinessStatus,
    addGlobalNotification,
    clearNotifications,
    formatTime,
    formatDate
  };
});