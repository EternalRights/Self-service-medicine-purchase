// src/types/app.ts
/**
 * 应用全局状态类型
 */
export interface AppState {
  businessStatus: BusinessStatus;
}

/**
 * 营业状态枚举
 */
export enum BusinessStatus {
  OPEN = '营业中',
  CLOSED = '暂停营业'
}

/**
 * 营业状态更新
 */
export interface BusinessStatusUpdate {
  status: BusinessStatus;
}