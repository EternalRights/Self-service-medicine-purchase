// src/composables/auth/useAuth.js
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import authApi from '@/api/auth';

/**
 * 认证逻辑组合函数
 * 提供用户登录、注册、登出等操作的封装
 */
export const useAuth = () => {
  const authStore = useAuthStore();
  const router = useRouter();
  
  // 登录状态
  const isAuthenticated = ref(authStore.isLoggedIn);
  const isAdmin = ref(authStore.isAdmin);
  const isUser = ref(authStore.isUser);
  
  // 登录表单状态
  const loginForm = ref({
    phone_number: '',
    password: ''
  });
  
  // 注册表单状态
  const registerForm = ref({
    phone_number: '',
    password: '',
    name: ''
  });
  
  // 管理员登录表单状态
  const adminLoginForm = ref({
    login_account: '',
    password: ''
  });
  
  // 加载状态
  const isLoading = ref(false);
  const errorMessage = ref('');
  
  /**
   * 用户登录
   */
  const loginUser = async () => {
    try {
      isLoading.value = true;
      errorMessage.value = '';
      
      const response = await authApi.userLogin(loginForm.value);
      
      if (response.success) {
        const { token, userId, userName } = response.data;
        authStore.userLogin({
          token,
          userId,
          userName,
          name: userName // 用户名即姓名
        });
        
        isAuthenticated.value = true;
        isUser.value = true;
        
        ElMessage.success('登录成功');
        router.push('/user/home');
      } else {
        errorMessage.value = response.message || '登录失败，请检查账号密码';
        ElMessage.error(errorMessage.value);
      }
    } catch (error) {
      console.error('登录失败:', error);
      errorMessage.value = '登录失败，请稍后重试';
      ElMessage.error(errorMessage.value);
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * 管理员登录
   */
  const loginAdmin = async () => {
    try {
      isLoading.value = true;
      errorMessage.value = '';
      
      const response = await authApi.adminLogin(adminLoginForm.value);
      
      if (response.success) {
        const { token, adminId, adminName } = response.data;
        authStore.adminLogin({
          token,
          userId: adminId,
          userName: adminName,
          name: adminName // 用户名即姓名
        });
        
        isAuthenticated.value = true;
        isAdmin.value = true;
        
        ElMessage.success('管理员登录成功');
        router.push('/admin/dashboard');
      } else {
        errorMessage.value = response.message || '登录失败，请检查账号密码';
        ElMessage.error(errorMessage.value);
      }
    } catch (error) {
      console.error('管理员登录失败:', error);
      errorMessage.value = '登录失败，请稍后重试';
      ElMessage.error(errorMessage.value);
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * 用户注册
   */
  const registerUser = async () => {
    try {
      isLoading.value = true;
      errorMessage.value = '';
      
      const response = await authApi.userRegister(registerForm.value);
      
      if (response.success) {
        ElMessage.success('注册成功，请登录');
        router.push('/auth/login');
      } else {
        errorMessage.value = response.message || '注册失败，请稍后重试';
        ElMessage.error(errorMessage.value);
      }
    } catch (error) {
      console.error('注册失败:', error);
      errorMessage.value = '注册失败，请稍后重试';
      ElMessage.error(errorMessage.value);
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * 用户登出
   */
  const logout = async () => {
    try {
      await authApi.userLogout();
      authStore.logout();
      
      isAuthenticated.value = false;
      isAdmin.value = false;
      isUser.value = false;
      
      ElMessage.success('已成功登出');
      router.push('/auth/login');
    } catch (error) {
      console.error('登出失败:', error);
      ElMessage.error('登出失败，请重试');
    }
  };
  
  /**
   * 检查认证状态
   */
  const checkAuth = () => {
    isAuthenticated.value = authStore.isLoggedIn;
    isAdmin.value = authStore.isAdmin;
    isUser.value = authStore.isUser;
  };
  
  return {
    // 状态
    isAuthenticated,
    isAdmin,
    isUser,
    loginForm,
    registerForm,
    adminLoginForm,
    isLoading,
    errorMessage,
    
    // 方法
    loginUser,
    loginAdmin,
    registerUser,
    logout,
    checkAuth
  };
};