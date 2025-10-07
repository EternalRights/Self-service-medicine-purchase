// src/api/admin.js
import request from '@/utils/request'

/**
 * 获取管理员列表
 * @param {Object} params - 查询参数
 * @returns {Promise<import('@/types/api').ApiResponse<import('@/types/api').PaginatedResponse<import('@/types/admin').Admin>>>}
 */
export function getAdminList(params = {}) {
  return request.get('/api/admin/list', { params })
}

/**
 * 创建新管理员
 * @param {import('@/types/admin').AdminCreate} data - 管理员创建信息
 * @returns {Promise<import('@/types/api').ApiResponse<import('@/types/admin').Admin>>}
 */
export function createAdmin(data) {
  return request.post('/api/admin', data)
}

/**
 * 重置管理员密码
 * @param {import('@/types/admin').AdminPasswordReset} data - 密码重置信息
 * @returns {Promise<import('@/types/api').ApiResponse<void>>}
 */
export function resetAdminPassword(data) {
  return request.put('/api/admin/reset-password', data)
}

/**
 * 删除管理员
 * @param {number} id - 管理员ID
 * @returns {Promise<import('@/types/api').ApiResponse<void>>}
 */
export function deleteAdmin(id) {
  return request.delete(`/api/admin/${id}`)
}

/**
 * 获取营业状态
 * @returns {Promise<import('@/types/api').ApiResponse<{ status: string }>>}
 */
export function getBusinessStatus() {
  return request.get('/api/app/business-status')
}

/**
 * 更新营业状态
 * @param {Object} data - 营业状态数据
 * @param {string} data.status - 营业状态 ('营业中' 或 '暂停营业')
 * @returns {Promise<import('@/types/api').ApiResponse<void>>}
 */
export function updateBusinessStatus(data) {
  return request.put('/api/app/business-status', data)
}

/**
 * 修改管理员密码
 * @param {Object} data - 密码修改数据
 * @param {string} data.currentPassword - 当前密码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise<import('@/types/api').ApiResponse<void>>}
 */
export function changeAdminPassword(data) {
  return request.post('/api/admin/change-password', data)
}

/**
 * 获取仪表板核心指标
 * @returns {Promise<import('@/types/api').ApiResponse<{
 *   todayOrders: number,
 *   todaySales: number,
 *   pendingConsultations: number,
 *   lowStockItems: number
 * }>>}
 */
export function getDashboardMetrics() {
  return request.get('/api/admin/dashboard/metrics')
}

/**
 * 获取热门咨询药品TOP3
 * @returns {Promise<import('@/types/api').ApiResponse<Array<{
 *   id: number,
 *   generic_name: string,
 *   consultation_count: number
 * }>>>}
 */
export function getHotConsultations() {
  return request.get('/api/admin/dashboard/hot-consultations')
}

/**
 * 获取销售趋势数据
 * @param {string} period - 时间段: '7d' 或 '30d'
 * @returns {Promise<import('@/types/api').ApiResponse<{
 *   dates: string[],
 *   orders: number[],
 *   sales: number[]
 * }>>}
 */
export function getSalesTrend(period) {
  return request.get('/api/admin/dashboard/sales-trend', {
    params: { period }
  })
}

/**
 * 获取药品销量排行
 * @returns {Promise<import('@/types/api').ApiResponse<Array<{
 *   name: string,
 *   value: number
 * }>>>}
 */
export function getSalesRank() {
  return request.get('/api/admin/dashboard/sales-rank')
}

/**
 * 获取药品分类占比
 * @returns {Promise<import('@/types/api').ApiResponse<Array<{
 *   name: string,
 *   value: number
 * }>>>}
 */
export function getCategoryDistribution() {
  return request.get('/api/admin/dashboard/category-distribution')
}