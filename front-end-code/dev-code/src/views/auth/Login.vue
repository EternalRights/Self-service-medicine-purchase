<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="brand">
          <div class="logo">
            <i class="el-icon-first-aid-kit"></i>
          </div>
          <h1>欢迎使用医药自助购</h1>
        </div>
        <p class="subtitle">安全、便捷的24小时自助购药服务</p>
      </div>
      
      <el-form 
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item :error="v$.username.$errors[0]?.$message">
          <el-input
            v-model="form.username"
            placeholder="用户名/手机号"
            prefix-icon="User"
            @blur="v$.username.$touch"
          />
        </el-form-item>
        
        <el-form-item :error="v$.password.$errors[0]?.$message">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
            @blur="v$.password.$touch"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            :loading="loading"
            native-type="submit"
          >
            登录
          </el-button>
        </el-form-item>
        
        <div class="login-footer">
          <el-link type="primary" @click="goToRegister">注册新账户</el-link>
          <el-link type="primary" @click="goToAdminLogin">管理员登录</el-link>
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
      username: '',
      password: ''
    })
    
    const rules = {
      username: { 
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
    
    const handleLogin = async () => {
      const isValid = await v$.value.$validate()
      if (!isValid) {
        return
      }
      
      loading.value = true
      try {
        await authStore.userLogin({
          username: form.username,
          password: form.password
        })
      } catch (error) {
        // 消息提示由 store 统一处理
      } finally {
        loading.value = false
      }
    }
    
    const goToRegister = () => {
      router.push('/auth/register')
    }

    const goToAdminLogin = () => {
      router.push('/auth/admin-login')
    }

    return {
      form,
      v$,
      loading,
      handleLogin,
      goToRegister,
      goToAdminLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
}

.login-card {
  width: 450px;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.login-header {
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
  background-color: #165DFF;
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

.login-header h1 {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.subtitle {
  font-size: 14px;
  color: #606266;
}

.login-form {
  margin-top: 20px;
}

.login-btn {
  width: 100%;
  height: 45px;
  font-size: 16px;
}

.login-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.el-link {
  font-size: 14px;
}
</style>