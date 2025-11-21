const { pool } = require('../config/database');

/**
 * 获取明星讲师列表（高评分讲师）
 * GET /api/teachers/top
 * Query: limit (默认6)
 */
exports.getTopTeachers = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const [teachers] = await pool.query(
      `SELECT 
        u.user_id,
        u.user_name,
        u.avatar_url,
        u.user_intro,
        u.occupation,
        COUNT(DISTINCT c.course_id) as course_count,
        ROUND(AVG(c.rating), 1) as avg_rating,
        SUM(c.student_count) as total_students,
        SUM(c.rating_count) as total_reviews
       FROM t_user u
       INNER JOIN t_course c ON u.user_id = c.teacher_user_id
       WHERE u.role = 'instructor' AND c.is_online = 1
       GROUP BY u.user_id
       HAVING avg_rating >= 4.0
       ORDER BY avg_rating DESC, total_students DESC
       LIMIT ?`,
      [parseInt(limit)]
    );

    res.json({
      success: true,
      data: teachers
    });
  } catch (error) {
    next(error);
  }
};
