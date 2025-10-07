<!-- src/views/admin/UserManagement.vue -->
<template>
  <div class="user-management">
    <!-- 搜索和筛选工具栏 -->
    <el-card class="toolbar-card" shadow="never">
      <div class="toolbar">
        <div class="filter-section">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索用户名、手机号"
            clearable
            class="search-input"
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
          
          <el-select
            v-model="filterGender"
            placeholder="全部性别"
            clearable
            @change="handleSearch"
          >
            <el-option
              v-for="gender in genderOptions"
              :key="gender.value"
              :label="gender.label"
              :value="gender.value"
            />
          </el-select>
          
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="注册开始日期"
            end-placeholder="注册结束日期"
            value-format="YYYY-MM-DD"
            @change="handleSearch"
          />
        </div>
      </div>
    </el-card>
    
    <!-- 用户列表 -->
    <el-card class="user-list-card" shadow="never">
      <el-table
        :data="userList"
        v-loading="loading"
        style="width: 100%"
        :header-cell-style="{ background: '#0F1420', color: '#fff' }"
        row-class-name="user-table-row"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="用户名" width="150" />
        <el-table-column prop="phone_number" label="手机号" width="150" />
        <el-table-column label="性别" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.gender === Gender.MALE">男</el-tag>
            <el-tag v-else-if="row.gender === Gender.FEMALE" type="danger">女</el-tag>
            <el-tag v-else-if="row.gender === Gender.OTHER" type="info">其他</el-tag>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="create_time" label="注册时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="openEditDialog(row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDeleteUser(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
    
    <!-- 编辑用户弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="`编辑用户信息 - ${currentUser?.name}`"
      width="500px"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone_number">
          <el-input v-model="userForm.phone_number" disabled />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="userForm.gender" placeholder="请选择性别">
            <el-option
              v-for="gender in genderOptions"
              :key="gender.value"
              :label="gender.label"
              :value="gender.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="userForm.age" :min="0" :max="120" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUserForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUsers, updateUser, deleteUser } from '@/api/users'
import { Gender } from '@/types/user'

// 性别选项
const genderOptions = [
  { value: Gender.MALE, label: '男' },
  { value: Gender.FEMALE, label: '女' },
  { value: Gender.OTHER, label: '其他' }
]

// 用户列表数据
const userList = ref([])
const loading = ref(false)

// 分页参数
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 搜索和筛选参数
const searchKeyword = ref('')
const filterGender = ref(null)
const dateRange = ref([])

// 编辑用户相关
const editDialogVisible = ref(false)
const currentUser = ref(null)
const userForm = ref({
  id: null,
  name: '',
  phone_number: '',
  gender: null,
  age: null
})

// 表单验证规则
const userFormRules = {
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { type: 'number', min: 0, max: 120, message: '年龄必须在 0 到 120 之间', trigger: 'blur' }
  ]
}

// 获取用户列表
const fetchUserList = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchKeyword.value,
      gender: filterGender.value,
      startDate: dateRange.value?.[0],
      endDate: dateRange.value?.[1]
    }
    
    const response = await getUsers(params)
    userList.value = response.data.items
    pagination.total = response.data.total
  } catch (error) {
    ElMessage.error('获取用户列表失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.page = 1
  fetchUserList()
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  fetchUserList()
}

// 处理页码变化
const handlePageChange = (page) => {
  pagination.page = page
  fetchUserList()
}

// 打开编辑弹窗
const openEditDialog = (user) => {
  currentUser.value = user
  userForm.value = {
    id: user.id,
    name: user.name,
    phone_number: user.phone_number,
    gender: user.gender,
    age: user.age
  }
  editDialogVisible.value = true
}

// 提交用户表单
const submitUserForm = async () => {
  try {
    await updateUser(userForm.value.id, {
      name: userForm.value.name,
      gender: userForm.value.gender,
      age: userForm.value.age
    })
    ElMessage.success('用户信息更新成功')
    editDialogVisible.value = false
    fetchUserList()
  } catch (error) {
    ElMessage.error('更新用户信息失败: ' + error.message)
  }
}

// 删除用户
const handleDeleteUser = (userId) => {
  ElMessageBox.confirm('确定要删除该用户吗？此操作不可恢复！', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteUser(userId)
      ElMessage.success('用户删除成功')
      fetchUserList()
    } catch (error) {
      ElMessage.error('删除用户失败: ' + error.message)
    }
  }).catch(() => {
    // 用户取消
  })
}

// 初始化加载数据
onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.toolbar-card {
  margin-bottom: 20px;
  background-color: #0F1420;
  border: 1px solid #2D303D;
}

.toolbar {
  display: flex;
}

.filter-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  width: 300px;
}

.user-list-card {
  background-color: #0F1420;
  border: 1px solid #2D303D;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.user-table-row:hover {
  background-color: rgba(22, 93, 255, 0.1) !important;
}
</style>