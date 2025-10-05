<template>
  <div class="admin-layout">
    <!-- 顶部导航栏 -->
    <header class="admin-header">
      <div class="brand">
        <div class="logo">
          <i class="el-icon-first-aid-kit"></i>
          <span>医药自助购 - 管理平台</span>
        </div>
        <div class="business-status" :style="appStore.businessStatusStyle">
          {{ appStore.businessStatusText }}
        </div>
      </div>
      
      <div class="admin-info">
        <el-dropdown trigger="click" @command="handleAdminCommand">
          <span class="admin-name">
            <el-avatar icon="el-icon-user-solid" size="small" />
            <span>{{ adminName }}, 您好！</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="business">营业状态设置</el-dropdown-item>
              <el-dropdown-item command="password">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    
    <div class="admin-container">
      <!-- 左侧菜单 -->
      <aside class="admin-sidebar">
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#2c3e50"
          text-color="#bdc3c7"
          active-text-color="#3498db"
        >
          <el-menu-item index="/admin/dashboard">
            <i class="el-icon-data-line"></i>
            <span>仪表板</span>
          </el-menu-item>
          <el-menu-item index="/admin/orders">
            <i class="el-icon-tickets"></i>
            <span>订单管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/drugs">
            <i class="el-icon-medal"></i>
            <span>药品管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/users">
            <i class="el-icon-user"></i>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/inventory">
            <i class="el-icon-box"></i>
            <span>进货管理</span>
          </el-menu-item>
        </el-menu>
      </aside>
      
      <!-- 主内容区 -->
      <main class="admin-main">
        <router-view />
      </main>
    </div>
    
    <!-- 营业状态设置弹窗 -->
    <el-dialog
      title="营业状态设置"
      v-model="businessDialogVisible"
      width="400px"
    >
      <el-radio-group v-model="businessStatus">
        <el-radio :label="BusinessStatus.OPEN">营业</el-radio>
        <el-radio :label="BusinessStatus.CLOSED">暂停营业</el-radio>
      </el-radio-group>
      <template #footer>
        <el-button @click="businessDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateBusinessStatus">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { BusinessStatus } from '@/types/app'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    const appStore = useAppStore()
    
    const businessDialogVisible = ref(false)
    const businessStatus = ref(appStore.businessStatus)
    
    const adminName = computed(() => authStore.userName || '管理员')
    const activeMenu = computed(() => route.path)
    
    const handleAdminCommand = (command) => {
      switch (command) {
        case 'business':
          businessDialogVisible.value = true
          break
        case 'password':
          // 打开修改密码弹窗
          break
        case 'logout':
          authStore.logout()
          break
      }
    }
    
    const updateBusinessStatus = async () => {
      const success = await appStore.updateBusinessStatus(businessStatus.value)
      if (success) {
        businessDialogVisible.value = false
      }
    }
    
    return {
      BusinessStatus,
      adminName,
      activeMenu,
      businessDialogVisible,
      businessStatus,
      appStore,
      handleAdminCommand,
      updateBusinessStatus
    }
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: #2c3e50;
  color: #ecf0f1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.brand {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.logo i {
  font-size: 24px;
  margin-right: 10px;
  color: #3498db;
}

.business-status {
  margin-left: 15px;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.admin-name {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.admin-name span {
  margin-left: 8px;
}

.admin-container {
  display: flex;
  flex: 1;
}

.admin-sidebar {
  width: 200px;
  background-color: #2c3e50;
}

.admin-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.el-menu {
  border-right: none;
}
</style>