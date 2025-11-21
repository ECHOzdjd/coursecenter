# 课程中心后端API

## 项目简介

基于Node.js + Express + MySQL的在线课程中心后端API服务。

## 技术栈

- **后端框架**: Express.js 4.x
- **数据库**: MySQL 8.0
- **认证**: JWT (JSON Web Token)
- **密码加密**: bcrypt
- **开发工具**: nodemon

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

修改 `.env` 文件中的数据库配置：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=course_center
JWT_SECRET=your_jwt_secret
```

### 3. 初始化数据库

运行 SQL 脚本初始化数据库：

```bash
mysql -u root -p < ../database/init.sql
```

或者在MySQL客户端中执行：

```sql
source d:/coursecenter/database/init.sql
```

### 4. 启动服务

开发模式（自动重启）：

```bash
npm run dev
```

生产模式：

```bash
npm start
```

服务默认运行在 `http://localhost:3000`

## API文档

### 基础信息

- **基础URL**: `http://localhost:3000/api`
- **认证方式**: Bearer Token (JWT)
- **请求格式**: JSON
- **响应格式**: JSON

### 通用响应格式

成功响应：
```json
{
  "success": true,
  "message": "操作成功",
  "data": {}
}
```

错误响应：
```json
{
  "success": false,
  "message": "错误信息"
}
```

---

## 1. 认证接口 (`/api/auth`)

### 1.1 用户注册

**接口**: `POST /api/auth/register`

**请求体**:
```json
{
  "user_name": "张三",
  "phone": "13900139001",
  "email": "zhangsan@example.com",
  "password": "123456",
  "occupation": "学生",
  "learning_goal": "学习编程"
}
```

**响应**:
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "user_id": 1,
      "user_name": "张三",
      "phone": "13900139001",
      "email": "zhangsan@example.com",
      "role": "learner"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2 用户登录

**接口**: `POST /api/auth/login`

**请求体**:
```json
{
  "phone": "13900139001",
  "password": "123456"
}
```

**响应**: 同注册接口

### 1.3 获取当前用户信息

**接口**: `GET /api/auth/me`

**请求头**:
```
Authorization: Bearer {token}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "user_name": "张三",
    "phone": "13900139001",
    "email": "zhangsan@example.com",
    "role": "learner",
    "occupation": "学生",
    "learning_goal": "学习编程"
  }
}
```

### 1.4 更新用户信息

**接口**: `PUT /api/auth/profile`

**请求头**: 需要认证

**请求体**:
```json
{
  "user_name": "张三三",
  "occupation": "前端工程师",
  "learning_goal": "深入学习React",
  "user_intro": "热爱编程"
}
```

### 1.5 修改密码

**接口**: `PUT /api/auth/password`

**请求头**: 需要认证

**请求体**:
```json
{
  "old_password": "123456",
  "new_password": "654321"
}
```

---

## 2. 课程接口 (`/api/courses`)

### 2.1 获取课程列表（支持筛选和分页）

**接口**: `GET /api/courses`

**查询参数**:
- `page`: 页码（默认1）
- `limit`: 每页数量（默认12）
- `category_id`: 分类ID
- `difficulty`: 难度级别 (beginner/intermediate/advanced)
- `keyword`: 搜索关键词
- `sort`: 排序方式 (popular/rating/newest)

**示例**: `GET /api/courses?page=1&limit=12&category_id=1&difficulty=beginner&sort=popular`

**响应**:
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "course_id": 1,
        "course_name": "Python编程入门",
        "course_desc": "从零开始学习Python编程",
        "cover_img": "https://...",
        "difficulty_level": "beginner",
        "course_duration": 1680,
        "student_count": 12589,
        "rating": 4.8,
        "rating_count": 2456,
        "category_name": "编程开发",
        "teacher_name": "张老师"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 100,
      "totalPages": 9
    }
  }
}
```

### 2.2 获取课程详情

**接口**: `GET /api/courses/:id`

**响应**:
```json
{
  "success": true,
  "data": {
    "course_id": 1,
    "course_name": "Python编程入门",
    "course_desc": "从零开始学习Python编程",
    "cover_img": "https://...",
    "category_name": "编程开发",
    "teacher_name": "张老师",
    "teacher_intro": "高级软件工程师，8年Python开发经验",
    "difficulty_level": "beginner",
    "course_duration": 1680,
    "student_count": 12589,
    "rating": 4.8,
    "rating_count": 2456,
    "chapters": [
      {
        "chapter_id": 1,
        "chapter_title": "第一章：Python基础入门",
        "order_index": 1,
        "videos": [
          {
            "video_id": 1,
            "video_title": "Python简介和开发环境搭建",
            "duration_seconds": 1500,
            "order_index": 1
          }
        ]
      }
    ],
    "teacher_stats": {
      "course_count": 5,
      "total_students": 25000
    }
  }
}
```

### 2.3 获取推荐课程

**接口**: `GET /api/courses/recommended`

**查询参数**:
- `limit`: 数量限制（默认6）

### 2.4 获取热门课程

**接口**: `GET /api/courses/popular`

**查询参数**:
- `limit`: 数量限制（默认6）

### 2.5 获取最新课程

**接口**: `GET /api/courses/newest`

**查询参数**:
- `limit`: 数量限制（默认6）

### 2.6 获取相关课程

**接口**: `GET /api/courses/:id/related`

**查询参数**:
- `limit`: 数量限制（默认4）

### 2.7 报名课程

**接口**: `POST /api/courses/:id/enroll`

**请求头**: 需要认证

**响应**:
```json
{
  "success": true,
  "message": "报名成功"
}
```

### 2.8 收藏/取消收藏课程

**接口**: `POST /api/courses/:id/favorite`

**请求头**: 需要认证

**响应**:
```json
{
  "success": true,
  "message": "收藏成功",
  "data": {
    "is_favorite": 1
  }
}
```

### 2.9 更新学习进度

**接口**: `PUT /api/courses/:id/progress`

**请求头**: 需要认证

**请求体**:
```json
{
  "progress": 35
}
```

### 2.10 获取用户的课程列表

**接口**: `GET /api/courses/user/courses`

**请求头**: 需要认证

**查询参数**:
- `type`: 类型 (all/learning/favorite/completed)

---

## 3. 分类接口 (`/api/categories`)

### 3.1 获取所有分类

**接口**: `GET /api/categories`

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "category_id": 1,
      "category_name": "编程开发",
      "parent_category_id": null,
      "category_icon": "fa-code",
      "course_count": 1200
    }
  ]
}
```

