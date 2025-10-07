<!-- src/components/admin/StatusBadge.vue -->
<template>
  <el-tag :type="statusColor" effect="dark">
    {{ statusText }}
  </el-tag>
</template>

<script setup>
import { computed } from 'vue'
import { OrderStatus } from '@/types/order'

const props = defineProps({
  status: {
    type: Number,
    required: true
  }
})

const statusText = computed(() => {
  switch (props.status) {
    case OrderStatus.PENDING: return '待确认'
    case OrderStatus.PREPARING: return '备货中'
    case OrderStatus.READY: return '待取货'
    case OrderStatus.COMPLETED: return '已完成'
    default: return '未知状态'
  }
})

const statusColor = computed(() => {
  switch (props.status) {
    case OrderStatus.PENDING: return 'warning'
    case OrderStatus.PREPARING: return 'primary'
    case OrderStatus.READY: return 'info'
    case OrderStatus.COMPLETED: return 'success'
    default: return 'info'
  }
})
</script>

<style scoped>

</style>