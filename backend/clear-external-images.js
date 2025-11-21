const { pool } = require('./config/database');

async function clearExternalImages() {
  try {
    console.log('开始清理外部图片URL...');
    
    // 将所有 placeholder.com 的图片URL设为 NULL
    const [result] = await pool.query(
      `UPDATE t_course 
       SET cover_img = NULL 
       WHERE cover_img LIKE '%placeholder.com%'`
    );
    
    console.log(`✅ 已更新 ${result.affectedRows} 条课程记录`);
    
    // 查看更新后的结果
    const [courses] = await pool.query(
      `SELECT course_id, course_name, cover_img 
       FROM t_course 
       ORDER BY course_id 
       LIMIT 10`
    );
    
    console.log('\n前10条课程记录：');
    console.table(courses);
    
    console.log('\n✨ 现在前端将使用彩色渐变背景！');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 更新失败:', error);
    process.exit(1);
  }
}

clearExternalImages();
