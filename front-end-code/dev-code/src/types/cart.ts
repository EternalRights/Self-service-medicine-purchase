// src/types/cart.ts
/**
 * 购物车相关类型定义
 * 与数据库cart表结构对齐
 */
import type { Drug } from './drug';

export interface CartItem {
  id: number;
  user_id: number;
  drug_id: number;
  quantity: number;
  create_time?: string | null;
  update_time?: string | null;
}

/**
 * 购物车项目详情（包含药品信息）
 */
export interface CartItemDetail extends CartItem {
  drug: Drug;
}

/**
 * 购物车添加/更新项目
 */
export interface CartItemUpdate {
  drug_id: number;
  quantity: number;
}