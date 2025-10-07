<template>
  <div class="profile-container">
    <div class="header-section">
      <el-button icon="Back" @click="goBack">返回</el-button>
      <h1 class="profile-title">个人中心</h1>
    </div>
    <!-- <h1 class="profile-title">个人中心</h1> -->
    
    <div class="profile-content">
      <!-- 菜单导航 -->
      <div class="profile-menu">
        <el-menu 
          :default-active="activeMenu" 
          class="menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="profile">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="security">
            <el-icon><Lock /></el-icon>
            <span>安全设置</span>
          </el-menu-item>
        </el-menu>
      </div>
      
      <!-- 内容区域 -->
      <div class="profile-detail">
        <!-- 基本资料 -->
        <div v-if="activeMenu === 'profile'" class="profile-form">
          <el-form 
            ref="profileForm" 
            :model="profileForm" 
            :rules="profileRules"
            label-width="100px"
            label-position="top"
          >
            <el-form-item label="姓名" prop="name">
              <el-input v-model="profileForm.name" placeholder="请输入姓名" />
            </el-form-item>
            
            <el-form-item label="联系电话" prop="phone_number">
              <el-input 
                v-model="profileForm.phone_number" 
                placeholder="请输入联系电话"
                disabled
              />
            </el-form-item>
            
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="profileForm.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
                <el-radio :label="3">其他</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="年龄" prop="age">
              <el-input-number 
                v-model="profileForm.age" 
                :min="0" 
                :max="150" 
                controls-position="right"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                @click="submitProfileForm"
                :loading="profileLoading"
              >
                保存修改
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        
        <!-- 安全设置 -->
        <div v-if="activeMenu === 'security'" class="security-form">
          <el-form 
            ref="securityForm" 
            :model="securityForm" 
            :rules="securityRules"
            label-width="100px"
            label-position="top"
          >
            <el-form-item label="当前密码" prop="currentPassword">
              <el-input 
                v-model="securityForm.currentPassword" 
                type="password" 
                placeholder="请输入当前密码" 
                show-password 
              />
            </el-form-item>
            
            <el-form-item label="新密码" prop="newPassword">
              <el-input 
                v-model="securityForm.newPassword" 
                type="password" 
                placeholder="请输入新密码" 
                show-password 
              />
            </el-form-item>
            
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input 
                v-model="securityForm.confirmPassword" 
                type="password" 
                placeholder="请再次输入新密码" 
                show-password 
              />
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                @click="submitSecurityForm"
                :loading="securityLoading"
              >
                修改密码
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';
import { getCurrentUser, updateUserProfile, changePassword } from '@/api/users';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const goBack = () => {
  router.go(-1); // 返回上一页
};
// 当前激活的菜单
const activeMenu = ref('profile');

// 基本资料表单
const profileForm = reactive({
  name: '',
  phone_number: '',
  gender: null,
  age: null
});

// 安全设置表单
const securityForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 加载状态
const profileLoading = ref(false);
const securityLoading = ref(false);

// 表单验证规则
const profileRules = reactive({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2到20个字符', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { type: 'number', min: 0, max: 150, message: '年龄必须在0到150之间', trigger: 'blur' }
  ]
});

const securityRules = reactive({
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== securityForm.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
});

// 处理菜单选择
const handleMenuSelect = (index) => {
  activeMenu.value = index;
};

// 初始化用户信息
const initUserProfile = async () => {
  try {
    // 从后端获取用户信息
    const response = await getCurrentUser();
    const userData = response.data;
    
    // 填充表单
    profileForm.name = userData.name;
    profileForm.phone_number = userData.phone_number;
    profileForm.gender = userData.gender;
    profileForm.age = userData.age;
  } catch (error) {
    ElMessage.error('获取用户信息失败: ' + error.message);
  }
};

// 提交基本资料表单
const submitProfileForm = async () => {
  try {
    profileLoading.value = true;
    
    // 调用API更新用户信息
    await updateUserProfile({
      name: profileForm.name,
      gender: profileForm.gender,
      age: profileForm.age
    });
    
    // 更新认证状态中的用户信息
    authStore.updateUserProfile({
      name: profileForm.name,
      gender: profileForm.gender,
      age: profileForm.age
    });
    
    ElMessage.success('个人信息更新成功');
  } catch (error) {
    ElMessage.error('更新失败: ' + error.message);
  } finally {
    profileLoading.value = false;
  }
};

// 提交安全设置表单
const submitSecurityForm = async () => {
  try {
    securityLoading.value = true;
    
    // 调用API修改密码
    await changePassword({
      currentPassword: securityForm.currentPassword,
      newPassword: securityForm.newPassword
    });
    
    // 清空表单
    securityForm.currentPassword = '';
    securityForm.newPassword = '';
    securityForm.confirmPassword = '';
    
    ElMessage.success('密码修改成功');
  } catch (error) {
    ElMessage.error('修改密码失败: ' + error.message);
  } finally {
    securityLoading.value = false;
  }
};

onMounted(() => {
  // 初始化用户信息
  initUserProfile();
});
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.profile-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.profile-content {
  display: flex;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-menu {
  width: 200px;
  background-color: #f5f7fa;
  border-right: 1px solid #e4e7ed;
}

.menu {
  border-right: none;
}

.profile-detail {
  flex: 1;
  padding: 30px;
}

.profile-form,
.security-form {
  max-width: 500px;
  margin: 0 auto;
}

.el-form-item {
  margin-bottom: 22px;
}

.el-input, .el-input-number {
  width: 100%;
}

.el-button {
  width: 150px;
}
</style>