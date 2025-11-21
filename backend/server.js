const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// 导入路由
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const categoryRoutes = require('./routes/categories');
const reviewRoutes = require('./routes/reviews');
const teacherRoutes = require('./routes/teachers');
const proxyRoutes = require('./routes/proxy');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static('uploads'));

// 日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/proxy', proxyRoutes);

// 根路径 - API 文档首页
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎓 欢迎使用课程中心API',
    version: '1.0.0',
    documentation: {
      '认证接口': '/api/auth',
      '课程接口': '/api/courses',
      '分类接口': '/api/categories',
      '评价接口': '/api/reviews',
      '讲师接口': '/api/teachers',
      '健康检查': '/api/health'
    },
    endpoints: {
      authentication: [
        'POST /api/auth/register - 用户注册',
        'POST /api/auth/login - 用户登录',
        'GET /api/auth/me - 获取当前用户信息',
        'PUT /api/auth/profile - 更新用户信息',
        'PUT /api/auth/password - 修改密码'
      ],
      courses: [
        'GET /api/courses - 获取课程列表',
        'GET /api/courses/recommended - 推荐课程',
        'GET /api/courses/popular - 热门课程',
        'GET /api/courses/newest - 最新课程',
        'GET /api/courses/:id - 课程详情',
        'GET /api/courses/:id/related - 相关课程',
        'POST /api/courses/:id/enroll - 报名课程 [需要登录]',
        'POST /api/courses/:id/favorite - 收藏课程 [需要登录]',
        'PUT /api/courses/:id/progress - 更新进度 [需要登录]',
        'GET /api/courses/user/courses - 用户课程 [需要登录]'
      ],
      categories: [
        'GET /api/categories - 获取所有分类',
        'GET /api/categories/top - 获取顶级分类',
        'GET /api/categories/:id - 获取分类详情'
      ],
      reviews: [
        'GET /api/reviews/course/:courseId - 获取课程评价',
        'POST /api/reviews/course/:courseId - 添加评价 [需要登录]',
        'PUT /api/reviews/:reviewId - 更新评价 [需要登录]',
        'DELETE /api/reviews/:reviewId - 删除评价 [需要登录]'
      ],
      teachers: [
        'GET /api/teachers/top - 获取明星讲师（高评分讲师）'
      ]
    },
    test_account: {
      phone: '13900139001',
      password: '123456'
    },
    links: {
      postman: '/Postman-Collection.json',
      api_test: '/test-api.html'
    }
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '服务运行正常',
    timestamp: new Date().toISOString()
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.path,
    tip: '请访问 http://localhost:3000/ 查看可用的API接口列表'
  });
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    await testConnection();

    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║     🎓 课程中心后端服务已启动                      ║
║                                                   ║
║     服务地址: http://localhost:${PORT}              ║
║     环境: ${process.env.NODE_ENV || 'development'}                       ║
║     数据库: ${process.env.DB_NAME}                     ║
║                                                   ║
║     API文档:                                       ║
║     - 认证: /api/auth                              ║
║     - 课程: /api/courses                           ║
║     - 分类: /api/categories                        ║
║     - 评价: /api/reviews                           ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
