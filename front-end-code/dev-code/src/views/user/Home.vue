<template>
  <div class="home-page">
    <!-- 排序和筛选区域 -->
    <div class="filter-bar">
      <div class="filter-item">
        <span>排序方式：</span>
        <el-select v-model="sortOption" placeholder="默认排序">
          <el-option label="默认排序" value="default" />
          <el-option label="价格从低到高" value="price_asc" />
          <el-option label="价格从高到低" value="price_desc" />
        </el-select>
      </div>
      
      <div class="filter-item">
        <span>药品分类：</span>
        <el-select v-model="categoryOption" placeholder="全部药品">
          <el-option label="全部药品" value="all" />
          <el-option label="非处方药(OTC)" value="otc" />
          <el-option label="处方药(Rx)" value="rx" />
          <el-option label="医疗器械" value="medical" />
          <el-option label="保健养生" value="health" />
        </el-select>
      </div>
    </div>
    
    <!-- 药品列表 -->
    <div class="drug-list">
      <DrugCard 
        v-for="drug in drugs" 
        :key="drug.id" 
        :drug="drug" 
        :business-status="appStore.businessStatus"
      />
    </div>
    
    <!-- 分页组件 -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import DrugCard from '@/components/drug/DrugCard.vue'
import { useAppStore } from '@/stores/app'

export default {
  components: {
    DrugCard
  },
  setup() {
    const appStore = useAppStore()
    
    // 模拟药品数据
    const drugs = ref([
      {
        id: 1,
        name: '阿莫西林胶囊',
        category: '处方药',
        specification: '0.25g*24粒',
        price: 25.8,
        stock: 10,
        image: '',
        isPrescription: true
      },
      {
        id: 2,
        name: '板蓝根颗粒',
        category: '非处方药',
        specification: '10g*20袋',
        price: 18.5,
        stock: 25,
        image: '',
        isPrescription: false
      },
      // 更多药品数据...
    ])
    
    const sortOption = ref('default')
    const categoryOption = ref('all')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(100)
    
    const handlePageChange = (page) => {
      currentPage.value = page
      // 实际项目中这里会调用API获取新页面的数据
    }
    
    return {
      drugs,
      sortOption,
      categoryOption,
      currentPage,
      pageSize,
      total,
      appStore,
      handlePageChange
    }
  }
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.filter-bar {
  display: flex;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.filter-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.filter-item span {
  margin-right: 10px;
  font-size: 14px;
  color: #606266;
}

.drug-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>