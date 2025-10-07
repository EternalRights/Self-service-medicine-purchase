// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);
const pinia = createPinia(); // 创建 pinia 实例

app.use(pinia); // 使用 pinia 插件
app.use(router);
app.use(ElementPlus);

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