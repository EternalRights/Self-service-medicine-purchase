<template>
  <div class="user-layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="brand">
        <div class="logo">
          <i class="el-icon-first-aid-kit"></i>
          <span>医药自助购</span>
        </div>
        <div class="business-status" :style="appStore.businessStatusStyle">
          {{ appStore.businessStatusText }}
        </div>
      </div>
      
      <div class="search-bar">
        <el-input
          placeholder="请输入药品名称或症状"
          v-model="searchKeyword"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="handleSearch" />
          </template>
        </el-input>
      </div>
      
      <div class="user-actions">
        <el-badge :value="cartCount" class="cart-icon">
          <el-button icon="el-icon-shopping-cart-full" circle @click="goToCart" />
        </el-badge>
        <el-dropdown trigger="click" @command="handleUserCommand">
          <span class="user-info">
            <el-avatar icon="el-icon-user-solid" size="small" />
            <span class="username">{{ userName }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="orders">我的订单</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    
    <!-- 药品分类快捷标签 -->
    <div class="drug-categories">
      <el-tag 
        v-for="category in categories" 
        :key="category.id"
        @click="selectCategory(category.id)"
        :type="selectedCategory === category.id ? 'primary' : 'info'"
      >
        {{ category.name }}
      </el-tag>
    </div>
    
    <!-- 主内容区 -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- 页脚 -->
    <footer class="footer">
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

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useCartStore } from '@/stores/cart'

export default {
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const appStore = useAppStore()
    const cartStore = useCartStore()
    
    const searchKeyword = ref('')
    const selectedCategory = ref(null)
    
    const categories = ref([
      { id: 1, name: '感冒发烧' },
      { id: 2, name: '肠胃不适' },
      { id: 3, name: '皮肤外用' },
      { id: 4, name: '维生素/保健品' }
    ])
    
    const userName = computed(() => authStore.userName || '用户')
    const cartCount = computed(() => cartStore.cartItems.length)
    
    const handleSearch = () => {
      if (searchKeyword.value.trim()) {
        router.push({ name: 'UserHome', query: { search: searchKeyword.value } })
      }
    }
    
    const selectCategory = (categoryId) => {
      selectedCategory.value = categoryId
      // 实际项目中这里会调用API获取该分类下的药品
    }
    
    const goToCart = () => {
      router.push({ name: 'Cart' })
    }
    
    const handleUserCommand = (command) => {
      switch (command) {
        case 'profile':
          router.push({ name: 'Profile' })
          break
        case 'orders':
          // 跳转到订单页面
          break
        case 'logout':
          authStore.logout()
          break
      }
    }
    
    return {
      searchKeyword,
      selectedCategory,
      categories,
      userName,
      cartCount,
      appStore,
      handleSearch,
      selectCategory,
      goToCart,
      handleUserCommand
    }
  }
}
</script>

<style scoped>
.user-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.brand {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #165DFF;
}

.logo i {
  font-size: 24px;
  margin-right: 8px;
}

.business-status {
  margin-left: 15px;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.search-bar {
  width: 500px;
}

.user-actions {
  display: flex;
  align-items: center;
}

.cart-icon {
  margin-right: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  font-size: 14px;
}

.drug-categories {
  padding: 15px 30px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.drug-categories .el-tag {
  margin-right: 10px;
  cursor: pointer;
}

.main-content {
  flex: 1;
  padding: 20px 30px;
}

.footer {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 30px 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-links {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.footer-links a {
  color: #ecf0f1;
  margin: 0 15px;
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}

.footer-info {
  text-align: center;
  font-size: 12px;
  color: #bdc3c7;
}
</style>