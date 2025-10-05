<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <div class="brand">
          <div class="logo">
            <i class="el-icon-first-aid-kit"></i>
          </div>
          <h1>注册新账户</h1>
        </div>
        <p class="subtitle">加入医药自助购，享受便捷购药服务</p>
      </div>
      
      <el-form 
        class="register-form"
        @submit.prevent="handleRegister"
      >
        <el-form-item :error="v$.phone.$errors[0]?.$message">
          <el-input
            v-model="form.phone"
            placeholder="请输入您的手机号"
            prefix-icon="Iphone"
            @blur="v$.phone.$touch"
          />
        </el-form-item>
        
        <el-form-item :error="v$.password.$errors[0]?.$message">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请设置登录密码（6-20位字符）"
            prefix-icon="Lock"
            show-password
            @blur="v$.password.$touch"
          />
        </el-form-item>
        
        <el-form-item :error="v$.confirmPassword.$errors[0]?.$message">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请确认密码"
            prefix-icon="Lock"
            show-password
            @blur="v$.confirmPassword.$touch"
          />
        </el-form-item>
        
        <el-form-item :error="v$.name.$errors[0]?.$message">
          <el-input
            v-model="form.name"
            placeholder="请输入您的用户名"
            prefix-icon="User"
            @blur="v$.name.$touch"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            class="register-btn"
            :loading="loading"
            native-type="submit"
          >
            注册新账户
          </el-button>
        </el-form-item>
        
        <div class="register-footer">
          <el-link type="primary" @click="goToLogin">已有账户？去登录</el-link>
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
import { required, minLength, maxLength, sameAs } from '@vuelidate/validators'

export default {
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const form = reactive({
      phone: '',
      password: '',
      confirmPassword: '',
      name: ''
    })
    
    const rules = {
      phone: { 
        required,
        minLength: minLength(11),
        maxLength: maxLength(11)
      },
      password: { 
        required, 
        minLength: minLength(6),
        maxLength: maxLength(20)
      },
      confirmPassword: { 
        required,
        sameAs: sameAs(form => form.password)
      },
      name: { 
        required,
        minLength: minLength(2),
        maxLength: maxLength(20)
      }
    }
    
    const v$ = useVuelidate(rules, form)
    
    const loading = ref(false)
    
    const handleRegister = async () => {
      const isValid = await v$.value.$validate()
      if (!isValid) {
        return
      }
      
      loading.value = true
      try {
        await authStore.userRegister({
          phone: form.phone,
          name: form.name,
          password: form.password
        })
        ElMessage.success('注册成功，请登录')
        router.push('/auth/login')
      } catch (error) {
        ElMessage.error('注册失败: ' + (error.message || '请稍后再试'))
      } finally {
        loading.value = false
      }
    }
    
    const goToLogin = () => {
      router.push('/auth/login')
    }
    
    return {
      form,
      v$,
      loading,
      handleRegister,
      goToLogin
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
}

.register-card {
  width: 450px;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.register-header {
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

.register-header h1 {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.subtitle {
  font-size: 14px;
  color: #606266;
}

.register-form {
  margin-top: 20px;
}

.register-btn {
  width: 100%;
  height: 45px;
  font-size: 16px;
}

.register-footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>