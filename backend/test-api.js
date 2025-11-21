/**
 * API接口自动化测试脚本
 * 测试所有24个API接口
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let token = '';
let reviewId = null;

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

let passCount = 0;
let failCount = 0;

// 测试函数
async function testAPI(name, method, url, data = null, headers = {}) {
  const testNumber = passCount + failCount + 1;
  console.log(`\n${colors.yellow}[${testNumber}/24] 测试: ${name}${colors.reset}`);
  console.log(`${colors.gray}    ${method} ${url}${colors.reset}`);
  
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data && method !== 'GET') {
      config.data = data;
    }
    
    const response = await axios(config);
    
    if (response.data.success) {
      console.log(`${colors.green}    ✅ 成功: ${response.data.message || '操作成功'}${colors.reset}`);
      if (response.data.data) {
        if (Array.isArray(response.data.data)) {
          console.log(`${colors.gray}    📊 返回数据: ${response.data.data.length} 条记录${colors.reset}`);
        } else {
          console.log(`${colors.gray}    📊 返回数据类型: ${typeof response.data.data}${colors.reset}`);
        }
      }
      passCount++;
      return response.data;
    } else {
      console.log(`${colors.red}    ❌ 失败: ${response.data.message}${colors.reset}`);
      failCount++;
      return null;
    }
  } catch (error) {
    if (error.response && error.response.data) {
      console.log(`${colors.red}    ❌ 失败: ${error.response.data.message || error.message}${colors.reset}`);
    } else {
      console.log(`${colors.red}    ❌ 请求失败: ${error.message}${colors.reset}`);
    }
    failCount++;
    return null;
  }
}

// 主测试流程
async function runTests() {
  console.log(`${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.cyan}开始测试课程中心API接口（共24个）${colors.reset}`);
  console.log(`${colors.cyan}========================================${colors.reset}`);
  
  // ==================== 1️⃣ 认证接口 (5个) ====================
  console.log(`\n${colors.cyan}========== 1️⃣ 认证接口 (5个) ==========${colors.reset}`);
  
  // 1. 用户注册
  const randomPhone = `1390000${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
  const registerResult = await testAPI(
    '用户注册',
    'POST',
    '/api/auth/register',
    {
      user_name: `测试用户_${Date.now()}`,
      phone: randomPhone,
      password: 'test123456',
      email: `test${Date.now()}@example.com`
    }
  );
  
  // 2. 用户登录（使用刚注册的用户）
  const loginResult = await testAPI(
    '用户登录',
    'POST',
    '/api/auth/login',
    {
      phone: randomPhone,
      password: 'test123456'
    }
  );
  
  if (loginResult && loginResult.data.token) {
    token = loginResult.data.token;
    console.log(`${colors.green}    🔑 Token已获取，后续测试将使用此Token${colors.reset}`);
  } else if (registerResult && registerResult.data.token) {
    // 如果登录失败，使用注册时返回的token
    token = registerResult.data.token;
    console.log(`${colors.yellow}    🔑 使用注册时的Token，后续测试将使用此Token${colors.reset}`);
  }
  
  // 3. 获取当前用户信息
  await testAPI(
    '获取当前用户信息',
    'GET',
    '/api/auth/me',
    null,
    { Authorization: `Bearer ${token}` }
  );
  
  // 4. 更新用户信息
  await testAPI(
    '更新用户信息',
    'PUT',
    '/api/auth/profile',
    {
      user_name: '张三（已更新）',
      learning_goal: '精通前端开发'
    },
    { Authorization: `Bearer ${token}` }
  );
  
  // 5. 修改密码
  await testAPI(
    '修改密码',
    'PUT',
    '/api/auth/password',
    {
      old_password: 'test123456',
      new_password: 'newpass123'
    },
    { Authorization: `Bearer ${token}` }
  );
  
  // ==================== 2️⃣ 课程接口 (13个) ====================
  console.log(`\n${colors.cyan}========== 2️⃣ 课程接口 (13个) ==========${colors.reset}`);
  
  // 6. 课程列表（无筛选）
  await testAPI('课程列表（基础）', 'GET', '/api/courses?page=1&limit=5');
  
  // 7. 课程列表（带筛选）
  await testAPI('课程列表（筛选：分类）', 'GET', '/api/courses?category_id=1&page=1&limit=5');
  
  // 8. 课程搜索
  await testAPI('课程搜索', 'GET', '/api/courses?keyword=Python');
  
  // 9. 推荐课程
  await testAPI('推荐课程', 'GET', '/api/courses/recommended?limit=6');
  
  // 10. 热门课程
  await testAPI('热门课程', 'GET', '/api/courses/popular?limit=6');
  
  // 11. 最新课程
  await testAPI('最新课程', 'GET', '/api/courses/newest?limit=6');
  
  // 12. 课程详情
  await testAPI('课程详情', 'GET', '/api/courses/1');
  
  // 13. 课程章节列表
  await testAPI('课程章节列表', 'GET', '/api/courses/1/chapters');
  
  // 14. 相关课程推荐
  await testAPI('相关课程推荐', 'GET', '/api/courses/1/related?limit=4');
  
  // 15. 报名课程
  await testAPI(
    '报名课程ID=1',
    'POST',
    '/api/courses/1/enroll',
    null,
    { Authorization: `Bearer ${token}` }
  );
  
  // 15b. 报名课程2
  await testAPI(
    '报名课程ID=2',
    'POST',
    '/api/courses/2/enroll',
    null,
    { Authorization: `Bearer ${token}` }
  );
  
  // 16. 收藏/取消收藏
  await testAPI(
    '收藏/取消收藏课程',
    'POST',
    '/api/courses/2/favorite',
    null,
    { Authorization: `Bearer ${token}` }
  );
  
  // 17. 更新学习进度
  await testAPI(
    '更新学习进度',
    'PUT',
    '/api/courses/1/progress',
    { progress: 50 },
    { Authorization: `Bearer ${token}` }
  );
  
  // 18. 我的课程
  await testAPI(
    '我的课程',
    'GET',
    '/api/courses/my/enrolled',
    null,
    { Authorization: `Bearer ${token}` }
  );
  
  // ==================== 3️⃣ 分类接口 (2个) ====================
  console.log(`\n${colors.cyan}========== 3️⃣ 分类接口 (2个) ==========${colors.reset}`);
  
  // 19. 所有分类
  await testAPI('获取所有分类', 'GET', '/api/categories');
  
  // 20. 分类详情
  await testAPI('获取分类详情', 'GET', '/api/categories/1');
  
  // ==================== 4️⃣ 评价接口 (4个) ====================
  console.log(`\n${colors.cyan}========== 4️⃣ 评价接口 (4个) ==========${colors.reset}`);
  
  // 21. 课程评价列表
  await testAPI('课程评价列表', 'GET', '/api/reviews/course/1');
  
  // 22. 添加评价
  const reviewResult = await testAPI(
    '添加评价',
    'POST',
    '/api/reviews/course/1',
    {
      rating: 5,
      comment: '这门课程非常好！自动化测试添加的评价。'
    },
    { Authorization: `Bearer ${token}` }
  );
  
  if (reviewResult && reviewResult.data && reviewResult.data.review_id) {
    reviewId = reviewResult.data.review_id;
    console.log(`${colors.gray}    📝 评价ID: ${reviewId}${colors.reset}`);
  }
  
  // 23. 更新评价
  if (reviewId) {
    await testAPI(
      '更新评价',
      'PUT',
      `/api/reviews/${reviewId}`,
      {
        rating: 5,
        comment: '更新后的评价：这门课程真的太棒了！'
      },
      { Authorization: `Bearer ${token}` }
    );
  } else {
    console.log(`\n${colors.yellow}[23/24] 测试: 更新评价${colors.reset}`);
    console.log(`${colors.yellow}    ⚠️  跳过: 需要先成功添加评价${colors.reset}`);
    failCount++;
  }
  
  // 24. 删除评价
  if (reviewId) {
    await testAPI(
      '删除评价',
      'DELETE',
      `/api/reviews/${reviewId}`,
      null,
      { Authorization: `Bearer ${token}` }
    );
  } else {
    console.log(`\n${colors.yellow}[24/24] 测试: 删除评价${colors.reset}`);
    console.log(`${colors.yellow}    ⚠️  跳过: 需要先成功添加评价${colors.reset}`);
    failCount++;
  }
  
  // ==================== 5️⃣ 讲师接口 (1个) ====================
  console.log(`\n${colors.cyan}========== 5️⃣ 讲师接口 (1个) ==========${colors.reset}`);
  
  // 明星讲师
  await testAPI('明星讲师列表', 'GET', '/api/teachers/top?limit=6');
  
  // ==================== 测试总结 ====================
  console.log(`\n${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.cyan}测试完成！${colors.reset}`);
  console.log(`${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.green}✅ 成功: ${passCount} 个接口${colors.reset}`);
  console.log(`${colors.red}❌ 失败: ${failCount} 个接口${colors.reset}`);
  console.log(`${colors.cyan}📊 成功率: ${((passCount / 24) * 100).toFixed(2)}%${colors.reset}`);
  console.log('');
  
  if (passCount === 24) {
    console.log(`${colors.green}🎉 恭喜！所有24个API接口测试通过！${colors.reset}`);
  } else if (passCount >= 20) {
    console.log(`${colors.yellow}👍 大部分接口测试通过，请检查失败的接口${colors.reset}`);
  } else {
    console.log(`${colors.red}⚠️  多个接口测试失败，请检查后端服务和数据库${colors.reset}`);
  }
  
  process.exit(failCount > 0 ? 1 : 0);
}

// 执行测试
runTests().catch(error => {
  console.error(`${colors.red}测试执行出错: ${error.message}${colors.reset}`);
  process.exit(1);
});