### 3.2 获取顶级分类

**接口**: `GET /api/categories/top`

### 3.3 获取分类详情

**接口**: `GET /api/categories/:id`

**响应**:
```json
{
  "success": true,
  "data": {
    "category_id": 1,
    "category_name": "编程开发",
    "parent_category_id": null,
    "category_icon": "fa-code",
    "course_count": 1200,
    "sub_categories": [
      {
        "category_id": 7,
        "category_name": "Python开发",
        "category_icon": "fa-python",
        "course_count": 300
      }
    ]
  }
}
```

---

## 4. 评价接口 (`/api/reviews`)

### 4.1 获取课程评价列表

**接口**: `GET /api/reviews/course/:id`

**查询参数**:
- `page`: 页码（默认1）
- `limit`: 每页数量（默认10）

**响应**:
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "review_id": 1,
        "rating": 5,
        "review_content": "非常适合零基础学习者的课程！",
        "created_at": "2024-11-15T10:00:00.000Z",
        "user_id": 5,
        "user_name": "李四",
        "avatar_url": "https://...",
        "occupation": "前端工程师"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### 4.2 添加课程评价

**接口**: `POST /api/reviews/course/:id`

**请求头**: 需要认证

**请求体**:
```json
{
  "rating": 5,
  "review_content": "课程很棒，讲解清晰！"
}
```

### 4.3 更新评价

**接口**: `PUT /api/reviews/:reviewId`

**请求头**: 需要认证

**请求体**:
```json
{
  "rating": 4,
  "review_content": "更新后的评价内容"
}
```

### 4.4 删除评价

**接口**: `DELETE /api/reviews/:reviewId`

**请求头**: 需要认证

---

## 错误代码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或认证失败 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 测试账号

数据库初始化后会自动创建测试账号：

| 角色 | 手机号 | 密码 | 说明 |
|------|--------|------|------|
| 学员 | 13900139001 | 123456 | 张三 |
| 学员 | 13900139002 | 123456 | 李四 |
| 讲师 | 13800138001 | 123456 | 张老师 |
| 讲师 | 13800138002 | 123456 | 李教授 |
| 讲师 | 13800138003 | 123456 | 王工程师 |

## 项目结构

```
backend/
├── config/
│   └── database.js          # 数据库配置
├── controllers/
│   ├── authController.js    # 认证控制器
│   ├── courseController.js  # 课程控制器
│   ├── categoryController.js # 分类控制器
│   └── reviewController.js  # 评价控制器
├── middleware/
│   ├── auth.js              # 认证中间件
│   └── errorHandler.js      # 错误处理中间件
├── routes/
│   ├── auth.js              # 认证路由
│   ├── courses.js           # 课程路由
│   ├── categories.js        # 分类路由
│   └── reviews.js           # 评价路由
├── uploads/                 # 文件上传目录
├── .env                     # 环境变量配置
├── .env.example             # 环境变量示例
├── package.json             # 项目配置
└── server.js                # 服务器入口文件
```

## 注意事项

1. **密码安全**: 生产环境请修改 `.env` 中的 `JWT_SECRET` 为强密码
2. **CORS配置**: 根据前端地址配置CORS策略
3. **文件上传**: 需要创建 `uploads` 目录用于存储上传的文件
4. **数据库**: 确保MySQL版本 >= 8.0，支持JSON和其他新特性

## 开发建议

1. 使用 Postman 或类似工具测试API
2. 查看控制台日志排查问题
3. 开发时使用 `npm run dev` 自动重启服务
4. 生产环境建议使用 PM2 管理进程

## License

MIT
