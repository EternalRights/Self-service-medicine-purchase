<template>
  <div class="drug-list-container">
    <div class="filter-section">
      <div class="filter-item">
        <span class="filter-label">排序方式：</span>
        <el-select 
          v-model="sortOption" 
          placeholder="默认排序"
          @change="handleSortChange"
        >
          <el-option label="默认排序" value="default" />
          <el-option label="价格从低到高" value="price_asc" />
          <el-option label="价格从高到低" value="price_desc" />
        </el-select>
      </div>
      
      <div class="filter-item">
        <span class="filter-label">药品分类：</span>
        <el-select 
          v-model="categoryFilter" 
          placeholder="全部药品"
          @change="handleCategoryChange"
        >
          <el-option label="全部药品" value="all" />
          <el-option label="非处方药(OTC)" :value="1" />
          <el-option label="处方药(Rx)" :value="2" />
          <el-option label="医疗器械" :value="3" />
          <el-option label="保健养生" :value="4" />
        </el-select>
      </div>
    </div>
    
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading" :size="50"><Loading /></el-icon>
      <p>加载中...</p>
    </div>
    
    <div v-else-if="filteredDrugs.length === 0" class="empty-container">
      <img :src="noDrugsImg" alt="无药品" class="empty-image">
      <p class="empty-text">没有找到符合条件的药品</p>
    </div>
    
    <div v-else class="drug-grid">
      <DrugCard 
        v-for="drug in filteredDrugs" 
        :key="drug.id" 
        :drug="drug"
        @add-to-cart="handleAddToCart"
        @consult-pharmacist="handleConsultPharmacist"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import DrugCard from './DrugCard.vue'
import { useDrugStore } from '@/stores/drug'
import noDrugsImg from '@/assets/no-drugs.png';

const drugStore = useDrugStore()
const sortOption = ref('default')
const categoryFilter = ref('all')
const loading = ref(true)

// 获取药品数据
drugStore.fetchDrugs().finally(() => {
  loading.value = false
})

// 处理排序变化
const handleSortChange = () => {
  drugStore.setSortOption(sortOption.value)
}

// 处理分类变化
const handleCategoryChange = () => {
  drugStore.setCategoryFilter(categoryFilter.value)
}

// 处理添加到购物车
const handleAddToCart = (drug) => {
  drugStore.addToCart(drug)
}

// 处理咨询药师
const handleConsultPharmacist = (drug) => {
  drugStore.consultPharmacist(drug)
}

// 计算过滤后的药品列表
const filteredDrugs = computed(() => {
  return drugStore.filteredDrugs
})
</script>

<style scoped>
.drug-list-container {
  padding: 20px;
}

.filter-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
}

.filter-item {
  display: flex;
  align-items: center;
}

.filter-label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.empty-image {
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-text {
  font-size: 16px;
  color: #909399;
}

.drug-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
</style>