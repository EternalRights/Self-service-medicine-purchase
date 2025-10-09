<!-- src/views/admin/Dashboard.vue -->
<template>
  <div class="dashboard">
    <!-- 关键指标卡片 -->
    <div class="metrics-grid">
      <el-card class="metric-card" shadow="hover">
        <div class="metric-content">
          <div class="metric-info">
            <div class="metric-value">{{ metrics.todayOrders }}</div>
            <div class="metric-label">今日订单数</div>
          </div>
          <div class="metric-icon">
            <el-icon><ShoppingCart /></el-icon>
          </div>
        </div>
      </el-card>

      <el-card class="metric-card" shadow="hover">
        <div class="metric-content">
          <div class="metric-info">
            <div class="metric-value">¥{{ metrics.todaySales }}</div>
            <div class="metric-label">今日销售额</div>
          </div>
          <div class="metric-icon">
            <el-icon><Money /></el-icon>
          </div>
        </div>
      </el-card>

      <el-card class="metric-card" shadow="hover">
        <div class="metric-content">
          <div class="metric-info">
            <div class="metric-value">{{ metrics.pendingConsultations }}</div>
            <div class="metric-label">待处理咨询</div>
          </div>
          <div class="metric-icon">
            <el-icon><ChatDotRound /></el-icon>
          </div>
        </div>
      </el-card>

      <el-card class="metric-card" shadow="hover">
        <div class="metric-content">
          <div class="metric-info">
            <div class="metric-value">{{ metrics.lowStockItems }}</div>
            <div class="metric-label">低库存药品</div>
          </div>
          <div class="metric-icon">
            <el-icon><Warning /></el-icon>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 热门咨询药品 -->
    <el-card class="chart-card" shadow="never">
      <template #header>
        <div class="card-header">
          <img :src="medicineBoxIcon" alt="热门咨询药品" class="section-icon" />
          <span>热门咨询药品 TOP3</span>
        </div>
      </template>
      <div class="hot-drugs-list">
        <div v-for="(drug, index) in hotConsultationDrugs" :key="drug.id" class="hot-drug-item">
          <div class="drug-rank">#{{ index + 1 }}</div>
          <div class="drug-info">
            <div class="drug-name">{{ drug.generic_name }}</div>
            <div class="drug-count">{{ drug.consultation_count }} 次咨询</div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <!-- 销售趋势图 -->
      <el-card class="chart-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>销售趋势</span>
            <el-radio-group v-model="salesTrendPeriod" size="small">
              <el-radio-button label="7d">近7天</el-radio-button>
              <el-radio-button label="30d">近30天</el-radio-button>
            </el-radio-group>
          </div>
        </template>
        <div ref="salesChartRef" class="chart-container"></div>
      </el-card>

      <!-- 药品销量排行 -->
      <el-card class="chart-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>药品销量排行</span>
          </div>
        </template>
        <div ref="salesRankChartRef" class="chart-container"></div>
      </el-card>

      <!-- 药品分类占比 -->
      <el-card class="chart-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>药品分类占比</span>
          </div>
        </template>
        <div ref="categoryChartRef" class="chart-container"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import {
  getDashboardMetrics,
  getHotConsultations,
  getSalesTrend,
  getSalesRank,
  getCategoryDistribution
} from '@/api/admins'
import * as echarts from 'echarts'
import { 
  ShoppingCart, 
  Money, 
  ChatDotRound, 
  Warning 
} from '@element-plus/icons-vue'

const medicineBoxIcon = new URL('@/assets/medicine-box.png', import.meta.url).href

// 图表引用
const salesChartRef = ref(null)
const salesRankChartRef = ref(null)
const categoryChartRef = ref(null)

// 图表实例
let salesChart = null
let salesRankChart = null
let categoryChart = null

// 响应式数据
const salesRank = ref([])
const categoryDistribution = ref([])
const salesTrendData = ref({
  '7d': { dates: [], orders: [], sales: [] },
  '30d': { dates: [], orders: [], sales: [] }
})
const metrics = ref({
  todayOrders: 0,
  todaySales: 0,
  pendingConsultations: 0,
  lowStockItems: 0
})

const hotConsultationDrugs = ref([])
const salesTrendPeriod = ref('7d')

// 模拟数据（实际项目中应从API获取）


// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 销售趋势图
    salesChart = echarts.init(salesChartRef.value)
    const salesOption = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['订单数', '销售额'],
        textStyle: { color: '#fff' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: mockData.salesTrend[salesTrendPeriod.value].dates,
        axisLine: { lineStyle: { color: '#666' } },
        axisLabel: { color: '#999' }
      },
      yAxis: [
        {
          type: 'value',
          name: '订单数',
          axisLine: { lineStyle: { color: '#666' } },
          axisLabel: { color: '#999' }
        },
        {
          type: 'value',
          name: '销售额',
          axisLine: { lineStyle: { color: '#666' } },
          axisLabel: { 
            color: '#999',
            formatter: '¥{value}'
          }
        }
      ],
      series: [
        {
          name: '订单数',
          type: 'line',
          yAxisIndex: 0,
          data: mockData.salesTrend[salesTrendPeriod.value].orders,
          itemStyle: { color: '#165DFF' },
          lineStyle: { color: '#165DFF' }
        },
        {
          name: '销售额',
          type: 'line',
          yAxisIndex: 1,
          data: mockData.salesTrend[salesTrendPeriod.value].sales,
          itemStyle: { color: '#00B42A' },
          lineStyle: { color: '#00B42A' }
        }
      ]
    }
    salesChart.setOption(salesOption)

    // 药品销量排行
    salesRankChart = echarts.init(salesRankChartRef.value)
    const salesRankOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#666' } },
        axisLabel: { color: '#999' }
      },
      yAxis: {
        type: 'category',
        data: mockData.salesRank.map(item => item.name),
        axisLine: { lineStyle: { color: '#666' } },
        axisLabel: { color: '#999' }
      },
      series: [
        {
          type: 'bar',
          data: mockData.salesRank.map(item => ({
            value: item.value,
            itemStyle: { color: '#165DFF' }
          })),
          label: {
            show: true,
            position: 'right',
            color: '#fff'
          }
        }
      ]
    }
    salesRankChart.setOption(salesRankOption)

    // 药品分类占比
    categoryChart = echarts.init(categoryChartRef.value)
    const categoryOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: { color: '#fff' }
      },
      series: [
        {
          name: '分类占比',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#1A1D29',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 18,
              fontWeight: 'bold',
              color: '#fff'
            }
          },
          labelLine: {
            show: false
          },
          data: mockData.categoryDistribution.map((item, index) => ({
            ...item,
            itemStyle: {
              color: ['#165DFF', '#00B42A', '#FF7D00', '#F53F3F'][index]
            }
          }))
        }
      ]
    }
    categoryChart.setOption(categoryOption)
  })
}

// 更新销售趋势图
const updateSalesChart = () => {
  if (salesChart) {
    const option = salesChart.getOption();
    const currentData = salesTrendData.value[salesTrendPeriod.value];
    option.xAxis[0].data = currentData.dates;
    option.series[0].data = currentData.orders;
    option.series[1].data = currentData.sales;
    salesChart.setOption(option);
  }
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true;
    // 获取核心指标
    const metricsResponse = await getDashboardMetrics();
    metrics.value = metricsResponse.data;

    // 获取热门咨询药品
    const hotDrugsResponse = await getHotConsultations();
    hotConsultationDrugs.value = hotDrugsResponse.data;

    // 获取销售趋势
    const salesTrendResponse = await getSalesTrend(salesTrendPeriod.value);
    salesTrendData.value[salesTrendPeriod.value] = salesTrendResponse.data;

    // 获取药品销量排行
    const salesRankResponse = await getSalesRank();
    salesRank.value = salesRankResponse.data;

    // 获取药品分类占比
    const categoryDistributionResponse = await getCategoryDistribution();
    categoryDistribution.value = categoryDistributionResponse.data;

    // 初始化图表
    await nextTick();
    initCharts();
  } catch (error) {
    ElMessage.error('加载数据失败: ' + error.message);
  } finally {
    loading.value = false;
  }
}

// 响应式监听
watch(salesTrendPeriod, () => {
  updateSalesChart()
})

// 生命周期
onMounted(async () => {
  await loadData()
  initCharts()
})

onUnmounted(() => {
  if (salesChart) salesChart.dispose()
  if (salesRankChart) salesRankChart.dispose()
  if (categoryChart) categoryChart.dispose()
})

// 窗口大小变化时重绘图表
const handleResize = () => {
  if (salesChart) salesChart.resize()
  if (salesRankChart) salesRankChart.resize()
  if (categoryChart) categoryChart.resize()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.section-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.dashboard {
  padding: 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.metric-card {
  background: linear-gradient(135deg, #165DFF 0%, #0E42D2 100%);
  border: none;
  color: #fff;
}

.metric-card .el-card__body {
  padding: 20px;
}

.metric-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-info {
  display: flex;
  flex-direction: column;
}

.metric-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.metric-label {
  font-size: 14px;
  opacity: 0.9;
}

.metric-icon {
  font-size: 48px;
  opacity: 0.8;
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
  margin-top: 20px;
}

.chart-card {
  background-color: #0F1420;
  border: 1px solid #2D303D;
  color: #fff;
}

.chart-card .el-card__header {
  border-bottom: 1px solid #2D303D;
  padding: 16px 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.hot-drugs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hot-drug-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #1A1D29;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.hot-drug-item:hover {
  background-color: #2D303D;
}

.drug-rank {
  width: 32px;
  height: 32px;
  background-color: #165DFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
}

.drug-info {
  flex: 1;
}

.drug-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.drug-count {
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>