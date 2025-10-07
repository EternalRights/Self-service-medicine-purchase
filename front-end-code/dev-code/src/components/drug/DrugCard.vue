<template>
  <el-card 
    class="drug-card" 
    shadow="hover"
    @click="handleCardClick"
  >
    <div class="image-container">
      <el-image 
        :src="drug.image || noDrugsImg" 
        fit="cover"
        class="drug-image"
        @click.stop="goToDetail"
      >
        <template #error>
          <div class="image-error">
            <el-icon><Picture /></el-icon>
            <span>图片加载失败</span>
          </div>
        </template>
      </el-image>
      
      <el-tag 
        v-if="drug.category === 2" 
        type="danger" 
        class="prescription-tag"
      >
        处方药
      </el-tag>
      <el-tag 
        v-else-if="drug.category === 1" 
        type="success" 
        class="otc-tag"
      >
        非处方药
      </el-tag>
    </div>
    
    <div class="drug-info" @click.stop="goToDetail">
      <h3 class="drug-name">{{ drug.generic_name }}</h3>
      <p class="drug-spec">{{ drug.specification }}</p>
      
      <div class="price-section">
        <span class="price">¥{{ drug.price?.toFixed(2) || '0.00' }}</span>
        <span class="stock">剩余{{ drug.stock_quantity }}件</span>
      </div>
    </div>
    
    <div class="action-buttons">
      <el-button 
        v-if="drug.category === 1" 
        type="primary" 
        :disabled="!isOpen || drug.stock_quantity <= 0"
        @click.stop="addToCart"
      >
        加入购物车
      </el-button>
      
      <el-button 
        v-if="drug.category === 2" 
        type="info"
        :disabled="!isOpen || drug.stock_quantity <= 0"
        @click.stop="consultPharmacist"
      >
        咨询药师
      </el-button>
    </div>
    
    <!-- 查看详情按钮 -->
    <div class="detail-button">
      <el-button 
        type="text" 
        class="view-detail-btn"
        @click.stop="goToDetail"
      >
        查看详情 <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>
  </el-card>
</template>

<script setup>
import { Picture, ArrowRight } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import noDrugsImg from '@/assets/no-drugs.png'

const props = defineProps({
  drug: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const appStore = useAppStore()
const isOpen = computed(() => appStore.isOpen)

const emit = defineEmits(['add-to-cart', 'consult-pharmacist'])

// 跳转到药品详情页
const goToDetail = () => {
  router.push({
    name: 'DrugDetail',
    params: { id: props.drug.id }
  })
}

// 处理卡片点击事件
const handleCardClick = (event) => {
  // 排除按钮区域的点击
  if (!event.target.closest('.action-buttons') && 
      !event.target.closest('.view-detail-btn')) {
    goToDetail()
  }
}

const addToCart = (event) => {
  event.stopPropagation()
  emit('add-to-cart', props.drug)
}

const consultPharmacist = (event) => {
  event.stopPropagation()
  emit('consult-pharmacist', props.drug)
}
</script>

<style scoped>
.drug-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  cursor: pointer;
}

.drug-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.image-container {
  position: relative;
  height: 180px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 12px;
}

.drug-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s;
}

.drug-image:hover {
  transform: scale(1.05);
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  background-color: #f5f7fa;
}

.prescription-tag,
.otc-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  font-weight: bold;
  z-index: 1;
}

.drug-info {
  flex: 1;
  cursor: pointer;
  padding: 0 5px;
}

.drug-name {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  transition: color 0.2s;
}

.drug-name:hover {
  color: #165DFF;
}

.drug-spec {
  margin: 0 0 12px;
  font-size: 13px;
  color: #666;
  min-height: 36px;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: #e1251b;
}

.stock {
  font-size: 13px;
  color: #999;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.detail-button {
  text-align: center;
  margin-top: 10px;
}

.view-detail-btn {
  color: #165DFF;
  font-size: 13px;
  padding: 5px 0;
}

.view-detail-btn:hover {
  color: #0e42b2;
  text-decoration: underline;
}

.view-detail-btn .el-icon {
  margin-left: 3px;
  transition: transform 0.3s;
}

.view-detail-btn:hover .el-icon {
  transform: translateX(3px);
}
</style>