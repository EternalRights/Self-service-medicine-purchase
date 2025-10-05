<template>
  <div class="auth-layout">
    <header class="auth-header">
      <div class="brand">
        <div class="logo">
          <i class="el-icon-first-aid-kit"></i>
        </div>
        <h1>医药自助购</h1>
        <p>安全、便捷的24小时自助购药服务</p>
      </div>
    </header>
    
    <main class="auth-content">
      <router-view />
    </main>
    
    <footer class="auth-footer">
      <p>《药品网络销售许可证》编号：XXXXXX</p>
      <p>互联网药品信息服务资格证书</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>

<style scoped>
.auth-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.auth-header {
  padding: 20px 0;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 60px;
  height: 60px;
  background-color: #409eff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.logo i {
  font-size: 30px;
  color: white;
}

.auth-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-footer {
  padding: 15px;
  text-align: center;
  font-size: 12px;
  color: #909399;
  background-color: #fff;
}
</style>