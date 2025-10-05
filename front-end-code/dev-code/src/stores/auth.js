// src/stores/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

/**
 * 认证状态管理
 * 管理用户和管理员的登录状态、token信息等
 */
export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  
  // 状态定义
  const token = ref(localStorage.getItem('medical_token') || null);
  const tokenExpiry = ref(parseInt(localStorage.getItem('medical_token_expiry') || '0'));
  const userId = ref(localStorage.getItem('medical_user_id') || null);
  const userName = ref(localStorage.getItem('medical_user_name') || null);
  const userType = ref(localStorage.getItem('medical_user_type') || null); // 'user' 或 'admin'
  
  // 计算属性
  const isLoggedIn = computed(() => {
    return !!token.value && tokenExpiry.value > Date.now();
  });
  
  const isAdmin = computed(() => {
    return userType.value === 'admin';
  });
  
  const isUser = computed(() => {
    return userType.value === 'user';
  });
  
  // 用户登录
  const userLogin = (loginData) => {
    // 实际项目中这里会调用API，这里模拟登录成功
    token.value = 'user_token_' + Date.now();
    userId.value = loginData.userId || 'user_' + Math.floor(Math.random() * 1000);
    userName.value = loginData.name || '普通用户';
    userType.value = 'user';
    tokenExpiry.value = Date.now() + 3600 * 1000; // 1小时后过期
    
    // 持久化存储
    persistAuthState();
    
    // 登录成功提示
    ElMessage.success('登录成功');
    
    // 跳转到用户首页
    router.push('/user/home');
  };
  
  // 管理员登录
  const adminLogin = (loginData) => {
    // 实际项目中这里会调用API，这里模拟登录成功
    token.value = 'admin_token_' + Date.now();
    userId.value = loginData.userId || 'admin_' + Math.floor(Math.random() * 1000);
    userName.value = loginData.name || '管理员';
    userType.value = 'admin';
    tokenExpiry.value = Date.now() + 3600 * 1000; // 1小时后过期
    
    // 持久化存储
    persistAuthState();
    
    // 登录成功提示
    ElMessage.success('管理员登录成功');
    
    // 跳转到管理首页
    router.push('/admin/dashboard');
  };
  
  // 用户注册
  const userRegister = (registerData) => {
    // 实际项目中这里会调用API，这里模拟注册成功
    ElMessage.success('注册成功，请登录');
    
    // 注册后跳转到登录页
    router.push('/auth/login');
  };
  
  // 登出
  const logout = () => {
    token.value = null;
    userId.value = null;
    userName.value = null;
    userType.value = null;
    tokenExpiry.value = 0;
    
    // 清除持久化存储
    clearAuthState();
    
    // 登出提示
    ElMessage.success('已成功登出');
    
    // 跳转到登录页
    router.push('/auth/login');
  };
  
  // 检查Token有效性
  const checkTokenValidity = () => {
    return token.value && tokenExpiry.value > Date.now();
  };
  
  // 持久化认证状态
  const persistAuthState = () => {
    localStorage.setItem('medical_token', token.value);
    localStorage.setItem('medical_user_id', userId.value);
    localStorage.setItem('medical_user_name', userName.value);
    localStorage.setItem('medical_user_type', userType.value);
    localStorage.setItem('medical_token_expiry', tokenExpiry.value.toString());
  };
  
  // 清除认证状态
  const clearAuthState = () => {
    localStorage.removeItem('medical_token');
    localStorage.removeItem('medical_user_id');
    localStorage.removeItem('medical_user_name');
    localStorage.removeItem('medical_user_type');
    localStorage.removeItem('medical_token_expiry');
  };
  
  // 初始化时检查token有效性
  if (token.value && tokenExpiry.value <= Date.now()) {
    clearAuthState();
  }
  
  return {
    token,
    tokenExpiry,
    userId,
    userName,
    userType,
    isLoggedIn,
    isAdmin,
    isUser,
    userLogin,
    adminLogin,
    userRegister,
    logout,
    checkTokenValidity,
    persistAuthState,
    clearAuthState
  };
});