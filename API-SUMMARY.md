# 课程中心API接口文档 - 快速参考

## 🔑 认证说明

除了公开接口外，其他接口需要在请求头中携带JWT Token：
```
Authorization: Bearer {your_token}
```

---

## 📋 接口列表

> **说明**：🔓 = 公开接口（无需登录）| 🔐 = 需要登录认证

### 1️⃣ 认证接口 (/api/auth) - ✅ 已实现

| 接口 | 方法 | 认证 | 说明 | 状态 |
|------|------|------|------|------|
| `/auth/register` | POST | 🔓 | 用户注册（学生/教师） | ✅ |
| `/auth/login` | POST | 🔓 | 用户登录（学生/教师） | ✅ |
| `/auth/me` | GET | 🔐 | 获取当前用户信息 | ✅ |
| `/auth/profile` | PUT | 🔐 | 更新用户信息（含个人简介） | ✅ |
| `/auth/password` | PUT | 🔐 | 修改密码 | ✅ |

### 2️⃣ 课程接口 (/api/courses) - ✅ 已实现

| 接口 | 方法 | 认证 | 说明 | 状态 |
|------|------|------|------|------|
| `/courses` | GET | 🔓 | 获取课程列表（支持搜索、分类、分页） | ✅ |
| `/courses/:id` | GET | 🔓 | 获取课程详情（含大纲、讲师、章节视频） | ✅ |
| `/courses/recommended` | GET | 🔓 | 获取推荐课程（支持 limit 参数） | ✅ |
| `/courses/popular` | GET | 🔓 | 获取热门课程（按评分排序） | ✅ |
| `/courses/newest` | GET | 🔓 | 获取最新课程（按上线时间排序） | ✅ |
| `/courses/:id/related` | GET | 🔓 | 获取相关课程（按标签推荐） | ✅ |
| `/courses/:id/enroll` | POST | 🔐 | 报名课程 | ✅ |
| `/courses/:id/favorite` | POST | 🔐 | 收藏/取消收藏 | ✅ |
| `/courses/:id/progress` | PUT | 🔐 | 更新学习进度 | ✅ |
| `/courses/user/courses` | GET | 🔐 | 获取用户已报名课程列表 | ✅ |

### 3️⃣ 分类接口 (/api/categories) - ✅ 已实现

| 接口 | 方法 | 认证 | 说明 | 状态 |
|------|------|------|------|------|
| `/categories` | GET | 🔓 | 获取所有分类（用于课程分类展示） | ✅ |
| `/categories/top` | GET | 🔓 | 获取顶级分类 | ✅ |
| `/categories/:id` | GET | 🔓 | 获取分类详情 | ✅ |

### 4️⃣ 评价接口 (/api/reviews) - ✅ 已实现

| 接口 | 方法 | 认证 | 说明 | 状态 |
|------|------|------|------|------|
| `/reviews/course/:id` | GET | 🔓 | 获取课程评价列表（学生评价展示） | ✅ |
| `/reviews/course/:id` | POST | 🔐 | 添加课程评价 | ✅ |
| `/reviews/:reviewId` | PUT | 🔐 | 更新评价 | ✅ |
| `/reviews/:reviewId` | DELETE | 🔐 | 删除评价 | ✅ |

### 5️⃣ 讲师接口 (/api/teachers) - ✅ 已实现

| 接口 | 方法 | 认证 | 说明 | 状态 |
|------|------|------|------|------|
| `/teachers/top` | GET | 🔓 | 获取明星讲师（高评分讲师及统计） | ✅ |

**接口统计：共 24 个接口，全部已实现并测试通过 ✅**

---

## 🚀 常用接口示例

### 登录获取Token

```javascript
// 请求
POST /api/auth/login
{
  "phone": "13900139001",
  "password": "123456"
}

// 响应
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": { /* 用户信息 */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 获取课程列表（带筛选）

```javascript
GET /api/courses?page=1&limit=12&category_id=1&difficulty=beginner&keyword=Python&sort=popular

// 查询参数说明：
// - page: 页码，默认1
// - limit: 每页数量，默认12
// - category_id: 分类ID
// - difficulty: 难度 (beginner/intermediate/advanced)
// - keyword: 搜索关键词（支持模糊搜索课程名称和描述）
// - sort: 排序方式 (popular/rating/newest)

// 响应
{
  "success": true,
  "data": {
    "courses": [...],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 100,
      "totalPages": 9
    }
  }
}
```

### 获取课程详情

```javascript
GET /api/courses/1

// 响应包含：
// - 课程基本信息
// - 讲师信息
// - 章节和视频列表
// - 讲师统计数据
```

### 报名课程

```javascript
POST /api/courses/1/enroll
Headers: Authorization: Bearer {token}

// 成功响应
{
  "success": true,
  "message": "报名成功"
}
```

### 添加课程评价

```javascript
POST /api/reviews/course/1
Headers: Authorization: Bearer {token}
{
  "rating": 5,
  "review_content": "课程很棒！"
}

// 响应
{
  "success": true,
  "message": "评价添加成功",
  "data": {
    "review_id": 5,  // ← 保存此ID用于后续更新/删除
    "user_id": 6,
    "course_id": 1,
    "rating": 5,
    "review_content": "课程很棒！",
    "review_time": "2025-11-19T..."
  }
}
```

### 更新课程评价

```javascript
// 使用添加评价时返回的 review_id
PUT /api/reviews/5
Headers: Authorization: Bearer {token}
{
  "rating": 4,
  "review_content": "修改后的评价内容"
}

// 响应
{
  "success": true,
  "message": "评价更新成功"
}
```

### 删除课程评价

```javascript
DELETE /api/reviews/5
Headers: Authorization: Bearer {token}

