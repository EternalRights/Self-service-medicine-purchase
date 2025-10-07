<!-- src/views/admin/OrderManagement.vue -->
<template>
  <div class="order-management">
    <!-- 实时通知看板 -->
    <RealTimeNotification />
    
    <!-- 订单筛选工具栏 -->
    <el-card class="toolbar-card" shadow="never">
      <div class="toolbar">
        <div class="filter-section">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索订单号、用户名"
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
            v-model="filterStatus"
            placeholder="全部状态"
            clearable
            @change="handleSearch"
          >
            <el-option
              v-for="status in orderStatusOptions"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
          
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="handleSearch"
          />
        </div>
      </div>
    </el-card>
    
    <!-- 订单列表 -->
    <el-card class="order-list-card" shadow="never">
      <el-table
        :data="orderList"
        v-loading="loading"
        style="width: 100%"
        :header-cell-style="{ background: '#0F1420', color: '#fff' }"
        row-class-name="order-table-row"
      >
        <el-table-column prop="id" label="订单号" width="160" />
        <el-table-column label="用户信息" width="180">
          <template #default="{ row }">
            <div class="user-info">
              <div class="user-name">{{ row.user.name }}</div>
              <div class="user-phone">{{ row.user.phone_number }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="药品清单" min-width="300">
          <template #default="{ row }">
            <div class="drugs-list">
              <div v-for="item in row.items" :key="item.id" class="drug-item">
                <span class="drug-name">{{ item.drug.generic_name }}</span>
                <span class="drug-quantity">x{{ item.quantity }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="total_amount" label="总金额" width="120">
          <template #default="{ row }">
            ¥{{ row.total_amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="180" />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <StatusBadge :status="row.order_status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="viewOrderDetails(row)"
            >
              详情
            </el-button>
            <el-button
              type="info"
              size="small"
              @click="updateOrderStatus(row)"
              :disabled="row.order_status === OrderStatus.COMPLETED"
            >
              更新状态
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
    
    <!-- 订单详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="`订单详情 - #${currentOrder?.id}`"
      width="800px"
    >
      <div v-if="currentOrder" class="order-detail">
        <div class="detail-section">
          <div class="detail-header">
            <div class="detail-info">
              <div class="detail-item">
                <span class="detail-label">订单号：</span>
                <span>{{ currentOrder.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">下单时间：</span>
                <span>{{ currentOrder.create_time }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">订单状态：</span>
                <StatusBadge :status="currentOrder.order_status" />
              </div>
              <div class="detail-item">
                <span class="detail-label">总金额：</span>
                <span class="detail-value">¥{{ currentOrder.total_amount.toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h3 class="section-title">用户信息</h3>
            <div class="user-info">
              <div class="detail-item">
                <span class="detail-label">姓名：</span>
                <span>{{ currentOrder.user.name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">手机号：</span>
                <span>{{ currentOrder.user.phone_number }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h3 class="section-title">药品清单</h3>
            <el-table :data="currentOrder.items" style="width: 100%">
              <el-table-column label="药品名称" width="200">
                <template #default="{ row }">
                  {{ row.drug.generic_name }}
                </template>
              </el-table-column>
              <el-table-column prop="drug.specification" label="规格" width="120" />
              <el-table-column label="单价" width="100">
                <template #default="{ row }">
                  ¥{{ row.unit_price.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="数量" width="80" />
              <el-table-column label="小计" width="120">
                <template #default="{ row }">
                  ¥{{ row.subtotal_amount.toFixed(2) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
    
    <!-- 更新订单状态弹窗 -->
    <el-dialog
      v-model="statusDialogVisible"
      :title="`更新订单状态 - #${currentOrder?.id}`"
      width="500px"
    >
      <div v-if="currentOrder" class="status-update">
        <el-form label-position="top">
          <el-form-item label="当前状态">
            <StatusBadge :status="currentOrder.order_status" />
          </el-form-item>
          <el-form-item label="更新为">
            <el-select v-model="newStatus" placeholder="请选择新状态">
              <el-option
                v-for="status in nextStatusOptions"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmStatusUpdate">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import RealTimeNotification from '@/components/admin/RealTimeNotification.vue'
import StatusBadge from '@/components/admin/StatusBadge.vue'
import { 
  getOrderList,
  getOrderDetail,
  updateOrderStatus as updateOrderStatusApi
} from '@/api/orders'
import { OrderStatus } from '@/types/order'

// 订单状态选项
const orderStatusOptions = [
  { value: OrderStatus.PENDING, label: '待确认', color: 'warning' },
  { value: OrderStatus.PREPARING, label: '备货中', color: 'primary' },
  { value: OrderStatus.READY, label: '待取货', color: 'info' },
  { value: OrderStatus.COMPLETED, label: '已完成', color: 'success' }
]

// 订单列表数据
const orderList = ref([])
const loading = ref(false)

// 分页参数
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 搜索和筛选参数
const searchKeyword = ref('')
const filterStatus = ref(null)
const dateRange = ref([])

// 订单详情相关
const detailDialogVisible = ref(false)
const currentOrder = ref(null)

// 状态更新相关
const statusDialogVisible = ref(false)
const newStatus = ref(null)

// 计算属性：获取下一个可选状态
const nextStatusOptions = computed(() => {
  if (!currentOrder.value) return []
  
  const current = currentOrder.value.order_status
  const options = []
  
  switch (current) {
    case OrderStatus.PENDING:
      options.push(
        { value: OrderStatus.PREPARING, label: '备货中' }
      )
      break
    case OrderStatus.PREPARING:
      options.push(
        { value: OrderStatus.READY, label: '待取货' }
      )
      break
    case OrderStatus.READY:
      options.push(
        { value: OrderStatus.COMPLETED, label: '已完成' }
      )
      break
  }
  
  return options
})

// 获取订单列表
const fetchOrderList = async () => {
  try {
    loading.value = true
    // 构建请求参数，过滤掉空值
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    
    // 添加搜索关键词（如果存在）
    if (searchKeyword.value) {
      params.keyword = searchKeyword.value
    }
    
    // 添加状态筛选（如果存在）
    if (filterStatus.value !== null && filterStatus.value !== undefined) {
      params.status = filterStatus.value
    }
    
    // 添加日期范围（如果已选择）
    if (dateRange.value && dateRange.value.length === 2) {
      params.startDate = dateRange.value[0]
      params.endDate = dateRange.value[1]
    }
    
    const response = await getOrderList(params)
    orderList.value = response.data.items
    pagination.total = response.data.total
  } catch (error) {
    ElMessage.error('获取订单列表失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.page = 1
  fetchOrderList()
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  fetchOrderList()
}

// 处理页码变化
const handlePageChange = (page) => {
  pagination.page = page
  fetchOrderList()
}

// 查看订单详情
const viewOrderDetails = async (order) => {
  try {
    loading.value = true
    const response = await getOrderDetail(order.id)
    currentOrder.value = response.data
    detailDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取订单详情失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

// 更新订单状态
const updateOrderStatus = (order) => {
  currentOrder.value = order
  newStatus.value = null
  statusDialogVisible.value = true
}

// 确认状态更新
const confirmStatusUpdate = async () => {
  if (!newStatus.value) {
    ElMessage.warning('请选择新的订单状态')
    return
  }
  
  try {
    loading.value = true
    await updateOrderStatusApi({
      order_id: currentOrder.value.id,
      new_status: newStatus.value
    })
    ElMessage.success('订单状态更新成功')
    statusDialogVisible.value = false
    fetchOrderList()
  } catch (error) {
    ElMessage.error('状态更新失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

// 初始化加载数据
onMounted(() => {
  fetchOrderList()
})
</script>

<style scoped>
.order-management {
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
  align-items: center;
}

.search-input {
  width: 300px;
}

.order-list-card {
  background-color: #0F1420;
  border: 1px solid #2D303D;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: bold;
}

.user-phone {
  font-size: 12px;
  color: #999;
}

.drugs-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.drug-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drug-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drug-quantity {
  font-size: 12px;
  color: #999;
  min-width: 40px;
  text-align: right;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.order-detail {
  padding: 10px;
}

.detail-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #165DFF;
  border-bottom: 1px solid #2D303D;
  padding-bottom: 8px;
}

.detail-item {
  display: flex;
  margin-bottom: 10px;
  font-size: 14px;
}

.detail-label {
  font-weight: bold;
  min-width: 80px;
  color: #165DFF;
}

.detail-value {
  font-weight: bold;
  color: #FF6B35;
}

.order-table-row:hover {
  background-color: rgba(22, 93, 255, 0.1) !important;
}
</style>