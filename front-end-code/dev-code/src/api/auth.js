// src/api/auth.js
import { post, get } from '@/utils/request';

/**
 * 用户登录
 * @param {Object} credentials - 用户登录凭证
 * @param {string} credentials.phone_number - 手机号
 * @param {string} credentials.password - 密码
 * @returns {Promise} API响应
 */
export const userLogin = async (credentials) => {
  return post('/auth/user/login', credentials);
};

/**
 * 管理员登录
 * @param {Object} credentials - 管理员登录凭证
 * @param {string} credentials.login_account - 管理员账号
 * @param {string} credentials.password - 密码
 * @returns {Promise} API响应
 */
export const adminLogin = async (credentials) => {
  return post('/auth/admin/login', credentials);
};

/**
 * 用户注册
 * @param {Object} registrationData - 用户注册信息
 * @param {string} registrationData.phone_number - 手机号
 * @param {string} registrationData.password - 密码
 * @param {string} registrationData.name - 姓名
 * @returns {Promise} API响应
 */
export const userRegister = async (registrationData) => {
  return post('/auth/user/register', registrationData);
};

/**
 * 用户登出
 * @returns {Promise} API响应
 */
export const userLogout = async () => {
  return post('/auth/logout');
};

/**
 * 刷新访问令牌
 * @returns {Promise} API响应
 */
export const refreshToken = async () => {
  return post('/auth/refresh');
};

/**
 * 获取当前用户信息
 * @returns {Promise} API响应
 */
export const getCurrentUser = async () => {
  return get('/auth/user');
};

/**
 * 修改用户密码
 * @param {Object} passwordData - 密码修改数据
 * @param {string} passwordData.oldPassword - 旧密码
 * @param {string} passwordData.newPassword - 新密码
 * @returns {Promise} API响应
 */
export const changePassword = async (passwordData) => {
  return post('/auth/user/password', passwordData);
};

export default {
  userLogin,
  adminLogin,
  userRegister,
  userLogout,
  refreshToken,
  getCurrentUser,
  changePassword
};