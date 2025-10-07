// src/api/drugs.js
import request from '@/utils/request'

/**
 * 获取药品列表
 * @param {import('@/types/drug').DrugFilterParams} params - 筛选参数
 * @returns {Promise<import('@/types/api').ApiResponse<import('@/types/api').PaginatedResponse<import('@/types/drug').Drug>>>}
 */
export const fetchDrugs = (params = {}) => {
  return request.get('/drugs', { params })
}

export const getDrugList = (params = {}) => {
  // 条件性添加有效参数，避免传入null/undefined
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => 
      value !== null && value !== undefined && value !== ''
    )
  )
  return request.get('/drugs', { params: filteredParams })
}

/**
 * 搜索药品 
 * @param {string} keyword - 搜索关键词
 * @param {Object} params - 其他参数
 * @returns {Promise<import('@/types/api').ApiResponse<import('@/types/api').PaginatedResponse<import('@/types/drug').Drug>>>}
 */
export const searchDrugs = (keyword, params = {}) => {
  return request.get('/drugs/search', { 
    params: { keyword, ...params } 
  })
}

/**
 * 获取药品详情
 * @param {number} id - 药品ID
 * @returns {Promise<import('@/types/api').ApiResponse<import('@/types/drug').Drug>>}
 */
export const getDrugDetail = (id) => {
  return request.get(`/drugs/${id}`)
}

/**
 * 获取药品分类
 * @returns {Promise<import('@/types/api').ApiResponse<Array<{
 *   id: number,
 *   name: string
 * }>>>}
 */
export const getDrugCategories = () => {
  return request.get('/drugs/categories')
}

/**
 * 创建药品
 * @param {import('@/types/drug').DrugCreate} data - 药品数据
 * @returns {Promise<import('@/types/api').ApiResponse<import('@/types/drug').Drug>>}
 */
export const createDrug = (data) => {
  return request.post('/drugs', data)
}

/**
 * 更新药品信息
 * @param {number} id - 药品ID
 * @param {import('@/types/drug').DrugUpdate} data - 更新数据
 * @returns {Promise<import('@/types/api').ApiResponse<import('@/types/drug').Drug>>}
 */
export const updateDrug = (id, data) => {
  return request.put(`/drugs/${id}`, data)
}

/**
 * 更新药品状态 
 * @param {number} id - 药品ID
 * @param {Object} data - 状态数据
 * @param {number} data.shelf_status - 上架状态
 * @returns {Promise<import('@/types/api').ApiResponse<void>>}
 */
export const updateDrugStatus = (id, data) => {
  return request.patch(`/drugs/${id}/status`, data)
}

/**
 * 获取药品库存记录
 * @param {number} drugId - 药品ID
 * @returns {Promise<import('@/types/api').ApiResponse<Array<import('@/types/drug').InventoryRecord>>>}
 */
export const getDrugInventoryRecords = (drugId) => {
  return request.get(`/drugs/${drugId}/inventory-records`)
}

/**
 * 添加药品库存记录（入库）
 * @param {number} drugId - 药品ID
 * @param {import('@/types/drug').InventoryRecordCreate} data - 入库数据
 * @returns {Promise<import('@/types/api').ApiResponse<void>>}
 */
export const addDrugInventory = (drugId, data) => {
  return request.post(`/drugs/${drugId}/inventory`, data)
}

/**
 * 删除药品
 * @param {number} id - 药品ID
 * @returns {Promise<import('@/types/api').ApiResponse<void>>}
 */
export const deleteDrug = (id) => {
  return request.delete(`/drugs/${id}`)
}

/**
 * 添加到购物车 - 应属于购物车API
 * @param {number} drugId - 药品ID
 * @param {number} quantity - 数量
 * @returns {Promise<import('@/types/api').ApiResponse<void>>}
 */
export const addToCart = (drugId, quantity = 1) => {
  return request.post('/cart/items', { drugId, quantity })
}

/**
 * 咨询药师 - 应属于咨询API
 * @param {number} drugId - 药品ID
 * @param {number} userId - 用户ID
 * @returns {Promise<import('@/types/api').ApiResponse<void>>}
 */
export const consultPharmacist = (drugId, userId) => {
  return request.post('/consultations', { drugId, userId })
}