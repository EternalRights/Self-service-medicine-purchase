<!-- src/views/admin/DrugManagement.vue -->
<template>
  <div class="drug-management">
    <!-- 操作工具栏 -->
    <el-card class="toolbar-card" shadow="never">
      <div class="toolbar">
        <el-button type="primary" @click="openCreateDialog">
        <img :src="medicineBoxIcon" alt="新增药品" class="button-icon" />
          新增药品
        </el-button>
        
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
            v-model="filterShelfStatus"
            placeholder="全部状态"
            clearable
            @change="handleSearch"
          >
            <el-option
              v-for="status in shelfStatusOptions"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </div>
      </div>
    </el-card>
    
    <!-- 药品列表 -->
    <el-card class="drug-list-card" shadow="never">
      <el-table
        :data="drugList"
        v-loading="loading"
        style="width: 100%"
        :header-cell-style="{ background: '#0F1420', color: '#fff' }"
        row-class-name="drug-table-row"
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
                <!-- 处方药红色警示 -->
                <div v-if="row.category === DrugCategory.RX" 
                     class="rx-warning">
                  凭医师处方购买和使用
                </div>
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
        <el-table-column label="库存" width="100">
          <template #default="{ row }">
            <span :class="{'low-stock': row.stock_quantity < 10}">
              {{ row.stock_quantity }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.shelf_status"
              :active-value="ShelfStatus.ON_SHELF"
              :inactive-value="ShelfStatus.OFF_SHELF"
              :loading="row.updatingStatus"
              @change="updateShelfStatus(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="有效期" width="120">
          <template #default="{ row }">
            {{ row.expiry_date || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="openEditDialog(row)"
            >
              编辑
            </el-button>
            <el-button
              type="info"
              size="small"
              @click="viewDrugDetails(row)"
            >
              详情
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
    
    <!-- 药品详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="currentDrug?.generic_name"
      width="800px"
    >
      <div v-if="currentDrug" class="drug-detail">
        <div class="detail-header">
          <el-image
            :src="currentDrug.image || require('@/assets/no-drugs.png')"
            fit="cover"
            class="detail-image"
          />
          <div class="detail-info">
            <div class="detail-name">{{ currentDrug.generic_name }}</div>
            <div class="detail-spec">{{ currentDrug.specification }}</div>
            <div class="detail-manufacturer">{{ currentDrug.manufacturer }}</div>
            <div class="detail-status">
              <el-tag :type="getCategoryTagType(currentDrug.category)">
                {{ getCategoryLabel(currentDrug.category) }}
              </el-tag>
              <el-tag :type="currentDrug.shelf_status === ShelfStatus.ON_SHELF ? 'success' : 'info'">
                {{ currentDrug.shelf_status === ShelfStatus.ON_SHELF ? '上架中' : '已下架' }}
              </el-tag>
              <el-tag :type="currentDrug.stock_quantity < 10 ? 'danger' : 'success'">
                库存: {{ currentDrug.stock_quantity }}
              </el-tag>
            </div>
          </div>
        </div>
        
        <el-tabs v-model="activeDetailTab" class="detail-tabs">
          <el-tab-pane label="基本信息" name="basic">
            <div class="detail-section">
              <div class="detail-item">
                <span class="detail-label">成分：</span>
                <span>{{ currentDrug.composition || '--' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">适应症：</span>
                <span>{{ currentDrug.indications || '--' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">用法用量：</span>
                <span>{{ currentDrug.usage_dosage || '--' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">注意事项：</span>
                <span>{{ currentDrug.precautions || '--' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">有效期：</span>
                <span>{{ currentDrug.expiry_date || '--' }}</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="库存记录" name="inventory">
            <el-table :data="inventoryRecords" height="300">
              <el-table-column prop="batch_number" label="批号" width="120" />
              <el-table-column prop="quantity" label="数量" width="80" />
              <el-table-column prop="create_time" label="入库时间" width="180" />
              <el-table-column prop="expiry_date" label="有效期" width="120" />
              <el-table-column prop="create_user_name" label="操作人" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
    
    <!-- 药品表单弹窗 -->
    <el-dialog
      v-model="formDialogVisible"
      :title="isEditMode ? '编辑药品信息' : '新增药品'"
      width="800px"
    >
      <el-form
        ref="drugFormRef"
        :model="drugForm"
        :rules="drugFormRules"
        label-width="120px"
        label-position="top"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="药品通用名" prop="generic_name">
              <el-input v-model="drugForm.generic_name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类" prop="category">
              <el-select v-model="drugForm.category" placeholder="请选择分类">
                <el-option
                  v-for="category in drugCategories"
                  :key="category.value"
                  :label="category.label"
                  :value="category.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="规格" prop="specification">
              <el-input v-model="drugForm.specification" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产厂家" prop="manufacturer">
              <el-input v-model="drugForm.manufacturer" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="药品图片">
          <el-upload
            class="image-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeImageUpload"
            :http-request="handleImageUpload"
          >
            <el-image
              v-if="drugForm.imagePreview"
              :src="drugForm.imagePreview"
              class="uploaded-image"
              fit="cover"
            />
            <el-icon v-else class="image-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="成分" prop="composition">
          <el-input
            v-model="drugForm.composition"
            type="textarea"
            :rows="2"
          />
        </el-form-item>
        
        <el-form-item label="适应症（功能主治）" prop="indications">
          <el-input
            v-model="drugForm.indications"
            type="textarea"
            :rows="2"
          />
        </el-form-item>
        
        <el-form-item label="用法用量" prop="usage_dosage">
          <el-input
            v-model="drugForm.usage_dosage"
            type="textarea"
            :rows="2"
          />
        </el-form-item>
        
        <el-form-item label="注意事项" prop="precautions">
          <el-input
            v-model="drugForm.precautions"
            type="textarea"
            :rows="2"
          />
        </el-form-item>
        
        <el-form-item label="有效期" prop="expiry_date">
          <el-date-picker
            v-model="drugForm.expiry_date"
            type="date"
            placeholder="选择有效期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDrugForm">
          {{ isEditMode ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { 
  getDrugList, 
  createDrug, 
  updateDrug,
  updateDrugStatus,
  getDrugInventoryRecords
} from '@/api/drugs'
import { ShelfStatus, DrugCategory } from '@/types/drug'
import { ElMessage, ElMessageBox } from 'element-plus'
const medicineBoxIcon = new URL('@/assets/medicine-box.png', import.meta.url).href

// 药品分类选项
const drugCategories = [
  { value: DrugCategory.OTC, label: '非处方药(OTC)' },
  { value: DrugCategory.RX, label: '处方药(Rx)' },
  { value: DrugCategory.MEDICAL, label: '医疗器械' },
  { value: DrugCategory.HEALTH, label: '保健养生' }
]

// 上架状态选项
const shelfStatusOptions = [
  { value: ShelfStatus.ON_SHELF, label: '上架' },
  { value: ShelfStatus.OFF_SHELF, label: '下架' }
]

// 药品列表数据
const drugList = ref([])
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
const filterShelfStatus = ref(null)

// 药品表单相关
const formDialogVisible = ref(false)
const isEditMode = ref(false)
const drugForm = ref({
  generic_name: '',
  category: DrugCategory.OTC,
  specification: '',
  manufacturer: '',
  image: null,
  composition: '',
  indications: '',
  usage_dosage: '',
  precautions: '',
  expiry_date: null
})

// 表单验证规则
const drugFormRules = {
  generic_name: [
    { required: true, message: '请输入药品通用名', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择药品分类', trigger: 'change' }
  ]
}

// 药品详情相关
const detailDialogVisible = ref(false)
const currentDrug = ref(null)
const activeDetailTab = ref('basic')
const inventoryRecords = ref([])

// 获取药品列表
const fetchDrugList = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchKeyword.value,
      category: filterCategory.value,
      shelf_status: filterShelfStatus.value
    }
    
    const response = await getDrugList(params)
    drugList.value = response.data.items
    pagination.total = response.data.total
  } catch (error) {
    ElMessage.error('获取药品列表失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.page = 1
  fetchDrugList()
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  fetchDrugList()
}

// 处理页码变化
const handlePageChange = (page) => {
  pagination.page = page
  fetchDrugList()
}

// 打开创建药品弹窗
const openCreateDialog = () => {
  isEditMode.value = false
  drugForm.value = {
    generic_name: '',
    category: DrugCategory.OTC,
    specification: '',
    manufacturer: '',
    image: null,
    composition: '',
    indications: '',
    usage_dosage: '',
    precautions: '',
    expiry_date: null
  }
  formDialogVisible.value = true
}

// 打开编辑药品弹窗
const openEditDialog = (drug) => {
  isEditMode.value = true
  drugForm.value = { ...drug }
  formDialogVisible.value = true
}

// 提交药品表单
const submitDrugForm = async () => {
  try {
    if (isEditMode.value) {
      // 创建FormData对象
      const formData = new FormData()
      Object.keys(drugForm.value).forEach(key => {
        if (key !== 'imageFile' && key !== 'imagePreview') {
          formData.append(key, drugForm.value[key])
        }
      })
      
      // 添加图片文件（如果存在）
      if (drugForm.value.imageFile) {
        formData.append('image', drugForm.value.imageFile)
      }
      
      await updateDrug(drugForm.value.id, formData)
      ElMessage.success('药品信息更新成功')
    } else {
      // 创建FormData对象
      const formData = new FormData()
      Object.keys(drugForm.value).forEach(key => {
        if (key !== 'imageFile' && key !== 'imagePreview') {
          formData.append(key, drugForm.value[key])
        }
      })
      
      // 添加图片文件（如果存在）
      if (drugForm.value.imageFile) {
        formData.append('image', drugForm.value.imageFile)
      }
      
      await createDrug(formData)
      ElMessage.success('药品创建成功')
    }
    formDialogVisible.value = false
    fetchDrugList()
  } catch (error) {
    ElMessage.error('操作失败: ' + error.message)
  }
}

// 更新上架状态
const updateShelfStatus = async (drug) => {
  try {
    drug.updatingStatus = true
    await updateDrugStatus(drug.id, {
      shelf_status: drug.shelf_status
    })
    ElMessage.success('状态更新成功')
  } catch (error) {
    ElMessage.error('状态更新失败: ' + error.message)
    // 恢复原始状态
    drug.shelf_status = 
      drug.shelf_status === ShelfStatus.ON_SHELF 
        ? ShelfStatus.OFF_SHELF 
        : ShelfStatus.ON_SHELF
  } finally {
    drug.updatingStatus = false
  }
}

// 查看药品详情
const viewDrugDetails = async (drug) => {
  currentDrug.value = drug
  activeDetailTab.value = 'basic'
  
  try {
    const response = await getDrugInventoryRecords(drug.id)
    inventoryRecords.value = response.data
  } catch (error) {
    ElMessage.error('获取库存记录失败: ' + error.message)
    inventoryRecords.value = []
  }
  
  detailDialogVisible.value = true
}

// 图片上传处理
const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
    return false
  }
  
  return true
}

const handleImageUpload = async ({ file }) => {
  try {
    // 保存文件对象而非base64
    drugForm.value.imageFile = file
    
    // 显示预览
    const reader = new FileReader()
    reader.onload = (e) => {
      drugForm.value.imagePreview = e.target.result
    }
    reader.readAsDataURL(file)
  } catch (error) {
    ElMessage.error('图片上传失败: ' + error.message)
  }
}

// 获取分类标签类型
const getCategoryTagType = (category) => {
  switch (category) {
    case DrugCategory.OTC: return 'success'
    case DrugCategory.RX: return 'warning'
    case DrugCategory.MEDICAL: return 'info'
    case DrugCategory.HEALTH: return ''
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
  fetchDrugList()
})
</script>

<style scoped>
.rx-warning {
  color: #F56C6C; /* 红色文字 */
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 14px;
  background-color: #FEF0F0; /* 浅红色背景增强可读性 */
  padding: 8px;
  border-left: 4px solid #F56C6C; /* 左侧红色边框强调 */
  border-radius: 4px;
}
.button-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.drug-management {
  padding: 20px;
}

.toolbar-card {
  margin-bottom: 20px;
  background-color: #0F1420;
  border: 1px solid #2D303D;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  display: flex;
  gap: 12px;
}

.search-input {
  width: 300px;
}

.drug-list-card {
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

.drug-detail {
  padding: 10px;
}

.detail-header {
  display: flex;
  margin-bottom: 20px;
}

.detail-image {
  width: 120px;
  height: 120px;
  border-radius: 4px;
  margin-right: 20px;
}

.detail-info {
  flex: 1;
}

.detail-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.detail-spec, .detail-manufacturer {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.detail-status {
  display: flex;
  gap: 8px;
}

.detail-tabs {
  margin-top: 20px;
}

.detail-section {
  padding: 10px;
}

.detail-item {
  margin-bottom: 12px;
  font-size: 14px;
}

.detail-label {
  font-weight: bold;
  color: #165DFF;
  min-width: 80px;
  display: inline-block;
}

.image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 150px;
  height: 150px;
}

.image-uploader:hover {
  border-color: #165DFF;
}

.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}

.uploaded-image {
  width: 150px;
  height: 150px;
  display: block;
}

.drug-table-row:hover {
  background-color: rgba(22, 93, 255, 0.1) !important;
}
</style>