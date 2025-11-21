-- ====================================
-- 字符集修复脚本
-- ====================================
-- 此脚本用于修复数据库字符编码问题

USE course_center;

-- 修改数据库字符集
ALTER DATABASE course_center CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 修改所有表的字符集
ALTER TABLE t_user CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE t_course_category CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE t_course CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE t_course_chapter CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE t_course_video CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE t_user_course CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE t_course_review CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 显示修复结果
SELECT 
    TABLE_NAME,
    TABLE_COLLATION
FROM 
    information_schema.TABLES
WHERE 
    TABLE_SCHEMA = 'course_center'
ORDER BY 
    TABLE_NAME;

SELECT '字符集修复完成！现在可以重新导入数据' AS message;
