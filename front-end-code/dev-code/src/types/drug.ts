/**
 * 药品相关类型定义
 * 与数据库drug表结构对齐
 */
export interface Drug {
  id: number;
  generic_name: string;
  image?: string | null;
  category: DrugCategory;
  specification?: string | null;
  manufacturer?: string | null;
  composition?: string | null;
  indications?: string | null;
  usage_dosage?: string | null;
  precautions?: string | null;
  expiry_date?: string | null; // ISO日期字符串
  shelf_status: ShelfStatus;
  stock_quantity: number;
  batch_number?: string | null;
  create_user: number;
  create_time?: string | null;
  update_user: number;
  update_time?: string | null;
}

/**
 * 药品分类枚举
 */
export enum DrugCategory {
  OTC = 1,      // 非处方药
  RX = 2,       // 处方药
  MEDICAL = 3,  // 医疗器械
  HEALTH = 4    // 保健养生
}

/**
 * 药品上架状态枚举
 */
export enum ShelfStatus {
  ON_SHELF = 1, // 上架
  OFF_SHELF = 2 // 下架
}

/**
 * 药品创建信息
 */
export type DrugCreate = Omit<Drug, 'id' | 'create_time' | 'update_time'>;

/**
 * 药品更新信息
 */
export type DrugUpdate = Partial<Omit<Drug, 'id' | 'create_user' | 'create_time' | 'update_time'>>;

/**
 * 药品筛选参数
 */
export interface DrugFilterParams {
  category?: DrugCategory;
  shelf_status?: ShelfStatus;
  keyword?: string;
  sort?: 'default' | 'price_asc' | 'price_desc';
}