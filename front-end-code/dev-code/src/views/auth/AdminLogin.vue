<template>
  <div class="admin-login-container">
    <div class="admin-login-card">
      <div class="admin-login-header">
        <div class="brand">
          <div class="logo">
            <i class="el-icon-first-aid-kit"></i>
          </div>
          <h1>欢迎使用医药自助购 - 管理平台</h1>
        </div>
        <p class="subtitle">安全、专业的药店智能管理系统</p>
      </div>
      
      <el-form 
        class="admin-login-form"
        @submit.prevent="handleAdminLogin"
      >
        <el-form-item :error="v$.account.$errors[0]?.$message">
          <el-input
            v-model="form.account"
            placeholder="请输入管理员账号"
            prefix-icon="User"
            @blur="v$.account.$touch"
          />
        </el-form-item>
        
        <el-form-item :error="v$.password.$errors[0]?.$message">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入登录密码"
            prefix-icon="Lock"
            show-password
            @blur="v$.password.$touch"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            class="admin-login-btn"
            :loading="loading"
            native-type="submit"
          >
            登录
          </el-button>
        </el-form-item>
        
        <div class="login-footer">
          <el-link type="primary" @click="goToUserLogin">返回用户登录</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '@vuelidate/validators'

export default {
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const form = reactive({
      account: '',
      password: ''
    })
    
    const rules = {
      account: { 
        required,
        minLength: minLength(3),
        maxLength: maxLength(20)
      },
      password: { 
        required, 
        minLength: minLength(6),
        maxLength: maxLength(20)
      }
    }
    
    const v$ = useVuelidate(rules, form)
    
    const loading = ref(false)
    
    const handleAdminLogin = async () => {
      // 将所有管理员登录请求统一交给store处理
      // 包括默认管理员账号 admin/123456
      
      const isValid = await v$.value.$validate()
      if (!isValid) {
        return
      }
      
      loading.value = true
      try {
        await authStore.adminLogin({
          account: form.account,
          password: form.password
        })
      } catch (error) {
        // 消息提示由 store 统一处理
      } finally {
        loading.value = false
      }
    }
    
    const goToUserLogin = () => {
      router.push('/auth/login')
    }

    return {
      form,
      v$,
      loading,
      handleAdminLogin,
      goToUserLogin
    }
  }
}
</script>

<style scoped>
.admin-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1a2a3a;
}

.admin-login-card {
  width: 450px;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  background-color: #2c3e50;
  color: #ecf0f1;
}

.admin-login-header {
  text-align: center;
  margin-bottom: 30px;
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.logo {
  width: 60px;
  height: 60px;
  background-color: #3498db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.logo i {
  font-size: 32px;
  color: white;
}

.admin-login-header h1 {
  font-size: 24px;
  color: #ecf0f1;
  margin: 0;
}

.subtitle {
  font-size: 14px;
  color: #bdc3c7;
}

.admin-login-form {
  margin-top: 20px;
}

.admin-login-btn {
  width: 100%;
  height: 45px;
  font-size: 16px;
  background-color: #3498db;
  border-color: #3498db;
}

.admin-login-btn:hover {
  background-color: #2980b9;
  border-color: #2980b9;
}

:deep(.el-input__inner) {
  background-color: #34495e;
  border: 1px solid #2c3e50;
  color: #ecf0f1;
}

:deep(.el-input__inner::placeholder) {
  color: #95a5a6;
}

:deep(.el-form-item__label) {
  color: #ecf0f1;
}
</style>