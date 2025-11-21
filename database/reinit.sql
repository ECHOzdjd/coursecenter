-- ====================================
-- 快速修复并重新初始化数据库
-- ====================================

-- 删除并重新创建数据库（确保字符集正确）
DROP DATABASE IF EXISTS course_center;
CREATE DATABASE course_center DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE course_center;

-- 设置客户端字符集
SET NAMES utf8mb4;
SET CHARACTER_SET_CLIENT = utf8mb4;
SET CHARACTER_SET_CONNECTION = utf8mb4;
SET CHARACTER_SET_RESULTS = utf8mb4;

-- 现在运行完整的初始化脚本
SOURCE d:/coursecenter/database/init.sql;

SELECT '数据库重新初始化完成！' AS message;
