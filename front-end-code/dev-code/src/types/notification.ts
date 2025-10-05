// src/types/notification.ts
/**
 * 通知消息相关类型定义
 * 与数据库notification表结构对齐
 */
export interface Notification {
  id: number;
  user_id: number;
  message_type: MessageType;
  title: string;
  content: string;
  is_processed: boolean;
  create_time?: string | null;
  processed_time?: string | null;
}

/**
 * 消息类型枚举
 */
export enum MessageType {
  MEDICAL_CONSULT = 1, // 用药咨询
  ORDER_CREATED = 2    // 订单生成
}

/**
 * 消息创建信息
 */
export interface NotificationCreate {
  user_id: number;
  message_type: MessageType;
  title: string;
  content: string;
}

/**
 * 消息处理状态更新
 */
export interface NotificationStatusUpdate {
  notification_id: number;
  is_processed: boolean;
}