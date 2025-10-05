// src/types/order.ts
import type { Drug } from './drug';

/**
 * 订单相关类型定义
 * 与数据库order和order_item表结构对齐
 */
export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  order_status: OrderStatus;
  create_time?: string | null;
}

/**
 * 订单状态枚举
 */
export enum OrderStatus {
  PENDING = 1,     // 待确认
  PREPARING = 2,   // 备货中
  READY = 3,      // 待取货
  COMPLETED = 4   // 已完成
}

/**
 * 订单项
 */
export interface OrderItem {
  id: number;
  order_id: number;
  drug_id: number;
  quantity: number;
  unit_price: number;
  subtotal_amount: number;
}

/**
 * 订单详情（包含订单项和药品信息）
 */
export interface OrderDetail extends Order {
  items: Array<OrderItem & { drug: Drug }>; // 正确引用了Drug类型
}

/**
 * 订单状态更新
 */
export interface OrderStatusUpdate {
  order_id: number;
  new_status: OrderStatus;
}