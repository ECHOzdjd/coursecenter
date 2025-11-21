@echo off
chcp 65001 >nul
echo ==========================================
echo   修复数据库字符集并重新初始化
echo ==========================================
echo.

echo [步骤1] 删除并重新创建数据库...
mysql -u root -pwywywy678 -e "DROP DATABASE IF EXISTS course_center; CREATE DATABASE course_center DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo.
echo [步骤2] 导入数据库结构和数据...
mysql -u root -pwywywy678 --default-character-set=utf8mb4 course_center < init.sql

echo.
echo [步骤3] 验证字符集配置...
mysql -u root -pwywywy678 -e "SELECT SCHEMA_NAME, DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'course_center';"

echo.
echo [步骤4] 检查表是否创建成功...
mysql -u root -pwywywy678 -e "USE course_center; SHOW TABLES;"

echo.
echo ==========================================
echo   数据库初始化完成！
echo ==========================================
echo.
pause
