<template>
  <div class="home-container">
    <!-- 顶部导航栏
    <div class="header">
      <div class="logo-section">
        <img :src="medicineBoxImg" alt="医药自助购" class="logo">
        <span class="app-name">医药自助购</span>
        <el-tag 
          :style="appStore.businessStatusStyle"
          class="business-status"
        >
          {{ appStore.businessStatusText }}
        </el-tag>
      </div>
      
      <div class="nav-right">
        <div class="cart-icon" @click="goToCart">
          <el-badge :value="cartStore.totalItems" class="badge">
            <el-icon :size="24"><ShoppingCart /></el-icon>
          </el-badge>
          <el-tooltip content="查看购物车" placement="bottom">
            <span class="cart-text">购物车</span>
          </el-tooltip>
        </div>
        
        <el-dropdown>
          <span class="user-dropdown">
            <el-icon :size="20"><User /></el-icon>
            <span class="user-name">{{ authStore.userName }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goToProfile">个人中心</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div> -->
    
    <!-- 搜索区域已移除，根据需求清除快捷标签功能 -->
    
    <!-- 药品列表区域 -->
    <DrugList />
  </div>
</template>

<script setup>
// import { ref } from 'vue'
// import { useRouter } from 'vue-router'
// import { ShoppingCart, User, Search } from '@element-plus/icons-vue'
// import { useDrugStore } from '@/stores/drug'
// import { useAuthStore } from '@/stores/auth'
// import { useAppStore } from '@/stores/app'
// import { useCartStore } from '@/stores/cart'
import DrugList from '@/components/drug/DrugList.vue'
// import medicineBoxImg from '@/assets/medicine-box.png'

// const router = useRouter()
// const drugStore = useDrugStore()
// const authStore = useAuthStore()
// const appStore = useAppStore()
// const cartStore = useCartStore()

// const searchKeyword = ref('')
// const quickTags = ref([
//   { id: 1, name: '感冒发烧', keyword: '感冒' },
//   { id: 2, name: '肠胃不适', keyword: '肠胃' },
//   { id: 3, name: '皮肤外用', keyword: '皮肤' },
//   { id: 4, name: '维生素/保健品', keyword: '维生素' }
// ])

// // 处理搜索
// const handleSearch = () => {
//   drugStore.searchDrugs(searchKeyword.value)
// }

// // 处理标签点击
// const handleTagClick = (tag) => {
//   searchKeyword.value = tag.keyword
//   drugStore.searchDrugs(tag.keyword)
// }

// // 前往购物车
// const goToCart = () => {
//   router.push('/user/cart')
// }

// // 前往个人中心
// const goToProfile = () => {
//   router.push('/user/profile')
// }

// // 退出登录
// const logout = () => {
//   authStore.logout()
//   router.push('/auth/login')
// }
</script>

<style scoped>
/* .home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
} */
.home-content {
  padding: 0;
}
/* 
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 40px;
  height: 40px;
}

.app-name {
  font-size: 24px;
  font-weight: bold;
  color: #165DFF;
}

.business-status {
  font-weight: bold;
  margin-left: 15px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 25px;
}

.cart-icon {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: color 0.3s;
}

.cart-icon:hover {
  color: #165DFF;
}

.cart-text {
  font-size: 16px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.user-name {
  font-size: 16px;
}

.search-section {
  margin-bottom: 30px;
}

.search-input {
  width: 100%;
  margin-bottom: 15px;
}

.quick-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag-item {
  cursor: pointer;
  transition: all 0.3s;
}

.tag-item:hover {
  background-color: #165DFF;
  color: white;
} */
</style>