const { pool } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 生成JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.user_id,
      phone: user.phone,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

// 用户注册
exports.register = async (req, res, next) => {
  try {
    const { user_name, phone, email, password, occupation, learning_goal } = req.body;

    // 验证必填字段
    if (!user_name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名、手机号和密码为必填项'
      });
    }

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: '手机号格式不正确'
      });
    }

    // 验证邮箱格式（如果提供）
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: '邮箱格式不正确'
      });
    }

    // 检查手机号是否已存在
    const [existing] = await pool.query(
      'SELECT user_id FROM t_user WHERE phone = ?',
      [phone]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: '该手机号已被注册'
      });
    }

    // 检查邮箱是否已存在
    if (email) {
      const [existingEmail] = await pool.query(
        'SELECT user_id FROM t_user WHERE email = ?',
        [email]
      );

      if (existingEmail.length > 0) {
        return res.status(400).json({
          success: false,
          message: '该邮箱已被注册'
        });
      }
    }

    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 插入用户数据
    const [result] = await pool.query(
      `INSERT INTO t_user (user_name, phone, email, password_hash, occupation, learning_goal, register_time) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [user_name, phone, email || null, password_hash, occupation || null, learning_goal || null]
    );

    // 获取新创建的用户信息
    const [newUser] = await pool.query(
      'SELECT user_id, user_name, phone, email, occupation, learning_goal, role, register_time FROM t_user WHERE user_id = ?',
      [result.insertId]
    );

    // 生成token
    const token = generateToken(newUser[0]);

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: newUser[0],
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// 用户登录
exports.login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    // 验证必填字段
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: '手机号和密码为必填项'
      });
    }

    // 查询用户
    const [users] = await pool.query(
      `SELECT user_id, user_name, phone, email, password_hash, role, occupation, 
              learning_goal, user_intro, avatar_url, is_active 
       FROM t_user WHERE phone = ?`,
      [phone]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: '手机号或密码错误'
      });
    }

    const user = users[0];

    // 检查账户状态
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: '账户已被禁用'
      });
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '手机号或密码错误'
      });
    }

    // 更新最后登录时间
    await pool.query(
      'UPDATE t_user SET last_login_time = NOW() WHERE user_id = ?',
      [user.user_id]
    );

    // 删除敏感信息
    delete user.password_hash;

    // 生成token
    const token = generateToken(user);

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取当前用户信息
exports.getCurrentUser = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      `SELECT user_id, user_name, phone, email, role, occupation, learning_goal, 
              user_intro, avatar_url, register_time, last_login_time 
       FROM t_user WHERE user_id = ?`,
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    next(error);
  }
};

// 更新用户信息
exports.updateProfile = async (req, res, next) => {
  try {
    const { user_name, email, occupation, learning_goal, user_intro } = req.body;
    const userId = req.user.userId;

    // 构建更新SQL
    const updates = [];
    const values = [];

    if (user_name) {
      updates.push('user_name = ?');
      values.push(user_name);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (occupation) {
      updates.push('occupation = ?');
      values.push(occupation);
    }
    if (learning_goal) {
      updates.push('learning_goal = ?');
      values.push(learning_goal);
    }
    if (user_intro) {
      updates.push('user_intro = ?');
      values.push(user_intro);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有要更新的字段'
      });
    }

    values.push(userId);

    await pool.query(
      `UPDATE t_user SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );

    // 获取更新后的用户信息
    const [users] = await pool.query(
      `SELECT user_id, user_name, phone, email, role, occupation, learning_goal, 
              user_intro, avatar_url, register_time, last_login_time 
       FROM t_user WHERE user_id = ?`,
      [userId]
    );

    res.json({
      success: true,
      message: '更新成功',
      data: users[0]
    });
  } catch (error) {
    next(error);
  }
};

// 修改密码
exports.changePassword = async (req, res, next) => {
  try {
    const { old_password, new_password } = req.body;
    const userId = req.user.userId;

    if (!old_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: '旧密码和新密码为必填项'
      });
    }

    // 获取当前密码
    const [users] = await pool.query(
      'SELECT password_hash FROM t_user WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 验证旧密码
    const isMatch = await bcrypt.compare(old_password, users[0].password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '旧密码错误'
      });
    }

    // 加密新密码
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(new_password, salt);

    // 更新密码
    await pool.query(
      'UPDATE t_user SET password_hash = ? WHERE user_id = ?',
      [password_hash, userId]
    );

    res.json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error) {
    next(error);
  }
};
