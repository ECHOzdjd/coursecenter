# 课程中心项目

## 项目简介

这是一个完整的在线课程中心系统，包含用户注册登录、课程浏览、课程详情、课程分类、用户学习记录等功能。

**项目状态**: ✅ 所有功能已开发完成并测试通过

## ✨ 项目亮点

1. **完整的前后端分离架构** - Vue3 + Node.js + MySQL
2. **24个RESTful API接口** - 涵盖用户、课程、评价、讲师等所有模块
3. **响应式UI设计** - 基于Element Plus，支持多种屏幕尺寸
4. **JWT身份认证** - 安全的用户认证和授权机制
5. **智能推荐系统** - 推荐课程、热门课程、相关课程
6. **明星讲师展示** - 自动筛选高评分讲师
7. **全文搜索功能** - 支持课程名称、简介、标签搜索
8. **学习进度跟踪** - 记录用户学习状态和进度
9. **完善的评价系统** - 支持增删改查，自动计算平均评分
10. **代码规范清晰** - 模块化设计，易于维护和扩展

## 技术栈

### 前端
- **Vue 3.5.22** + **Vite 7.x**
- **Pinia 3.x** - 状态管理
- **Vue Router 4.x** - 路由管理
- **Element Plus 2.x** - UI组件库
- **Axios 1.x** - HTTP请求
- Sass/SCSS - 样式预处理

### 后端
- Node.js 18+
- Express.js 4.18.2
- MySQL 8.0
- JWT 认证（7天有效期）
- bcrypt 密码加密
- mysql2 - 数据库驱动

### 数据库
- MySQL 8.0+ (UTF8MB4编码)

## 项目结构

```
coursecenter/
├── backend/                 # 后端服务（Node.js + Express）
│   ├── config/              # 配置文件（数据库连接）
│   ├── controllers/         # 控制器（业务逻辑）
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── categoryController.js
│   │   ├── reviewController.js
│   │   └── teacherController.js
│   ├── middleware/          # 中间件（JWT认证）
│   ├── routes/              # 路由定义
│   ├── .env                 # 环境变量配置
│   ├── package.json         # 依赖管理
│   ├── server.js            # 服务器入口
│   └── README.md            # 后端详细文档
├── database/
│   └── init.sql             # 数据库初始化脚本（7表+测试数据）
├── API-SUMMARY.md           # API接口快速参考（24个接口）
├── FEATURE-CHECK.md         # 功能实现检查清单（22项功能）
└── README.md                # 项目总文档

icoursera-frontend/          # 前端项目（Vue 3 + Vite）
├── src/
│   ├── api/                 # API接口定义
│   ├── components/          # Vue组件
│   ├── router/              # 路由配置
│   ├── stores/              # Pinia状态管理
│   ├── utils/               # 工具函数（axios封装）
│   ├── views/               # 页面组件
│   │   ├── Home.vue         # 首页
│   │   ├── CourseDetail.vue # 课程详情
│   │   └── SearchResults.vue# 搜索结果页
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js
```

## 功能特性

### 1. 用户系统
- ✅ 用户注册（手机号、邮箱）
- ✅ 用户登录（JWT认证）
- ✅ 用户信息管理
- ✅ 密码修改
- ✅ 角色权限（学员、讲师、管理员）

### 2. 课程管理
- ✅ 课程列表浏览（支持分页）
- ✅ 课程筛选（分类、难度、关键词）
- ✅ **课程搜索**（在课程名称、简介、标签中搜索）
- ✅ 课程详情查看
- ✅ 课程章节和视频列表
- ✅ 推荐课程
- ✅ 热门课程（按报名人数排序）
- ✅ 最新课程
- ✅ 相关课程推荐
- ✅ **明星讲师展示**（平均评分≥4.0）

### 3. 学习功能
- ✅ 课程报名
- ✅ 课程收藏
- ✅ 学习进度跟踪
- ✅ 我的课程列表

### 4. 课程分类
- ✅ 分类浏览
- ✅ 多级分类支持
- ✅ 分类统计

### 5. 评价系统
- ✅ 课程评价（1-5星）
- ✅ 评价内容
- ✅ 评价管理（增删改查）
- ✅ 课程评分统计

## 数据库设计

### 核心表结构

1. **t_user** - 用户表
   - 存储用户基础信息、角色、学习目标等

2. **t_course_category** - 课程分类表
   - 支持多级分类

3. **t_course** - 课程主表
   - 存储课程基本信息

4. **t_course_chapter** - 课程章节表
   - 课程的章节结构

5. **t_course_video** - 课程视频表
   - 具体的视频课时

6. **t_user_course** - 用户课程关系表
   - 学习记录、进度、收藏状态

7. **t_course_review** - 课程评价表
   - 用户对课程的评价

详细的表结构请查看 `database/init.sql` 文件。

