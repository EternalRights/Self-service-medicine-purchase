// src/stores/cart.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import { MessageType } from '@/types/notification';
import { get, post } from '@/utils/request';

export const useCartStore = defineStore('cart', () => {
  const appStore = useAppStore();
  const authStore = useAuthStore();
  const notificationStore = useNotificationStore();
  
  const cartItems = ref([]);
  const loading = ref(false);
  
  // 计算总商品数量
  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0);
  });
  
  // 计算总金额
  const totalAmount = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.drug.price * item.quantity);
    }, 0).toFixed(2);
  });
  
  // 添加商品到购物车
  const addItem = (drug) => {
    if (!appStore.isOpen) {
      ElMessage.warning('当前暂停营业，无法添加商品');
      return;
    }
    
    if (drug.stock_quantity <= 0) {
      ElMessage.warning('该商品已售罄');
      return;
    }
    
    const existingItem = cartItems.value.find(item => item.drug.id === drug.id);
    
    if (existingItem) {
      // 商品已存在，增加数量
      if (existingItem.quantity < drug.stock_quantity) {
        existingItem.quantity += 1;
        ElMessage.success(`已增加 ${drug.generic_name} 数量`);
      } else {
        ElMessage.warning('已达到库存上限');
      }
    } else {
      // 添加新商品
      cartItems.value.push({
        drug: { ...drug },
        quantity: 1
      });
      ElMessage.success(`已添加 ${drug.generic_name} 到购物车`);
    }
  };
  
  // 更新商品数量
  const updateQuantity = (drugId, newQuantity) => {
    const item = cartItems.value.find(item => item.drug.id === drugId);
    
    if (item) {
      if (newQuantity <= 0) {
        // 数量为0或负数，则移除商品
        removeItem(drugId);
      } else if (newQuantity > item.drug.stock_quantity) {
        ElMessage.warning(`库存不足，最多可购买 ${item.drug.stock_quantity} 件`);
        item.quantity = item.drug.stock_quantity;
      } else {
        item.quantity = newQuantity;
      }
    }
  };
  
  // 增加商品数量
  const increaseQuantity = (drugId) => {
    const item = cartItems.value.find(item => item.drug.id === drugId);
    
    if (item) {
      if (item.quantity < item.drug.stock_quantity) {
        item.quantity += 1;
      } else {
        ElMessage.warning('已达到库存上限');
      }
    }
  };
  
  // 减少商品数量
  const decreaseQuantity = async (drugId) => {
    const item = cartItems.value.find(item => item.drug.id === drugId);
    
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        // 数量为1，再减就为0，需要确认删除
        try {
          await ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });
          removeItem(drugId);
        } catch (error) {
          // 用户取消，不做操作
        }
      }
    }
  };
  
  // 移除商品
  const removeItem = (drugId) => {
    const index = cartItems.value.findIndex(item => item.drug.id === drugId);
    
    if (index !== -1) {
      const removedItem = cartItems.value.splice(index, 1)[0];
      ElMessage.success(`已移除 ${removedItem.drug.generic_name}`);
    }
  };
  
  // 清空购物车
  const clearCart = () => {
    cartItems.value = [];
  };
  
  // 结算购物车
  const checkout = async () => {
    if (!appStore.isOpen) {
      ElMessage.warning('当前暂停营业，无法结算');
      return;
    }
    
    if (cartItems.value.length === 0) {
      ElMessage.warning('购物车为空');
      return;
    }
    
    try {
      loading.value = true;
      
      // 实际API调用
      const orderData = {
        user_id: authStore.userId,
        items: cartItems.value.map(item => ({
          drug_id: item.drug.id,
          quantity: item.quantity,
          unit_price: item.drug.price
        }))
      };
      
      // 调用后端API创建订单
      const response = await post('/orders', orderData);
      
      // 创建订单通知
      const itemsText = cartItems.value.map(item => 
        `${item.drug.generic_name} x ${item.quantity}`
      ).join(', ');
      
      notificationStore.addNotification({
        title: '用户购物完成',
        content: `用户 ${authStore.userName} 完成一笔订单。订单号: ${response.id}, 总金额: ¥${response.total_amount}`,
        messageType: MessageType.ORDER_CREATED
      });
      
      // 清空购物车
      clearCart();
      
      ElMessage.success('结算成功');
    } catch (error) {
      ElMessage.error('结算失败: ' + error.message);
    } finally {
      loading.value = false;
    }
  };
  
  // 从后端加载购物车数据
  const loadCart = async () => {
    try {
      loading.value = true;
      const response = await get('/cart');
      cartItems.value = response.items;
    } catch (error) {
      ElMessage.error('加载购物车失败: ' + error.message);
    } finally {
      loading.value = false;
    }
  };
  
  // 同步购物车到后端
  const syncCart = async () => {
    try {
      loading.value = true;
      await post('/cart/sync', {
        items: cartItems.value.map(item => ({
          drug_id: item.drug.id,
          quantity: item.quantity
        }))
      });
    } catch (error) {
      ElMessage.error('同步购物车失败: ' + error.message);
    } finally {
      loading.value = false;
    }
  };
  
  return {
    cartItems,
    totalItems,
    totalAmount,
    loading,
    addItem,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    checkout,
    loadCart,
    syncCart
  };
});