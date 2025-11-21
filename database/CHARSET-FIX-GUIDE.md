# 数据库字符集问题修复指南

## 问题原因
数据库初始化时出现中文乱码错误，提示：
```
ERROR 1366 (HY000): Incorrect string value
```

这是因为MySQL字符集配置不正确导致的。

---

## ✅ 解决方案（3种方式任选1种）

### 方式1：在MySQL命令行中直接执行（推荐）

在你已经打开的MySQL终端中，依次执行以下命令：

```sql
-- 1. 删除并重新创建数据库
DROP DATABASE IF EXISTS course_center;
CREATE DATABASE course_center DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE course_center;

-- 2. 设置会话字符集
SET NAMES utf8mb4;
SET CHARACTER_SET_CLIENT = utf8mb4;
SET CHARACTER_SET_CONNECTION = utf8mb4;
SET CHARACTER_SET_RESULTS = utf8mb4;

-- 3. 重新导入数据
source d:/coursecenter/database/init.sql;

-- 4. 验证是否成功
SHOW TABLES;
SELECT COUNT(*) AS total_courses FROM t_course;
SELECT COUNT(*) AS total_users FROM t_user;
```

---

### 方式2：使用批处理脚本（最简单）

1. 退出MySQL（输入 `exit` 或 `quit`）
2. 双击运行：`d:\coursecenter\database\init-db.bat`
3. 等待完成

---

### 方式3：手动命令行（适合自定义）

退出MySQL后，在PowerShell中执行：

```powershell
# 进入数据库目录
cd d:\coursecenter\database

# 重新创建数据库
mysql -u root -pwywywy678 -e "DROP DATABASE IF EXISTS course_center; CREATE DATABASE course_center DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 导入数据（使用正确的字符集）
mysql -u root -pwywywy678 --default-character-set=utf8mb4 course_center -e "source d:/coursecenter/database/init.sql"

# 验证
mysql -u root -pwywywy678 -e "USE course_center; SHOW TABLES;"
```

---

## 🔍 验证是否修复成功

在MySQL中执行：

```sql
USE course_center;

-- 检查数据库字符集
SHOW CREATE DATABASE course_center;

-- 检查表字符集
SHOW CREATE TABLE t_user;

-- 查看数据是否正常
SELECT user_name, phone FROM t_user LIMIT 3;
SELECT category_name FROM t_course_category LIMIT 3;
SELECT course_name FROM t_course LIMIT 3;
```

如果能看到正确的中文，说明修复成功！

---

## 📊 预期结果

修复成功后，应该看到：

```
+----------------+----------------+
| user_name      | phone          |
+----------------+----------------+
| 张三           | 13900139001    |
| 李四           | 13900139002    |
| 王五           | 13900139003    |
+----------------+----------------+
```

---

## 🚨 如果仍然失败

### 检查MySQL配置文件

找到MySQL配置文件（通常是 `my.ini` 或 `my.cnf`），添加或修改：

```ini
[client]
default-character-set=utf8mb4

[mysql]
default-character-set=utf8mb4

[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
```

修改后重启MySQL服务：

```powershell
# 停止MySQL服务
net stop MySQL80

# 启动MySQL服务
net start MySQL80
```

---

## 💡 推荐操作步骤

1. **现在**：直接在你的MySQL终端中执行方式1的SQL命令
2. 输入 `exit` 退出MySQL
3. 然后继续启动后端服务测试

---

## 📝 快速命令（复制粘贴）

在你的MySQL终端中，复制粘贴以下完整命令：

```sql
DROP DATABASE IF EXISTS course_center;
CREATE DATABASE course_center DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE course_center;
SET NAMES utf8mb4;
source d:/coursecenter/database/init.sql;
SELECT '数据库初始化完成！' AS status;
SHOW TABLES;
```

执行完成后应该看到7个表：
- t_course
- t_course_category
- t_course_chapter
- t_course_review
- t_course_video
- t_user
- t_user_course

✅ 看到这些表就说明成功了！
