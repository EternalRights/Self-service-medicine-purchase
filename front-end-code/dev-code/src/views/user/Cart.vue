<template>
  <div class="cart-container">
    <!-- <h1 class="cart-title">购物车</h1> -->
    
    <!-- 返回按钮 -->
    <div class="header-section">
      <el-button icon="Back" @click="goBack">返回</el-button>
      <h1 class="cart-title">购物车</h1>
    </div>

    <!-- 统计数据区域 -->
    <div class="cart-stats">
      <div class="stat-item">已选商品：{{ cartStore.totalItems }}件</div>
      <div class="stat-item">商品总金额：¥{{ cartStore.totalAmount }}</div>
    </div>
    
    <!-- 商品列表 -->
    <div v-if="cartStore.cartItems.length > 0" class="cart-table">
      <el-table :data="cartStore.cartItems" style="width: 100%">
        <el-table-column label="商品信息" width="350">
          <template #default="{ row }">
            <div class="drug-info">
              <el-image 
                :src="row.drug.image || noDrugsImg" 
                class="drug-image"
                fit="cover"
              />
              <div class="drug-details">
                <div class="drug-name">{{ row.drug.generic_name }}</div>
                <div class="drug-spec">{{ row.drug.specification }}</div>
                <div v-if="row.drug.category === 2" class="prescription-tag">
                  <el-tag type="danger" size="small">处方药</el-tag>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="单价" width="120" align="center">
          <template #default="{ row }">
            <div class="drug-price">¥{{ row.drug.price?.toFixed(2) || '0.00' }}</div>
          </template>
        </el-table-column>
        
        <el-table-column label="数量" width="180" align="center">
          <template #default="{ row }">
            <div class="quantity-control">
              <el-button 
                :disabled="row.quantity <= 1" 
                @click="cartStore.decreaseQuantity(row.drug.id)"
              >-</el-button>
              <el-input 
                v-model.number="row.quantity" 
                @change="cartStore.updateQuantity(row.drug.id, row.quantity)"
                type="number"
                min="1"
                :max="row.drug.stock_quantity"
                class="quantity-input"
              />
              <el-button @click="cartStore.increaseQuantity(row.drug.id)">+</el-button>
            </div>
            <div class="stock-info">库存: {{ row.drug.stock_quantity }}件</div>
          </template>
        </el-table-column>
        
        <el-table-column label="小计" width="120" align="center">
          <template #default="{ row }">
            <div class="subtotal">¥{{ (row.drug.price * row.quantity).toFixed(2) }}</div>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-tooltip content="移除此商品" placement="top">
              <el-button 
                type="danger" 
                :icon="Delete" 
                circle 
                @click="cartStore.removeItem(row.drug.id)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 空购物车提示 -->
    <div v-else class="empty-cart">
      <img :src="noDrugsImg" alt="购物车为空" class="empty-image">
      <p class="empty-text">您的购物车是空的</p>
      <el-button type="primary" @click="goToHome">去逛逛</el-button>
    </div>
    
    <!-- 结算区域 -->
    <div class="checkout-section">
      <div class="checkout-notice">
        结算功能将于后续版本开放，敬请期待！
      </div>
      <el-button 
        type="primary" 
        class="checkout-button"
        :disabled="cartStore.cartItems.length === 0 || !appStore.isOpen"
        :loading="cartStore.loading"
        @click="cartStore.checkout"
      >
        去结算
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { Delete } from '@element-plus/icons-vue';
import { useCartStore } from '@/stores/cart';
import { useAppStore } from '@/stores/app';
import { useRouter } from 'vue-router';
import noDrugsImg from '@/assets/no-drugs.png'

const cartStore = useCartStore();
const appStore = useAppStore();
const router = useRouter();

const goBack = () => {
  router.go(-1); // 返回上一页
};

const goToHome = () => {
  router.push('/user/home');
};

</script>

<style scoped>
.cart-container {
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

.cart-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.cart-stats {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.stat-item {
  font-size: 16px;
  font-weight: bold;
}

.drug-info {
  display: flex;
  align-items: center;
}

.drug-image {
  width: 80px;
  height: 80px;
  margin-right: 15px;
  border-radius: 4px;
  border: 1px solid #eee;
}

.drug-details {
  flex: 1;
}

.drug-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.drug-spec {
  font-size: 13px;
  color: #909399;
  margin-bottom: 5px;
}

.prescription-tag {
  margin-top: 5px;
}

.drug-price {
  font-weight: bold;
  color: #e1251b;
}

.quantity-control {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
}

.quantity-control button {
  width: 32px;
  height: 32px;
}

.quantity-input {
  width: 60px;
  margin: 0 5px;
}

.stock-info {
  font-size: 12px;
  color: #909399;
  text-align: center;
}

.subtotal {
  font-weight: bold;
  color: #e1251b;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.empty-image {
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-text {
  font-size: 16px;
  color: #909399;
  margin-bottom: 20px;
}

.checkout-section {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.checkout-notice {
  margin-bottom: 15px;
  color: #e6a23c;
  font-size: 14px;
}

.checkout-button {
  width: 200px;
  height: 50px;
  font-size: 18px;
}
</style>