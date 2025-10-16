# Self-service-medicine-purchase

基于SpringBoot的线下药店智能管理系统。支持顾客自助选购药品（区分OTC与Rx），并为药师提供实时订单处理、用药咨询响应及库存管理功能，实现线下药店的数字化服务协同。

## 项目结构

项目分为前后端两个主要部分：

### 后端（SpringBoot）

后端采用SpringBoot框架构建，包含以下模块：

- **ssmp-common**: 通用组件模块，包含常量、上下文、枚举、工具类等
- **ssmp-pojo**: 数据传输对象模块，包含实体类、查询参数类等
- **ssmp-server**: 核心服务模块，包含控制器、服务接口及实现、数据访问层等

主要功能模块：

- 药品管理：支持药品信息维护、库存记录查询
- 用户认证：基于JWT的用户鉴权系统
- 订单处理：实时订单管理与状态更新
- 文件上传：基于阿里云OSS的文件存储服务

### 前端（Vue）

前端采用Vue框架构建，包含以下核心组件：

- **布局组件**：AdminLayout, AuthLayout, UserLayout
- **页面组件**：
  - 管理员：Dashboard, DrugManagement, Inventory, OrderManagement
  - 用户：Home, DrugDetail, Cart, Profile
  - 认证：Login, Register, AdminLogin

## 功能特性

- 药品分类展示（OTC/Rx）
- 药品搜索与筛选
- 购物车管理
- 用户登录/注册
- 实时订单通知
- 药品库存监控
- 数据可视化仪表盘

## 技术栈

**后端**：
- SpringBoot 3.x
- MyBatis Plus
- JWT鉴权
- 阿里云OSS
- MySQL
- Redis

**前端**：
- Vue 3
- Element Plus
- WebSocket实时通信
- Vite构建工具

## 安装指南

### 后端

1. 安装JDK 21
2. 安装Maven
3. 配置MySQL数据库
4. 配置阿里云OSS参数（endpoint, accessKeyId, accessKeySecret, bucketName）
5. 执行`mvn install`构建项目

### 前端

1. 安装Node.js
2. 安装项目依赖：`npm install`
3. 启动开发服务器：`npm run dev`

## API文档

### 认证接口
- POST /auth/user/login - 用户登录

### 药品接口
- GET /drugs - 获取药品列表
- GET /drugs/{id} - 获取药品详情
- GET /drugs/{drugId}/inventory-records - 获取库存记录

### 文件上传接口
- POST /upload - 文件上传

## 贡献指南

1. Fork项目
2. 创建feature分支
3. 提交代码
4. 创建Pull Request

## 许可证

本项目采用Apache-2.0协议。
