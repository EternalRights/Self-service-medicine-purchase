// src/api/users.js
import request from '@/utils/request'

/**
 * 获取当前登录用户信息
 * @returns {Promise<import('@/types/api').ApiResponse<import('@/types/user').User>>}
 */
export function getCurrentUser() {
  return request.get('/user/me')
}

/**
 * 更新用户个人信息
 * @param {import('@/types/user').UserProfileUpdate} profileData - 用户个人信息更新数据
 * @returns {Promise<import('@/types/api').ApiResponse<import('@/types/user').User>>}
 */
export function updateUserProfile(profileData) {
  return request.put('/user/profile', profileData)
}

/**
 * 修改用户密码
 * @param {Object} passwordData - 密码修改数据
 * @param {string} passwordData.currentPassword - 当前密码
 * @param {string} passwordData.newPassword - 新密码
 * @returns {Promise<import('@/types/api').ApiResponse<void>>}
 */
export function changePassword(passwordData) {
  return request.put('/user/password', passwordData)
}

/**
 * 获取用户列表（管理员专用）
 * @param {Object} params - 查询参数
 * @param {string} [params.keyword] - 搜索关键词
 * @param {number} [params.gender] - 性别筛选
 * @param {string} [params.startDate] - 注册开始日期 (YYYY-MM-DD)
 * @param {string} [params.endDate] - 注册结束日期 (YYYY-MM-DD)
 * @param {number} [params.page] - 页码
 * @param {number} [params.pageSize] - 每页数量
 * @returns {Promise<import('@/types/api').ApiResponse<import('@/types/api').PaginatedResponse<import('@/types/user').User>>>}
 */
export function getUsers(params = {}) {
  return request.get('/api/admin/users', { params })
}

/**
 * 更新用户信息（管理员专用）
 * @param {number} id - 用户ID
 * @param {import('@/types/user').UserProfileUpdate} data - 更新数据
 * @returns {Promise<import('@/types/api').ApiResponse<import('@/types/user').User>>}
 */
export function updateUser(id, data) {
  return request.put(`/api/admin/users/${id}`, data)
}

/**
 * 删除用户（管理员专用）
 * @param {number} id - 用户ID
 * @returns {Promise<import('@/types/api').ApiResponse<void>>}
 */
export function deleteUser(id) {
  return request.delete(`/api/admin/users/${id}`)
}

/**
 * 创建用户（管理员专用）
 * @param {import('@/types/user').UserRegistration} data - 用户注册信息
 * @returns {Promise<import('@/types/api').ApiResponse<import('@/types/user').User>>}
 */
export function createUser(data) {
  return request.post('/api/admin/users', data)
}