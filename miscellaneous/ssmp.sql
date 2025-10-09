-- 创建数据库
CREATE DATABASE IF NOT EXISTS ssmp;

USE ssmp;

-- 1. 用户表
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    phone_number VARCHAR(20) NOT NULL UNIQUE COMMENT '手机号',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    name VARCHAR(50) NOT NULL COMMENT '姓名（用户名）',
    gender INT DEFAULT NULL COMMENT '性别：1-男，2-女，3-其他',
    age INT DEFAULT NULL COMMENT '年龄',
    create_time DATETIME COMMENT '创建时间',
    update_time DATETIME COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 2. 管理员表
CREATE TABLE admin (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '管理员ID',
    login_account VARCHAR(50) NOT NULL UNIQUE COMMENT '登录账号',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    name VARCHAR(50) NOT NULL COMMENT '姓名（用户名）',
    create_user INT DEFAULT NULL COMMENT '创建用户ID',
    create_time DATETIME COMMENT '创建时间',
    update_user INT DEFAULT NULL COMMENT '更新用户ID',
    update_time DATETIME COMMENT '更新时间',
    FOREIGN KEY (create_user) REFERENCES admin(id),
    FOREIGN KEY (update_user) REFERENCES admin(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

-- 3. 药品表
CREATE TABLE drug (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '药品ID',
    generic_name VARCHAR(200) NOT NULL COMMENT '药品通用名',
    image VARCHAR(500) DEFAULT NULL COMMENT '图片路径',
    category INT NOT NULL COMMENT '药品分类：1-非处方药(OTC)，2-处方药(Rx)，3-医疗器械，4-保健养生',
    specification VARCHAR(100) DEFAULT NULL COMMENT '规格',
    manufacturer VARCHAR(200) DEFAULT NULL COMMENT '厂家',
    composition TEXT DEFAULT NULL COMMENT '成分',
    indications TEXT DEFAULT NULL COMMENT '适应症（功能主治）',
    usage_dosage TEXT DEFAULT NULL COMMENT '用法用量',
    precautions TEXT DEFAULT NULL COMMENT '注意事项',
    expiry_date DATE DEFAULT NULL COMMENT '有效期',
    shelf_status INT DEFAULT 1 COMMENT '上架状态：1-上架，2-下架'
    stock_quantity INT DEFAULT 0 COMMENT '库存数量',
    batch_number VARCHAR(100) DEFAULT NULL COMMENT '生产批号',
    create_user INT NOT NULL COMMENT '创建用户ID',
    create_time DATETIME COMMENT '创建时间',
    update_user INT NOT NULL COMMENT '更新用户ID',
    update_time DATETIME COMMENT '更新时间',
    FOREIGN KEY (create_user) REFERENCES admin(id),
    FOREIGN KEY (update_user) REFERENCES admin(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='药品表';

-- 4. 购物车表
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '购物车ID',
    user_id INT NOT NULL COMMENT '用户ID',
    drug_id INT NOT NULL COMMENT '药品ID',
    quantity INT NOT NULL DEFAULT 1 COMMENT '药品数量',
    create_time DATETIME COMMENT '创建时间',
    update_time DATETIME COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (drug_id) REFERENCES drug(id),
    UNIQUE KEY unique_user_drug (user_id, drug_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';

-- 5. 订单表
CREATE TABLE `order` (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '订单号（ID）',
    user_id INT NOT NULL COMMENT '用户ID（创建用户）',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '总金额',
    order_status INT NOT NULL DEFAULT 1 COMMENT '订单状态：1-待确认，2-备货中，3-待取货，4-已完成',
    create_time DATETIME COMMENT '下单时间（创建时间）',
    FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 6. 订单项表
CREATE TABLE order_item (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '订单项ID',
    order_id INT NOT NULL COMMENT '订单ID',
    drug_id INT NOT NULL COMMENT '药品ID',
    quantity INT NOT NULL COMMENT '购买数量',
    unit_price DECIMAL(8,2) NOT NULL COMMENT '购买时单价',
    subtotal_amount DECIMAL(10,2) NOT NULL COMMENT '小计金额',
    FOREIGN KEY (order_id) REFERENCES `order`(id),
    FOREIGN KEY (drug_id) REFERENCES drug(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单项表';

-- 7. 通知栏消息表
CREATE TABLE notification (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '消息ID',
    user_id INT NOT NULL COMMENT '用户ID',
    message_type INT NOT NULL COMMENT '消息类型：1-用药咨询，2-订单生成'
    title VARCHAR(200) NOT NULL COMMENT '消息标题',
    content TEXT NOT NULL COMMENT '消息内容',
    is_processed TINYINT(1) DEFAULT 0 COMMENT '是否已处理：0-未处理，1-已处理',
    create_time DATETIME COMMENT '创建时间',
    processed_time DATETIME DEFAULT NULL COMMENT '处理时间',
    FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知栏消息表';