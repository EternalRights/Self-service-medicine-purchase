/**
 * 用户相关类型定义
 * 与数据库user表结构对齐
 */
export interface User {
  id: number;
  phone_number: string;
  password: string;
  name: string;
  gender?: Gender | null;
  age?: number | null;
  create_time?: string | null;
  update_time?: string | null;
}

/**
 * 性别枚举
 */
export enum Gender {
  MALE = 1,
  FEMALE = 2,
  OTHER = 3
}

/**
 * 用户登录凭证
 */
export interface UserCredentials {
  phone_number: string;
  password: string;
}

/**
 * 用户注册信息
 */
export interface UserRegistration extends UserCredentials {
  name: string;
}

/**
 * 用户个人信息更新
 */
export interface UserProfileUpdate {
  name: string;
  gender?: Gender;
  age?: number;
}