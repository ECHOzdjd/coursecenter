const { pool } = require('../config/database');

// 获取所有课程分类
exports.getAllCategories = async (req, res, next) => {
  try {
    const [categories] = await pool.query(
      `SELECT 
        c.category_id, c.category_name, c.parent_category_id, c.category_icon, c.sort_order,
        COUNT(DISTINCT co.course_id) as course_count
       FROM t_course_category c
       LEFT JOIN t_course co ON c.category_id = co.category_id AND co.is_online = 1
       GROUP BY c.category_id, c.category_name, c.parent_category_id, c.category_icon, c.sort_order
       ORDER BY c.sort_order, c.category_id`
    );

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// 获取顶级分类
exports.getTopCategories = async (req, res, next) => {
  try {
    const [categories] = await pool.query(
      `SELECT 
        c.category_id, c.category_name, c.category_icon, c.sort_order,
        COUNT(DISTINCT co.course_id) as course_count
       FROM t_course_category c
       LEFT JOIN t_course co ON c.category_id = co.category_id AND co.is_online = 1
       WHERE c.parent_category_id IS NULL
       GROUP BY c.category_id, c.category_name, c.category_icon, c.sort_order
       ORDER BY c.sort_order, c.category_id`
    );

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// 获取分类详情及子分类
exports.getCategoryDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 获取分类信息
    const [categories] = await pool.query(
      `SELECT 
        c.category_id, c.category_name, c.parent_category_id, c.category_icon,
        COUNT(DISTINCT co.course_id) as course_count
       FROM t_course_category c
       LEFT JOIN t_course co ON c.category_id = co.category_id AND co.is_online = 1
       WHERE c.category_id = ?
       GROUP BY c.category_id, c.category_name, c.parent_category_id, c.category_icon`,
      [id]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    const category = categories[0];

    // 获取子分类
    const [subCategories] = await pool.query(
      `SELECT 
        c.category_id, c.category_name, c.category_icon,
        COUNT(DISTINCT co.course_id) as course_count
       FROM t_course_category c
       LEFT JOIN t_course co ON c.category_id = co.category_id AND co.is_online = 1
       WHERE c.parent_category_id = ?
       GROUP BY c.category_id, c.category_name, c.category_icon
       ORDER BY c.sort_order, c.category_id`,
      [id]
    );

    category.sub_categories = subCategories;

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};