## 快速开始

### 前置要求
- Node.js 18+ 
- MySQL 8.0+
- npm 或 yarn

### 1. 数据库初始化

```bash
# 登录MySQL（使用UTF8MB4编码）
mysql -u root -p

# 创建数据库并设置字符集
CREATE DATABASE IF NOT EXISTS course_center DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 使用数据库
USE course_center;

# 执行初始化脚本
source d:/coursecenter/database/init.sql
```

**验证数据**：
- 3个讲师账号（角色为 `instructor`）
- 2个学员账号
- 6门课程（评分4.6-5.0）
- 课程分类、章节、视频等测试数据

### 2. 后端服务启动

```bash
# 进入后端目录
cd d:\coursecenter\backend

# 安装依赖
npm install

# 配置环境变量（检查 .env 文件）
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=你的密码
# DB_NAME=course_center
# JWT_SECRET=your-secret-key
# JWT_EXPIRES_IN=7d
# PORT=3000

# 启动服务（开发模式，支持热重载）
npm run dev
```

后端服务将运行在 `http://localhost:3000`

**测试接口**：
```bash
# 测试分类接口
curl http://localhost:3000/api/categories

# 测试明星讲师
curl http://localhost:3000/api/teachers/top
```

### 3. 前端服务启动

```bash
# 进入前端目录
cd d:\icoursera-project\icoursera-frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务将运行在 `http://localhost:5173`

**访问页面**：
- 首页: `http://localhost:5173/`
- 课程详情: `http://localhost:5173/course/:id`
- 搜索结果: `http://localhost:5173/search?keyword=...`

## API接口文档

📋 **快速参考**: `API-SUMMARY.md` - 包含所有24个API接口的详细说明

### API模块概览

#### 1️⃣ 认证接口 (`/api/auth/*`)
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息 🔒
- `PUT /api/auth/profile` - 更新用户信息 🔒
- `PUT /api/auth/password` - 修改密码 🔒

#### 2️⃣ 课程接口 (`/api/courses/*`)
- `GET /api/courses` - 课程列表（支持分页、筛选、搜索）
- `GET /api/courses/recommended` - 推荐课程
- `GET /api/courses/popular` - 热门课程
- `GET /api/courses/newest` - 最新课程
- `GET /api/courses/:id` - 课程详情
- `GET /api/courses/:id/chapters` - 课程章节列表
- `GET /api/courses/:id/related` - 相关课程推荐
- `POST /api/courses/:id/enroll` - 报名课程 🔒
- `POST /api/courses/:id/favorite` - 收藏/取消收藏 🔒
- `PUT /api/courses/:id/progress` - 更新学习进度 🔒
- `GET /api/courses/my/enrolled` - 我的课程 🔒

#### 3️⃣ 分类接口 (`/api/categories/*`)
- `GET /api/categories` - 所有分类
- `GET /api/categories/:id` - 分类详情

#### 4️⃣ 评价接口 (`/api/reviews/*`)
- `GET /api/reviews/course/:courseId` - 课程评价列表
- `POST /api/reviews/course/:courseId` - 添加评价 🔒
- `PUT /api/reviews/:reviewId` - 更新评价 🔒
- `DELETE /api/reviews/:reviewId` - 删除评价 🔒

#### 5️⃣ 讲师接口 (`/api/teachers/*`)
- `GET /api/teachers/top` - 明星讲师列表

🔒 = 需要 JWT Token 认证

### 响应格式

所有API统一返回格式：
```json
{
  "success": true,
  "message": "操作成功",
  "data": { /* 具体数据 */ }
}
```

### 认证方式

```javascript
// 请求头中携带 JWT Token
headers: {
  'Authorization': 'Bearer <your-jwt-token>'
}
```

## 测试账号

| 角色 | 手机号 | 密码 | 用户名 |
|------|--------|------|--------|
| 学员 | 13900139001 | 123456 | 张三 |
| 学员 | 13900139002 | 123456 | 李四 |
| 讲师 | 13800138001 | 123456 | 张老师 |
| 讲师 | 13800138002 | 123456 | 李教授 |
| 讲师 | 13800138003 | 123456 | 王工程师 |

## 接口调用示例

### 用户注册

```javascript
fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_name: '张三',
    phone: '13900139001',
    password: '123456'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### 用户登录

```javascript
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phone: '13900139001',
    password: '123456'
  })
})
.then(res => res.json())
.then(data => {
  // 保存token
  localStorage.setItem('token', data.data.token);
});
```

### 获取课程列表

```javascript
fetch('http://localhost:3000/api/courses?page=1&limit=12')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 报名课程（需要认证）

