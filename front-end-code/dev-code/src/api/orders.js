// src/api/orders.js
import request from '@/utils/request'

/**
 * 获取订单列表
 * @param {Object} params - 查询参数
 * @param {string} [params.keyword] - 搜索关键词
 * @param {number} [params.status] - 订单状态
 * @param {string} [params.startDate] - 开始日期 (YYYY-MM-DD)
 * @param {string} [params.endDate] - 结束日期 (YYYY-MM-DD)
 * @param {number} [params.page] - 页码
 * @param {number} [params.pageSize] - 每页数量
 * @returns {Promise<import('@/types/api').ApiResponse<import('@/types/api').PaginatedResponse<import('@/types/order').Order>>>}
 */
export function getOrderList(params = {}) {
  return request.get('/api/orders', { params })
}

/**
 * 获取订单详情
 * @param {number} id - 订单ID
 * @returns {Promise<import('@/types/api').ApiResponse<import('@/types/order').OrderDetail>>}
 */
export function getOrderDetail(id) {
  return request.get(`/api/orders/${id}`)
}

/**
 * 更新订单状态
 * @param {import('@/types/order').OrderStatusUpdate} data - 订单状态更新数据
 * @returns {Promise<import('@/types/api').ApiResponse<void>>}
 */
export function updateOrderStatus(data) {
  return request.put('/api/orders/status', data)
}

/**
 * 获取实时通知列表
 * @param {Object} [params] - 查询参数
 * @param {boolean} [params.is_processed] - 是否已处理
 * @param {number} [params.page] - 页码
 * @param {number} [params.pageSize] - 每页数量
 * @returns {Promise<import('@/types/api').ApiResponse<import('@/types/api').PaginatedResponse<import('@/types/order').Notification>>>}
 */
export function getNotifications(params = {}) {
  return request.get('/api/notifications', { params })
}

/**
 * 更新通知处理状态
 * @param {number} id - 通知ID
 * @param {boolean} isProcessed - 是否已处理
 * @returns {Promise<import('@/types/api').ApiResponse<void>>}
 */
export function updateNotificationStatus(id, isProcessed) {
  return request.put(`/api/notifications/${id}/status`, { is_processed: isProcessed })
}

/**
 * 标记所有通知为已读
 * @returns {Promise<import('@/types/api').ApiResponse<void>>}
 */
export function markAllNotificationsAsRead() {
  return request.put('/api/notifications/mark-all-read')
}

/**
 * 获取未读通知数量
 * @returns {Promise<import('@/types/api').ApiResponse<{ unread_count: number }>>}
 */
export function getUnreadNotificationCount() {
  return request.get('/api/notifications/unread-count')
}

/**
 * 添加新通知
 * @param {Object} data - 通知数据
 * @param {number} data.user_id - 用户ID
 * @param {number} data.message_type - 消息类型
 * @param {string} data.title - 通知标题
 * @param {string} data.content - 通知内容
 * @returns {Promise<import('@/types/api').ApiResponse<import('@/types/order').Notification>>}
 */
export function addNotification(data) {
  return request.post('/api/notifications', data)
}