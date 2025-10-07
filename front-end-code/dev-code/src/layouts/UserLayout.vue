<template>
  <div class="user-layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="brand">
        <div class="logo">
          <img :src="medicineBoxImg" alt="医药自助购" class="logo-img">
          <span class="app-name">医药自助购</span>
        </div>
        <el-tag 
          :style="appStore.businessStatusStyle"
          class="business-status"
        >
          {{ appStore.businessStatusText }}
        </el-tag>
      </div>
      
      <div class="search-bar">
        <el-input
          placeholder="请输入药品名称或症状"
          v-model="searchKeyword"
          @keyup.enter="handleSearch"
          clearable
        >
          <template #append>
            <el-button @click="handleSearch" >
              <el-icon><SearchIcon /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
      
      <div class="user-actions">
        <el-badge :value="cartCount" :max="99" class="cart-icon" :hidden="cartCount === 0">
          <el-button 
            icon="ShoppingCart" 
            circle 
            @click="goToCart"
            :disabled="!appStore.isOpen"
            :title="appStore.isOpen ? '查看购物车' : '暂停营业中'"
          />
            <img :src="cartIcon" alt="购物车" class = "cart-icon-img">
            <span>购物车</span>
        </el-badge>
        <el-dropdown trigger="click" @command="handleUserCommand">
          <span class="user-info">
            <el-avatar :icon="UserIcon" size="small" />
            <span class="username">{{ userName }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" icon="User">个人中心</el-dropdown-item>
              <el-dropdown-item command="orders" icon="Document">我的订单</el-dropdown-item>
              <el-dropdown-item divided command="logout" icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    
    <!-- 已移除药品分类快捷标签功能 -->
    
    <!-- 主内容区 -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- 页脚 -->
    <footer class="footer" v-if="showFooter">
      <div class="footer-content">
        <div class="footer-links">
          <a href="#">关于我们</a>
          <a href="#">隐私政策</a>
          <a href="#">用户协议</a>
          <a href="#">帮助中心</a>
        </div>
        <div class="footer-info">
          <p>《药品网络销售许可证》编号：XXXXXX</p>
          <p>互联网药品信息服务资格证书：XXXXXX</p>
          <p>© 2025 医药自助购 版权所有</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ShoppingCart, 
  User, 
  Document, 
  SwitchButton,
  Search 
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useCartStore } from '@/stores/cart'
import { useDrugStore } from '@/stores/drug'
import medicineBoxImg from '@/assets/medicine-box.png'
import cartIcon from '@/assets/shopping-cart.png'; 
import { User as UserIcon } from '@element-plus/icons-vue'; // 导入用户图标
import { Search as SearchIcon } from '@element-plus/icons-vue'; 

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const appStore = useAppStore()
const cartStore = useCartStore()
const drugStore = useDrugStore()

const searchKeyword = ref('')
// 已移除选中分类状态

// 分类数据
// 已移除快捷标签分类数据

// 计算属性
const userName = computed(() => authStore.userName || '用户')
const cartCount = computed(() => cartStore.totalItems || 0)

// 根据当前路由决定是否显示分类和页脚
// 已移除显示分类区域的计算属性

const showFooter = computed(() => {
  return route.name === 'UserHome' || route.name === 'Profile'
})

// 处理方法
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    drugStore.searchDrugs(searchKeyword.value)
  }
}

// 已移除分类选择功能

const goToCart = () => {
  if (appStore.isOpen) {
    router.push({ name: 'Cart' })
  }
}

const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push({ name: 'Profile' })
      break
    case 'orders':
      // 预留订单页面路由
      console.log('跳转到我的订单')
      break
    case 'logout':
      authStore.logout()
      break
  }
}

// 监听路由变化，重置搜索和分类
watch(() => route.name, (newRouteName) => {
  if (newRouteName !== 'UserHome') {
    searchKeyword.value = ''
    selectedCategory.value = null
  }
})

// 初始化
onMounted(async () => {
  try {
    // 安全地加载购物车数据
    if (cartStore && typeof cartStore.loadCart === 'function') {
      await cartStore.loadCart()
    }
  } catch (error) {
    console.error('加载购物车数据失败:', error)
  }
})
</script>

<style scoped>
.user-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.cart-icon-img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 30px;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.brand {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-img {
  width: 32px;
  height: 32px;
}

.app-name {
  font-size: 20px;
  font-weight: bold;
  color: #165DFF;
}

.business-status {
  font-weight: bold;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
}

.search-bar {
  width: 400px;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.cart-icon {
  margin-right: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  font-size: 14px;
  font-weight: 500;
}

.drug-categories {
  padding: 16px 30px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 24px 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-links {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  gap: 30px;
}

.footer-links a {
  color: #ecf0f1;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #3498db;
  text-decoration: underline;
}

.footer-info {
  text-align: center;
  font-size: 12px;
  color: #bdc3c7;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    padding: 12px 15px;
    flex-wrap: wrap;
  }
  
  .search-bar {
    width: 100%;
    order: 3;
    margin-top: 12px;
  }
  
  .drug-categories {
    padding: 12px 15px;
  }
  
  .main-content {
    padding: 15px;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 10px;
  }
}
</style>