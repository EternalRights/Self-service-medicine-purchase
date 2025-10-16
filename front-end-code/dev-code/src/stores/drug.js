import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchDrugs, searchDrugs } from '@/api/drugs'
import { useCartStore } from '@/stores/cart'
import { useNotificationStore } from '@/stores/notification'
import { useAuthStore } from '@/stores/auth'
import { MessageType } from '@/types/notification'

export const useDrugStore = defineStore('drug', () => {
  const drugs = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchKeyword = ref('')
  const sortOption = ref('default')
  // const categoryFilter = ref('all') // 已注释：分类筛选状态，暂保留字段以防后续需要
  
  // 获取药品列表
  const loadDrugs = async () => {
    try {
      loading.value = true
      const data = await fetchDrugs()
      drugs.value = data
    } catch (err) {
      error.value = err.message || '获取药品列表失败'
      console.error('获取药品列表失败:', err)
    } finally {
      loading.value = false
    }
  }
  
  // 搜索药品
  const searchDrugs = async (keyword) => {
    try {
      loading.value = true
      searchKeyword.value = keyword
      const response = await searchDrugs(keyword)
      drugs.value = response.data
    } catch (err) {
      error.value = err.message || '搜索药品失败'
      console.error('搜索药品失败:', err)
    } finally {
      loading.value = false
    }
  }
  
  // 设置排序选项
  const setSortOption = (option) => {
    sortOption.value = option
  }
  
  // setCategoryFilter: 已保留但不再使用，为未来可能的重构做准备
  
  // 添加到购物车
  const addToCart = (drug) => {
    const cartStore = useCartStore()
    cartStore.addItem(drug)
  }
  
  // 咨询药师
  const consultPharmacist = (drug) => {
    const authStore = useAuthStore()
    const notificationStore = useNotificationStore()
    
    const notification = {
      title: '用药咨询请求',
      content: `用户 ${authStore.userName} 请求咨询药品: ${drug.generic_name}`,
      messageType: MessageType.MEDICAL_CONSULT,
      drugId: drug.id
    }
    
    notificationStore.addNotification(notification)
  }
  
  // 计算过滤和排序后的药品列表
  const filteredDrugs = computed(() => {
    let result = [...drugs.value]
    
    // 已注释：药品分类筛选功能已移除
    // if (categoryFilter.value !== 'all') {
    //   result = result.filter(drug => drug.category === Number(categoryFilter.value))
    // }
    
    // 应用搜索关键词
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      result = result.filter(drug => 
        drug.generic_name.toLowerCase().includes(keyword) ||
        (drug.indications && drug.indications.toLowerCase().includes(keyword))
      )
    }
    
    // 应用排序
    if (sortOption.value === 'price_asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortOption.value === 'price_desc') {
      result.sort((a, b) => b.price - a.price)
    }
    
    return result
  })
  
  return {
    drugs,
    loading,
    error,
    searchKeyword,
    sortOption,
    // categoryFilter, 已从返回对象中移除
    filteredDrugs,
    loadDrugs,
    searchDrugs,
    setSortOption,
    // setCategoryFilter,
    addToCart,
    consultPharmacist
  }
})