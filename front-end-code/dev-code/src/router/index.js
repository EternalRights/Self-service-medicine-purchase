import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import { useAppStore } from '@/stores/app.js';
import { ElMessage } from 'element-plus';

// 路由配置
const routes = [
  {
    path: '/',
    redirect: '/auth/login'
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { 
      requiresAuth: false,
      title: '用户登录 - 医药自助购'
    }
  },
  {
    path: '/auth/admin-login',
    name: 'AdminLogin',
    component: () => import('@/views/auth/AdminLogin.vue'),
    meta: { 
      requiresAuth: false,
      title: '管理员登录 - 医药自助购'
    }
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: { 
      requiresAuth: false,
      title: '用户注册 - 医药自助购'
    }
  },
  {
    path: '/user',
    component: () => import('@/layouts/UserLayout.vue'),
    meta: { 
      requiresAuth: true,
      userType: 'user',
      title: '医药自助购'
    },
    children: [
      {
        path: 'home',
        name: 'UserHome',
        component: () => import('@/views/user/Home.vue'),
        meta: { 
          title: '首页 - 医药自助购'
        }
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/user/Cart.vue'),
        meta: { 
          title: '购物车 - 医药自助购'
        }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/user/Profile.vue'),
        meta: { 
          title: '个人中心 - 医药自助购'
        }
      },
      {
        path: 'drug/:id',
        name: 'DrugDetail',
        component: () => import('@/views/user/DrugDetail.vue'),
        props: true,
        meta: { 
          title: '药品详情 - 医药自助购'
        }
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { 
      requiresAuth: true,
      userType: 'admin',
      title: '医药自助购 - 管理平台'
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { 
          title: '仪表板 - 医药自助购管理平台'
        }
      },
      {
        path: 'orders',
        name: 'OrderManagement',
        component: () => import('@/views/admin/OrderManagement.vue'),
        meta: { 
          title: '订单管理 - 医药自助购管理平台'
        }
      },
      {
        path: 'drugs',
        name: 'DrugManagement',
        component: () => import('@/views/admin/DrugManagement.vue'),
        meta: { 
          title: '药品管理 - 医药自助购管理平台'
        }
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('@/views/admin/UserManagement.vue'),
        meta: { 
          title: '用户管理 - 医药自助购管理平台'
        }
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('@/views/admin/Inventory.vue'),
        meta: { 
          title: '进货管理 - 医药自助购管理平台'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { 
      title: '页面不存在 - 医药自助购'
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

/**
 * 路由守卫 - 全局前置守卫
 * 实现登录状态检查和权限控制
 */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const appStore = useAppStore();
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  
  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    console.log('路由守卫检查认证状态', { 
      path: to.path, 
      requiresAuth: to.meta.requiresAuth,
      isLoggedIn: authStore.isLoggedIn,
      token: authStore.token,
      tokenExpiry: authStore.tokenExpiry,
      now: Date.now()
    });
    
    // 检查用户是否登录
    if (!authStore.isLoggedIn) {
      // 未登录，重定向到登录页
      ElMessage.warning('请先登录');
      
      // 根据目标路由类型重定向到对应的登录页
      if (to.meta.userType === 'admin') {
        return next({ name: 'AdminLogin', query: { redirect: to.fullPath } });
      } else {
        return next({ name: 'Login', query: { redirect: to.fullPath } });
      }
    }
    
    // 检查用户类型是否匹配
    if (to.meta.userType && authStore.userType !== to.meta.userType) {
      // 用户类型不匹配
      ElMessage.error('权限不足，无法访问该页面');
      
      // 重定向到用户类型的首页
      if (authStore.isAdmin) {
        return next({ name: 'Dashboard' });
      } else {
        return next({ name: 'UserHome' });
      }
    }
    
    // 管理员访问管理页面时，初始化应用状态
    if (to.meta.userType === 'admin' && !appStore.isInitialized) {
      try {
        await appStore.initAppState();
      } catch (error) {
        ElMessage.error('初始化应用状态失败: ' + error.message);
      }
    }
  }
  
  // 已登录用户访问登录/注册页时重定向到首页
  if (authStore.isLoggedIn && 
      ['Login', 'AdminLogin', 'Register'].includes(to.name)) {
    ElMessage.info('您已登录，将跳转到首页');
    
    if (authStore.isAdmin) {
      return next({ name: 'Dashboard' });
    } else {
      return next({ name: 'UserHome' });
    }
  }
  
  next();
});

/**
 * 路由守卫 - 全局后置钩子
 * 处理页面切换效果和错误处理
 */
router.afterEach((to, from) => {
  // 可以在这里添加页面切换动画
});

/**
 * 路由错误处理
 */
router.onError((error) => {
  console.error('路由错误:', error);
  ElMessage.error('页面加载失败，请刷新重试');
});

export default router;