```javascript
const token = localStorage.getItem('token');
fetch('http://localhost:3000/api/courses/1/enroll', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

## 部署建议

### 开发环境（当前配置）
- **前端**: Vite开发服务器 (localhost:5173)
- **后端**: `npm run dev` - nodemon自动重启 (localhost:3000)
- **数据库**: 本地MySQL 8.0 (UTF8MB4)

### 生产环境
1. **前端部署**
   ```bash
   cd icoursera-frontend
   npm run build  # 生成 dist/ 目录
   ```
   - 部署到Nginx静态服务器
   - 配置反向代理到后端API

2. **后端部署**
   ```bash
   cd backend
   npm install --production  # 仅安装生产依赖
   ```
   - 使用 **PM2** 管理Node.js进程
   ```bash
   npm install -g pm2
   pm2 start server.js --name course-center-api
   pm2 startup  # 设置开机自启
   pm2 save
   ```

3. **数据库**
   - 配置主从复制（可选）
   - 设置定期备份计划
   - 使用独立数据库服务器

4. **Nginx配置示例**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       # 前端静态文件
       location / {
           root /var/www/icoursera-frontend/dist;
           try_files $uri $uri/ /index.html;
       }

       # API代理
       location /api/ {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **安全加固**
   - 配置HTTPS证书（Let's Encrypt）
   - 修改生产环境 `JWT_SECRET`
   - 启用MySQL SSL连接
   - 配置防火墙规则
   - 限制API请求频率（防DDoS）

## 注意事项

1. **安全性**
   - 生产环境务必修改 `JWT_SECRET`
   - 使用HTTPS传输
   - 密码使用bcrypt加密（已实现）
   - Token有效期默认7天

2. **数据库**
   - 必须使用 **UTF8MB4** 编码（支持emoji等特殊字符）
   - 讲师角色字段值为 `instructor`（不是 `teacher`）
   - 已创建必要的索引优化查询性能

3. **前端集成**
   - 前端已配置代理，开发环境下自动转发 `/api` 到后端
   - 响应格式为 `{success, message, data}`，前端已适配
   - 使用 Pinia 管理全局状态（用户、课程等）

4. **性能优化**
   - 数据库查询已添加索引
   - 课程列表支持分页（默认每页12条）
   - 可考虑使用Redis缓存热门数据

5. **跨域配置**
   - 后端已配置CORS，允许前端调用
   - 生产环境建议使用Nginx反向代理

6. **功能要点**
   - 明星讲师只显示平均评分≥4.0的讲师
   - 热门课程按报名人数降序排列
   - 搜索功能会在课程名称、简介、标签中匹配关键词
   - 每个用户每门课程只能评价一次


## 常见问题

### Q: 数据库连接失败？
A: 
1. 检查 `.env` 文件中的数据库配置是否正确
2. 确保MySQL服务已启动
3. 验证数据库已创建且使用UTF8MB4编码
4. 检查数据库用户权限

### Q: JWT认证失败？
A: 
1. 检查请求头中的Token格式：`Bearer <token>`
2. 确认Token未过期（默认7天有效期）
3. 验证 `JWT_SECRET` 配置一致

### Q: 前端无法调用接口？
A: 
1. 确保后端服务运行在 `localhost:3000`
2. 检查浏览器控制台是否有CORS错误
3. 验证前端 `vite.config.js` 中的代理配置
4. 确认 API 基础路径为 `/api`

### Q: 明星讲师不显示？
A: 
1. 确认数据库中讲师的 `role` 字段为 `instructor`
2. 检查讲师是否有课程且平均评分≥4.0
3. 使用 `GET /api/teachers/top` 测试接口

### Q: 搜索功能不工作？
A: 
1. 确认使用 `GET /api/courses?keyword=关键词` 接口
2. 检查 SearchResults.vue 是否正确调用 API
3. 验证课程数据中有匹配的名称/简介/标签

### Q: 密码忘记了怎么办？
A: 可以直接在数据库中更新密码字段（需要先用bcrypt加密）：
```javascript
// 使用Node.js生成新密码hash
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('新密码', 10);
// 然后在MySQL中更新: UPDATE t_user SET password='新hash' WHERE phone='手机号';
```

### Q: 如何添加新课程？
A: 当前系统支持课程浏览、报名、评价等功能，课程创建功能可通过以下方式：
1. 直接在数据库中插入数据
2. 开发管理后台（待实现）
3. 使用数据库管理工具（如Navicat）

## 贡献

欢迎提交Issue和Pull Request！

## 相关文档

- 📋 [API接口快速参考](./API-SUMMARY.md) - 所有24个API的详细说明
- ✅ [功能实现检查清单](./FEATURE-CHECK.md) - 22项功能100%完成
- 📖 [后端详细文档](./backend/README.md) - 后端架构和实现细节

## License

MIT License

---

**开发完成日期**: 2024  
**功能完成度**: 100% (22/22功能 ✅)  
**API数量**: 24个接口  
**数据库表**: 7张核心表  

**祝你使用愉快！ 🎓**