// 响应
{
  "success": true,
  "message": "评价删除成功"
}
```

### 获取明星讲师

```javascript
GET /api/teachers/top?limit=6

// 查询参数：
// - limit: 返回讲师数量，默认6

// 响应
{
  "success": true,
  "data": [
    {
      "user_id": 2,
      "user_name": "李教授",
      "avatar_url": "https://...",
      "user_intro": "数据科学领域权威，前Google工程师",
      "occupation": "数据科学家",
      "course_count": 2,        // 课程数量
      "avg_rating": 4.9,        // 平均评分
      "total_students": 4700,   // 总学生数
      "total_reviews": 1981     // 总评价数
    },
    {
      "user_id": 1,
      "user_name": "张老师",
      "avatar_url": null,
      "user_intro": "高级软件工程师，8年Python开发经验",
      "occupation": "Python开发工程师",
      "course_count": 2,
      "avg_rating": 4.9,
      "total_students": 16689,
      "total_reviews": 4312
    },
    ...
  ]
}

// 说明：
// - 只返回评分 >= 4.0 的讲师
// - 按平均评分降序，学生数降序排列
// - 只包含有在线课程的讲师
```

---

## 📊 数据表关系

```
t_user (用户)
  ↓
t_user_course (学习记录) ← → t_course (课程)
  ↓                           ↓
t_course_review (评价)    t_course_chapter (章节)
                              ↓
                         t_course_video (视频)
                              ↑
t_course_category (分类) ← → t_course
```

**关键关系**：
- 用户可以是学员（learner）或讲师（instructor）
- 讲师通过 teacher_user_id 与课程关联
- 学员通过 t_user_course 表记录学习进度
- 评价只能由已报名的学员添加

---

## 🧪 测试账号

| 手机号 | 密码 | 角色 | 姓名 |
|--------|------|------|------|
| 13900139001 | 123456 | 学员 | 张三 |
| 13900139002 | 123456 | 学员 | 李四 |
| 13800138001 | 123456 | 讲师 | 张老师 |
| 13800138002 | 123456 | 讲师 | 李教授 |

---

## ⚠️ 注意事项

1. **课程列表筛选**：所有筛选条件可以组合使用
2. **课程搜索**：`/api/courses?keyword=关键词` 会在课程名称、简介、标签中搜索
3. **明星讲师**：`/api/teachers/top` 返回平均评分>=4.0的讲师（注意数据库中讲师角色为 `instructor`）
4. **报名限制**：同一用户不能重复报名同一课程
5. **评价限制**：
   - 只有报名的学生才能评价课程
   - 每人每课程只能评价一次
   - 只能更新/删除自己的评价
   - rating 必须在 1-5 之间
6. **进度更新**：进度值必须在0-100之间
7. **Token有效期**：默认7天,过期需重新登录
8. **评价ID获取**：
   - 添加评价时会返回 `review_id`
   - 查看评价列表可获取 `review_id`
   - 更新/删除评价需要使用 `review_id`

---

## 📝 业务逻辑说明

### 课程报名流程
1. 用户登录获取token
2. 调用报名接口
3. 系统检查是否已报名
4. 创建学习记录
5. 更新课程学生数

### 课程评价流程
1. 用户必须先报名课程
2. 报名后才能添加评价
3. 添加评价时返回 `review_id`（保存用于后续更新/删除）
4. 评价后会自动更新课程的平均评分
5. 每个用户每门课程只能评价一次
6. 只能更新/删除自己的评价

**更新/删除评价示例：**
```javascript
// 1. 添加评价
POST /api/reviews/course/1 → 返回 review_id: 5

// 2. 更新评价（使用 review_id）
PUT /api/reviews/5 → 更新成功

// 3. 删除评价
DELETE /api/reviews/5 → 删除成功
```

### 学习进度跟踪
1. 用户报名课程后，进度初始为0
2. 通过进度更新接口更新学习进度
3. 更新进度时会自动更新最后学习时间
4. 进度达到100表示课程完成

---

## 🛠️ 调试建议

1. **测试工具**：
   - 使用 **Postman** 测试（已提供 Collection：`backend/Postman-Collection.json`）
   - 使用 **REST Client** 插件（VS Code）
   - 使用测试页面：`test-api.html`

2. **常见调试步骤**：
   ```javascript
   // 测试评价功能完整流程
   1. 登录 → 获取 token
   2. 报名课程 → POST /api/courses/1/enroll
   3. 添加评价 → POST /api/reviews/course/1 → 获取 review_id
   4. 更新评价 → PUT /api/reviews/{review_id}
   5. 查看评价 → GET /api/reviews/course/1 → 验证结果
   6. 删除评价 → DELETE /api/reviews/{review_id}
   ```

3. **日志查看**：
   - 后端控制台日志（nodemon输出）
   - Postman Console（底部面板）
   - 浏览器开发者工具 Network 标签

4. **数据库查询**：
   - MySQL Workbench / Navicat
   - 命令行：`mysql -u root -p`
   ```sql
   -- 查看我的评价
   SELECT * FROM t_course_review WHERE user_id = 6;
   
   -- 查看课程的所有评价
   SELECT * FROM t_course_review WHERE course_id = 1;
   ```

5. **获取 review_id 的方法**：
   - 方法1：添加评价时保存返回的 `review_id`
   - 方法2：查询评价列表 `GET /api/reviews/course/1`
   - 方法3：数据库查询 `SELECT review_id FROM t_course_review WHERE user_id = ?`

---

## 📚 完整文档

详细的API文档请查看：`backend/README.md`
