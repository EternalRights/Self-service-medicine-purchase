<!-- src/views/admin/Inventory.vue -->
<template>
  <div class="inventory-management">
    <!-- 筛选工具栏 -->
    <el-card class="toolbar-card" shadow="never">
      <div class="toolbar">
        <div class="filter-section">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索药品名称"
            clearable
            class="search-input"
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
          
          <el-select
            v-model="filterCategory"
            placeholder="全部分类"
            clearable
            @change="handleSearch"
          >
            <el-option
              v-for="category in drugCategories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
          
          <el-select
            v-model="filterStockStatus"
            placeholder="库存状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="正常" :value="false" />
            <el-option label="低库存" :value="true" />
          </el-select>
        </div>
      </div>
    </el-card>
    
    <!-- 药品库存列表 -->
    <el-card class="inventory-list-card" shadow="never">
      <el-table
        :data="inventoryList"
        v-loading="loading"
        style="width: 100%"
        :header-cell-style="{ background: '#0F1420', color: '#fff' }"
        row-class-name="inventory-table-row"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="药品信息" min-width="300">
          <template #default="{ row }">
            <div class="drug-info">
              <el-image
                :src="row.image || require('@/assets/no-drugs.png')"
                fit="cover"
                class="drug-image"
              />
              <div class="drug-details">
                <div class="drug-name">{{ row.generic_name }}</div>
                <div class="drug-spec">{{ row.specification }}</div>
                <div class="drug-manufacturer">{{ row.manufacturer }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分类" width="120">
          <template #default="{ row }">
            <el-tag :type="getCategoryTagType(row.category)">
              {{ getCategoryLabel(row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="当前库存" width="120">
          <template #default="{ row }">
            <span :class="{'low-stock': row.stock_quantity < 10}">
              {{ row.stock_quantity }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="openAddInventoryDialog(row)"
            >
              入库
            </el-button>
            <el-button
              type="info"
              size="small"
              @click="viewInventoryRecords(row)"
            >
              记录
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
    
    <!-- 入库弹窗 -->
    <el-dialog
      v-model="addInventoryDialogVisible"
      :title="`药品入库 - ${currentDrug?.generic_name}`"
      width="600px"
    >
      <el-form
        ref="inventoryFormRef"
        :model="inventoryForm"
        :rules="inventoryFormRules"
        label-width="100px"
      >
        <el-form-item label="药品名称">
          <el-input :value="currentDrug?.generic_name" disabled />
        </el-form-item>
        <el-form-item label="规格">
          <el-input :value="currentDrug?.specification" disabled />
        </el-form-item>
        <el-form-item label="当前库存">
          <el-input :value="currentDrug?.stock_quantity" disabled />
        </el-form-item>
        <el-form-item label="入库数量" prop="quantity">
          <el-input-number 
            v-model="inventoryForm.quantity" 
            :min="1" 
            :max="10000" 
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="生产批号" prop="batch_number">
          <el-input v-model="inventoryForm.batch_number" />
        </el-form-item>
        <el-form-item label="生产日期" prop="production_date">
          <el-date-picker
            v-model="inventoryForm.production_date"
            type="date"
            placeholder="选择生产日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="有效期至" prop="expiry_date">
          <el-date-picker
            v-model="inventoryForm.expiry_date"
            type="date"
            placeholder="选择有效期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addInventoryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitInventory">提交</el-button>
      </template>
    </el-dialog>
    
    <!-- 库存记录弹窗 -->
    <el-dialog
      v-model="inventoryRecordsDialogVisible"
      :title="`库存记录 - ${currentDrug?.generic_name}`"
      width="800px"
    >
      <el-table :data="inventoryRecords" height="400">
        <el-table-column prop="batch_number" label="批号" width="120" />
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="production_date" label="生产日期" width="120" />
        <el-table-column prop="expiry_date" label="有效期" width="120" />
        <el-table-column prop="create_time" label="入库时间" width="180" />
        <el-table-column prop="create_user_name" label="操作人" />
      </el-table>
      <template #footer>
        <el-button @click="inventoryRecordsDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { 
  getDrugList,
  addDrugInventory,
  getDrugInventoryRecords
} from '@/api/drugs'
import { DrugCategory } from '@/types/drug'

// 药品分类选项
const drugCategories = [
  { value: DrugCategory.OTC, label: '非处方药(OTC)' },
  { value: DrugCategory.RX, label: '处方药(Rx)' },
  { value: DrugCategory.MEDICAL, label: '医疗器械' },
  { value: DrugCategory.HEALTH, label: '保健养生' }
]

// 库存列表数据
const inventoryList = ref([])
const loading = ref(false)

// 分页参数
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 搜索和筛选参数
const searchKeyword = ref('')
const filterCategory = ref(null)
const filterStockStatus = ref(null) // true: 低库存, false: 正常

// 入库相关
const addInventoryDialogVisible = ref(false)
const currentDrug = ref(null)
const inventoryForm = ref({
  quantity: 1,
  batch_number: '',
  production_date: '',
  expiry_date: ''
})
const inventoryFormRef = ref(null)

// 表单验证规则
const inventoryFormRules = {
  quantity: [
    { required: true, message: '请输入入库数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' }
  ],
  batch_number: [
    { required: true, message: '请输入生产批号', trigger: 'blur' }
  ],
  production_date: [
    { required: true, message: '请选择生产日期', trigger: 'change' }
  ],
  expiry_date: [
    { required: true, message: '请选择有效期', trigger: 'change' }
  ]
}

// 库存记录相关
const inventoryRecordsDialogVisible = ref(false)
const inventoryRecords = ref([])

// 获取库存列表
const fetchInventoryList = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchKeyword.value,
      category: filterCategory.value
    }
    
    // 仅当低库存筛选有效时才添加该参数
    if (filterStockStatus.value !== null && filterStockStatus.value !== undefined) {
      params.low_stock = filterStockStatus.value
    }
    
    // 由于request.js已统一处理Result包装，可直接获取解包后的业务数据
    try {
      const pageResult = await getDrugList(params)
      inventoryList.value = pageResult.items || []
      pagination.total = pageResult.total || 0
    } catch (error) {
      ElMessage.error('获取库存列表失败: ' + error.message)
      inventoryList.value = []
      pagination.total = 0
    }
  } catch (error) {
    ElMessage.error('获取库存列表失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.page = 1
  fetchInventoryList()
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  fetchInventoryList()
}

// 处理页码变化
const handlePageChange = (page) => {
  pagination.page = page
  fetchInventoryList()
}

// 打开入库弹窗
const openAddInventoryDialog = (drug) => {
  currentDrug.value = drug
  inventoryForm.value = {
    quantity: 1,
    batch_number: '',
    production_date: '',
    expiry_date: ''
  }
  addInventoryDialogVisible.value = true
}

// 提交入库
const submitInventory = async () => {
  try {
    // 验证表单
    await inventoryFormRef.value.validate()
    
    // 调用入库API
    await addDrugInventory(currentDrug.value.id, inventoryForm.value)
    
    ElMessage.success('入库成功')
    addInventoryDialogVisible.value = false
    
    // 刷新库存列表
    fetchInventoryList()
  } catch (error) {
    if (error.name !== 'ValidationError') {
      ElMessage.error('入库失败: ' + error.message)
    }
  }
}

// 查看库存记录
const viewInventoryRecords = async (drug) => {
  currentDrug.value = drug
  try {
    // 由于request.js已统一处理Result包装，可直接获取解包后的业务数据
    try {
      const record = await getDrugInventoryRecords(drug.id)
      inventoryRecords.value = [record] // 后端返回单个对象，但表格需要数组
      inventoryRecordsDialogVisible.value = true
    } catch (error) {
      ElMessage.error('获取库存记录失败: ' + error.message)
    }
  } catch (error) {
    ElMessage.error('获取库存记录失败: ' + error.message)
  }
}

// 获取分类标签类型
const getCategoryTagType = (category) => {
  switch (category) {
    case DrugCategory.OTC: return 'success'
    case DrugCategory.RX: return 'warning'
    case DrugCategory.MEDICAL: return 'info'
    case DrugCategory.HEALTH: return 'info'
    default: return 'info'
  }
}

// 获取分类标签文本
const getCategoryLabel = (category) => {
  const categoryObj = drugCategories.find(c => c.value === category)
  return categoryObj ? categoryObj.label : '未知'
}

// 初始化加载数据
onMounted(() => {
  fetchInventoryList()
})
</script>

<style scoped>
.inventory-management {
  padding: 20px;
}

.toolbar-card {
  margin-bottom: 20px;
  background-color: #0F1420;
  border: 1px solid #2D303D;
}

.toolbar {
  display: flex;
}

.filter-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  width: 300px;
}

.inventory-list-card {
  background-color: #0F1420;
  border: 1px solid #2D303D;
}

.drug-info {
  display: flex;
  align-items: center;
}

.drug-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  margin-right: 12px;
}

.drug-details {
  display: flex;
  flex-direction: column;
}

.drug-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.drug-spec, .drug-manufacturer {
  font-size: 12px;
  color: #999;
}

.low-stock {
  color: #F56C6C;
  font-weight: bold;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.inventory-table-row:hover {
  background-color: rgba(22, 93, 255, 0.1) !important;
}
</style>