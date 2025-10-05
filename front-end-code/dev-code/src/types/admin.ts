/**
 * 管理员相关类型定义
 * 与数据库admin表结构对齐
 */
export interface Admin {
  id: number;
  login_account: string;
  password: string;
  name: string;
  create_user?: number | null;
  create_time?: string | null;
  update_user?: number | null;
  update_time?: string | null;
}

/**
 * 管理员登录凭证
 */
export interface AdminCredentials {
  login_account: string;
  password: string;
}

/**
 * 管理员创建信息
 */
export interface AdminCreate {
  login_account: string;
  password: string;
  name: string;
}

/**
 * 管理员密码重置
 */
export interface AdminPasswordReset {
  id: number;
  new_password: string;
}