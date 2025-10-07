<!-- src/views/user/DrugDetail.vue -->
<template>
  <div class="drug-detail-container">
    <!-- 返回按钮 -->
    <div class="header-section">
      <el-button icon="Back" @click="goBack">返回</el-button>
      <h1 class="page-title">药品详情</h1>
    </div>

    <!-- 药品信息卡片 -->
    <div class="drug-card" v-if="drug">
      <div class="drug-header">
        <el-image 
          :src="drug.image || noDrugsImg" 
          class="drug-image"
          fit="cover"
        />
        <div class="drug-basic-info">
          <h2 class="drug-name">{{ drug.generic_name }}</h2>
          
          <div class="drug-category">
            <el-tag 
              :type="drug.category === DrugCategory.RX ? 'danger' : 'success'"
              size="large"
            >
              {{ drugCategoryText }}
            </el-tag>
          </div>
          
          <div class="drug-specification">
            <span>规格：{{ drug.specification || '暂无' }}</span>
          </div>
          
          <div class="drug-manufacturer">
            <span>生产厂商：{{ drug.manufacturer || '暂无' }}</span>
          </div>
          
          <div class="drug-price">
            <span class="price-label">价格：</span>
            <span class="price-value">¥{{ drug.price?.toFixed(2) || '0.00' }}</span>
          </div>
          
          <div class="drug-stock">
            <span>库存：</span>
            <span :class="stockClass">{{ drug.stock_quantity }}件</span>
          </div>
          
          <div class="drug-actions">
            <el-button 
              v-if="drug.category === DrugCategory.OTC"
              type="primary" 
              size="large"
              :disabled="!appStore.isOpen || drug.stock_quantity <= 0"
              @click="addToCart"
            >
              加入购物车
            </el-button>
            
            <el-button 
              v-else
              type="primary"
              size="large"
              :disabled="!appStore.isOpen"
              @click="consultPharmacist"
            >
              咨询药师
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 药品详细信息 -->
      <div class="drug-details">
        <el-tabs v-model="activeTab" class="drug-tabs">
          <el-tab-pane label="药品信息" name="info">
            <div class="detail-section">
              <h3 class="section-title">成分</h3>
              <p class="section-content">{{ drug.composition || '暂无信息' }}</p>
            </div>
            
            <div class="detail-section">
              <h3 class="section-title">适应症</h3>
              <p class="section-content">{{ drug.indications || '暂无信息' }}</p>
            </div>
            
            <div class="detail-section">
              <h3 class="section-title">用法用量</h3>
              <p class="section-content">{{ drug.usage_dosage || '暂无信息' }}</p>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="注意事项" name="precautions">
            <div class="detail-section">
              <p class="section-content">{{ drug.precautions || '暂无注意事项' }}</p>
            </div>
            
            <div v-if="drug.category === DrugCategory.RX" class="prescription-warning">
              <el-alert 
                title="处方药警示" 
                type="error" 
                :closable="false"
                show-icon
              >
                <p>本药品为处方药，请凭医师处方购买和使用</p>
              </el-alert>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="其他信息" name="other">
            <div class="detail-section">
              <h3 class="section-title">有效期</h3>
              <p class="section-content">{{ drug.expiry_date || '暂无信息' }}</p>
            </div>
            
            <div class="detail-section">
              <h3 class="section-title">生产批号</h3>
              <p class="section-content">{{ drug.batch_number || '暂无信息' }}</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-else-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>
    
    <!-- 药品不存在 -->
    <div v-else class="not-found">
      <img :src="noDrugsImg" alt="药品不存在" class="not-found-image">
      <p class="not-found-text">抱歉，未找到该药品信息</p>
      <el-button type="primary" @click="goToHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getDrugDetail } from '@/api/drugs'
import { useAppStore } from '@/stores/app'
import { useCartStore } from '@/stores/cart'
import { useNotificationStore } from '@/stores/notification'
import { DrugCategory } from '@/types/drug'
import noDrugsImg from '@/assets/no-drugs.png'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()

// 药品数据
const drug = ref(null)
const loading = ref(true)
const activeTab = ref('info')

