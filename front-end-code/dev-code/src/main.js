// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { ElMessage } from 'element-plus';

const app = createApp(App);
const pinia = createPinia(); // 创建 pinia 实例

app.use(pinia); // 使用 pinia 插件
app.use(router);
app.use(ElementPlus);
// 配置Element Plus全局参数
app.config.globalProperties.$message = ElMessage;
// ElMessage.config 已被移除，可通过以下方式配置默认行为：
// 1. 在调用时传入选项：ElMessage({ message: '提示信息', duration: 3000 })
// 2. 创建封装函数处理默认配置

// 初始化所有 store
const stores = [
  'auth',
  'app',
  'drug',
  'cart',
  'notification'
];

// 确保在 pinia 安装后初始化 store
app.mount('#app');

// 在应用挂载后初始化 store
stores.forEach(storeName => {
  const store = pinia.state.value[storeName];
  if (store && typeof store.init === 'function') {
    store.init();
  }
});