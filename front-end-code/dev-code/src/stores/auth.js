// src/stores/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import * as userApi from '@/api/auth';

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
  
  // 用户详细信息字段
  const userGender = ref(localStorage.getItem('medical_user_gender') || null);
  const userAge = ref(localStorage.getItem('medical_user_age') || null);
  const userPhone = ref(localStorage.getItem('medical_user_phone') || null);
  
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
  const userLogin = async (loginData) => {
    // 参数校验
    if (!loginData.username || !loginData.password) {
      ElMessage.error('请输入用户名和密码');
      throw new Error('缺少登录凭证');
    }
    
    try {
      // 调用真实API
      const response = await userApi.userLogin({
        phone_number: loginData.username,
        password: loginData.password
      });
      
      // 假设API返回格式：{ token, user: { id, name, gender, age, phone } }
      const { token: apiToken, user } = response.data;
      
      token.value = apiToken;
      userId.value = user.id;
      userName.value = user.name;
      userType.value = 'user';
      tokenExpiry.value = Date.now() + 3600 * 1000; // 可从token解析过期时间
      
      // 设置用户详细信息
      userGender.value = user.gender || null;
      userAge.value = user.age || null;
      userPhone.value = user.phone || null;
      
      // 持久化存储
      persistAuthState();
      
      // 跳转到用户首页
      router.push('/user/home');
    } catch (error) {
      ElMessage.error('登录失败: ' + (error.message || '用户名或密码错误'));
      throw error;
    }
  };
  
  // 管理员登录
  const adminLogin = async (loginData) => {
    // 参数校验
    if (!loginData.account || !loginData.password) {
      ElMessage.error('请输入账号和密码');
      throw new Error('缺少登录凭证');
    }
    
    // 【特殊处理】默认管理员账号（前端挂载）
    if (loginData.account === 'admin' && loginData.password === '123456') {
      token.value = 'admin_token_' + Date.now();
      userId.value = '0';
      userName.value = '默认管理员';
      userType.value = 'admin';
      tokenExpiry.value = Date.now() + 3600 * 1000;
      
      persistAuthState();
      ElMessage.success('管理员登录成功');
      router.push('/admin/dashboard');
      return;
    }
    
    // 正常管理员账号（调用API）
    try {
      const response = await userApi.adminLogin({
        login_account: loginData.account,
        password: loginData.password
      });
      
      const { token: apiToken, admin } = response.data;
      token.value = apiToken;
      userId.value = admin.id;
      userName.value = admin.name;
      userType.value = 'admin';
      tokenExpiry.value = Date.now() + 3600 * 1000;
      
      persistAuthState();
      router.push('/admin/dashboard');
    } catch (error) {
      ElMessage.error('登录失败: ' + (error.message || '账号或密码错误'));
      throw error;
    }
  };
  
  // 用户注册
  const userRegister = async (registerData) => {
    // 参数校验
    if (!registerData.phone || !registerData.name || !registerData.password) {
      ElMessage.error('请填写完整注册信息');
      throw new Error('缺少注册信息');
    }
    
    try {
      await userApi.userRegister({
        phone_number: registerData.phone,
        name: registerData.name,
        password: registerData.password
      });
      
      // 注册成功提示
      ElMessage.success('注册成功，请登录');
      
      // 跳转到登录页
      router.push('/auth/login');
    } catch (error) {
      ElMessage.error('注册失败: ' + (error.message || '请稍后再试'));
      throw error;
    }
  };
  
  // 登出
  const logout = () => {
    token.value = null;
    userId.value = null;
    userName.value = null;
    userType.value = null;
    tokenExpiry.value = 0;
    userGender.value = null;
    userAge.value = null;
    userPhone.value = null;
    
    // 清除持久化存储
    clearAuthState();
    
    // 登出提示由 store 统一处理
    
    // 跳转到登录页
    router.push('/auth/login');
  };
  
  // 检查Token有效性
  const checkTokenValidity = () => {
    return token.value && tokenExpiry.value > Date.now();
  };
  
  // 更新用户信息
  const updateUserProfile = (profileData) => {
    if (profileData.name) userName.value = profileData.name;
    if (profileData.gender) userGender.value = profileData.gender;
    if (profileData.age) userAge.value = profileData.age;
    
    // 持久化存储
    persistAuthState();
    
    ElMessage.success('个人信息更新成功');
  };
  
  // 持久化认证状态
  const persistAuthState = () => {
    localStorage.setItem('medical_token', token.value);
    localStorage.setItem('medical_user_id', userId.value);
    localStorage.setItem('medical_user_name', userName.value);
    localStorage.setItem('medical_user_type', userType.value);
    localStorage.setItem('medical_token_expiry', tokenExpiry.value.toString());
    
    // 用户详细信息持久化
    localStorage.setItem('medical_user_gender', userGender.value);
    localStorage.setItem('medical_user_age', userAge.value);
    localStorage.setItem('medical_user_phone', userPhone.value);
  };
  
  // 清除认证状态
  const clearAuthState = () => {
    localStorage.removeItem('medical_token');
    localStorage.removeItem('medical_user_id');
    localStorage.removeItem('medical_user_name');
    localStorage.removeItem('medical_user_type');
    localStorage.removeItem('medical_token_expiry');
    
    // 用户详细信息清除
    localStorage.removeItem('medical_user_gender');
    localStorage.removeItem('medical_user_age');
    localStorage.removeItem('medical_user_phone');
  };
  
  // 初始化时检查token有效性
  if (token.value && tokenExpiry.value <= Date.now()) {
    clearAuthState();
  }
  
  return {
    // 状态
    token,
    tokenExpiry,
    userId,
    userName,
    userType,
    userGender,
    userAge,
    userPhone,
    
    // 计算属性
    isLoggedIn,
    isAdmin,
    isUser,
    
    // 方法
    userLogin,
    adminLogin,
    userRegister,
    logout,
    checkTokenValidity,
    persistAuthState,
    clearAuthState,
    updateUserProfile
  };
});