// 药品分类文本
const drugCategoryText = computed(() => {
  if (!drug.value) return ''
  
  switch (drug.value.category) {
    case DrugCategory.OTC:
      return '非处方药(OTC)'
    case DrugCategory.RX:
      return '处方药(Rx)'
    case DrugCategory.MEDICAL:
      return '医疗器械'
    case DrugCategory.HEALTH:
      return '保健养生'
    default:
      return '其他'
  }
})

// 库存样式
const stockClass = computed(() => {
  if (!drug.value) return ''
  
  if (drug.value.stock_quantity <= 0) {
    return 'stock-out'
  } else if (drug.value.stock_quantity <= 10) {
    return 'stock-low'
  }
  return 'stock-normal'
})

// 获取药品详情
const fetchDrugDetail = async () => {
  try {
    loading.value = true
    const id = parseInt(route.params.id)
    const response = await getDrugDetail(id)
    drug.value = response
  } catch (error) {
    ElMessage.error('获取药品详情失败: ' + error.message)
    drug.value = null
  } finally {
    loading.value = false
  }
}

// 加入购物车
const addToCart = async () => {
  if (!appStore.isOpen) {
    ElMessage.warning('暂停营业中，无法添加商品')
    return
  }
  
  if (drug.value.stock_quantity <= 0) {
    ElMessage.warning('该药品已售罄')
    return
  }
  
  try {
    await cartStore.addItem({
      drug_id: drug.value.id,
      quantity: 1
    })
    ElMessage.success({
      message: '已成功加入购物车',
      duration: 1500
    })
  } catch (error) {
    ElMessage.error('加入购物车失败: ' + error.message)
  }
}

// 咨询药师
const consultPharmacist = () => {
  if (!appStore.isOpen) {
    ElMessage.warning('暂停营业中，无法咨询')
    return
  }
  
  // 创建用药咨询通知
  notificationStore.addNotification({
    user_id: 1, // 实际项目中从authStore获取
    message_type: 1, // 用药咨询
    title: `药品咨询: ${drug.value.generic_name}`,
    content: `用户咨询关于${drug.value.generic_name}的使用信息`
  })
  
  ElMessage.success({
    message: '已为您发起用药咨询请求，药师将尽快与您联系',
    duration: 3000
  })
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 返回首页
const goToHome = () => {
  router.push({ name: 'UserHome' })
}

onMounted(() => {
  fetchDrugDetail()
})
</script>

<style scoped>
.drug-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  color: #165DFF;
}

.drug-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.drug-header {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.drug-image {
  width: 300px;
  height: 300px;
  border-radius: 8px;
  border: 1px solid #eee;
  background-color: #f5f7fa;
}

.drug-basic-info {
  flex: 1;
}

.drug-name {
  font-size: 24px;
  margin-bottom: 15px;
  color: #333;
}

.drug-category {
  margin-bottom: 15px;
}

.drug-specification,
.drug-manufacturer {
  font-size: 16px;
  color: #606266;
  margin-bottom: 10px;
}

.drug-price {
  margin: 20px 0;
  font-size: 18px;
}

.price-label {
  color: #606266;
}

.price-value {
  font-size: 24px;
  font-weight: bold;
  color: #e1251b;
  margin-left: 5px;
}

.drug-stock {
  font-size: 16px;
  margin-bottom: 20px;
}

.stock-normal {
  color: #67C23A;
  font-weight: bold;
}

.stock-low {
  color: #E6A23C;
  font-weight: bold;
}

.stock-out {
  color: #F56C6C;
  font-weight: bold;
}

.drug-actions {
  margin-top: 30px;
}

.drug-details {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.drug-tabs {
  margin-top: 15px;
}

.detail-section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.section-content {
  font-size: 16px;
  color: #606266;
  line-height: 1.6;
  white-space: pre-line;
}

.prescription-warning {
  margin-top: 30px;
}

.loading-container {
  padding: 50px;
  background-color: #fff;
  border-radius: 8px;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  background-color: #fff;
  border-radius: 8px;
}

.not-found-image {
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.not-found-text {
  font-size: 18px;
  color: #606266;
  margin-bottom: 30px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .drug-header {
    flex-direction: column;
  }
  
  .drug-image {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>