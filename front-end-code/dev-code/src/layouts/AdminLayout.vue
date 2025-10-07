<!-- src/layouts/AdminLayout.vue -->
<template>
  <div class="admin-layout">
    <!-- 顶部导航栏 -->
    <el-header class="admin-header">
      <div class="header-left">
        <div class="brand">
          <!-- 使用本地医药图标 -->
          <img :src="medicineBoxIcon" alt="医药自助购" class="brand-icon" />
          <span class="brand-name">医药自助购</span>
          <el-tag 
            :type="businessStatus === '营业中' ? 'success' : 'info'" 
            class="status-tag"
          >
            {{ businessStatus }}
          </el-tag>
        </div>
      </div>
      
      <div class="header-right">
        <span class="admin-greeting">管理员，您好！</span>
        <el-dropdown @command="handleDropdownCommand">
          <span class="el-dropdown-link">
            <el-icon><User /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="businessSetting">营业状态设置</el-dropdown-item>
              <el-dropdown-item command="refreshStatus">
                <el-icon><Refresh /></el-icon>
                刷新营业状态
              </el-dropdown-item>
              <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 主体布局 -->
    <el-container class="admin-container">
      <!-- 左侧导航栏 -->
      <el-aside width="240px" class="admin-sidebar">
        <el-menu
          :default-active="activeMenu"
          class="admin-menu"
          router
          background-color="#0F1420"
          text-color="#fff"
          active-text-color="#165DFF"
        >
          <el-menu-item index="/admin/dashboard">
            <el-icon><DataBoard /></el-icon>
            <span>仪表板</span>
          </el-menu-item>
          <el-menu-item index="/admin/orders">
            <el-icon><ShoppingCart /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/drugs">
            <!-- 替换为本地医药图标 -->
            <div class="menu-icon-wrapper">
              <img :src="medicineBoxIcon" alt="药品管理" class="menu-icon" />
            </div>
            <span>药品管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/inventory">
            <el-icon><Box /></el-icon>
            <span>进货管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>

    <!-- 营业状态设置弹窗 -->
    <el-dialog
      v-model="businessDialogVisible"
      title="营业状态设置"
      width="400px"
    >
      <el-radio-group v-model="tempBusinessStatus">
        <el-radio label="营业中">营业中</el-radio>
        <el-radio label="暂停营业">暂停营业</el-radio>
      </el-radio-group>
      <template #footer>
        <el-button @click="businessDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBusinessStatus">确认</el-button>
      </template>
    </el-dialog>

    <!-- 修改密码弹窗 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      width="400px"
    >
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef">
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input type="password" v-model="passwordForm.currentPassword" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input type="password" v-model="passwordForm.confirmPassword" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmPasswordChange">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  DataBoard,
  ShoppingCart,
  Box,
  Refresh
} from '@element-plus/icons-vue'

// 图标导入 - 使用本地医药图标
const medicineBoxIcon = new URL('@/assets/medicine-box.png', import.meta.url).href

// Store和路由
const appStore = useAppStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

// 响应式数据
const businessDialogVisible = ref(false)
const passwordDialogVisible = ref(false)
const tempBusinessStatus = ref('营业中')
const passwordFormRef = ref(null)

// 表单数据
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 计算属性
const activeMenu = computed(() => route.path)
const businessStatus = computed(() => appStore.businessStatus)

// 密码验证规则
const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 方法定义
const handleDropdownCommand = (command) => {
  switch (command) {
    case 'businessSetting':
      businessDialogVisible.value = true
      tempBusinessStatus.value = businessStatus.value
      break
    case 'changePassword':
      passwordDialogVisible.value = true
      break
    case 'logout':
      handleLogout()
      break
    case 'refreshStatus':
      refreshBusinessStatus()
      break
  }
}

// 手动刷新营业状态
const refreshBusinessStatus = async () => {
  try {
    await appStore.initBusinessStatus()
    ElMessage.success('状态刷新成功')
  } catch (error) {
    ElMessage.error('刷新失败: ' + error.message)
  }
}

const confirmBusinessStatus = async () => {
  try {
    await appStore.updateBusinessStatus(tempBusinessStatus.value)
    businessDialogVisible.value = false
    ElMessage.success('营业状态更新成功')
  } catch (error) {
    ElMessage.error('营业状态更新失败')
  }
}

const confirmPasswordChange = async () => {
  try {
    await passwordFormRef.value.validate()
    // 调用修改密码API
    await authStore.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    passwordDialogVisible.value = false
    passwordFormRef.value.resetFields()
    ElMessage.success('密码修改成功')
  } catch (error) {
    ElMessage.error('密码修改失败')
  }
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await authStore.logout()
    router.push('/auth/admin-login')
    ElMessage.success('退出登录成功')
  } catch (error) {
    // 用户取消退出
  }
}

onMounted(async () => {
  try {
    // 初始化营业状态
    await appStore.initBusinessStatus()
  } catch (error) {
    console.error('初始化营业状态失败:', error)
    ElMessage.error('初始化营业状态失败')
  }
})
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  background-color: #1A1D29;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0F1420;
  border-bottom: 1px solid #2D303D;
  padding: 0 20px;
}

.header-left .brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 32px;
  height: 32px;
}

.brand-name {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.status-tag {
  margin-left: 8px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.admin-greeting {
  color: #fff;
  font-size: 14px;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.admin-container {
  height: calc(100vh - 60px);
}

.admin-sidebar {
  background-color: #0F1420;
  border-right: 1px solid #2D303D;
}

.admin-menu {
  border: none;
}

.admin-main {
  background-color: #1A1D29;
  padding: 20px;
  overflow-y: auto;
}

/* 菜单图标样式 */
.menu-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.menu-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>