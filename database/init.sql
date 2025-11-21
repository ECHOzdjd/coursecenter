-- ====================================
-- 课程中心数据库初始化脚本
-- ====================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS course_center DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE course_center;

-- ====================================
-- 1. 用户核心表
-- ====================================

-- 用户表
DROP TABLE IF EXISTS t_user;
CREATE TABLE t_user (
    user_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户唯一ID',
    user_name VARCHAR(100) NOT NULL COMMENT '用户名',
    phone CHAR(11) UNIQUE NOT NULL COMMENT '手机号',
    email VARCHAR(100) UNIQUE COMMENT '邮箱',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    user_intro TEXT COMMENT '个人简介',
    occupation VARCHAR(100) COMMENT '职业',
    learning_goal VARCHAR(100) COMMENT '学习目标',
    role ENUM('learner', 'instructor', 'admin') NOT NULL DEFAULT 'learner' COMMENT '用户角色',
    register_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
    last_login_time DATETIME COMMENT '最后登录时间',
    is_active TINYINT DEFAULT 1 COMMENT '是否活跃 1-活跃 0-不活跃',
    avatar_url VARCHAR(255) COMMENT '头像URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ====================================
-- 2. 课程核心表
-- ====================================

-- 课程分类表
DROP TABLE IF EXISTS t_course_category;
CREATE TABLE t_course_category (
    category_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '分类唯一ID',
    category_name VARCHAR(100) NOT NULL COMMENT '分类名称',
    parent_category_id INT DEFAULT NULL COMMENT '父分类ID',
    category_icon VARCHAR(100) COMMENT '分类图标',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES t_course_category(category_id) ON DELETE SET NULL,
    INDEX idx_parent (parent_category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程分类表';

-- 课程主表
DROP TABLE IF EXISTS t_course;
CREATE TABLE t_course (
    course_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '课程唯一ID',
    course_name VARCHAR(100) NOT NULL COMMENT '课程名称',
    course_desc TEXT COMMENT '课程简介',
    cover_img VARCHAR(255) COMMENT '课程封面图URL',
    category_id INT COMMENT '课程分类ID',
    teacher_user_id INT COMMENT '讲师的用户ID',
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner' COMMENT '难度级别',
    course_duration INT DEFAULT 0 COMMENT '总时长(分钟)',
    is_online TINYINT DEFAULT 0 COMMENT '是否上线 1-上线 0-下线',
    student_count INT DEFAULT 0 COMMENT '学生人数',
    rating DECIMAL(3,1) DEFAULT 0.0 COMMENT '课程评分',
    rating_count INT DEFAULT 0 COMMENT '评分人数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES t_course_category(category_id) ON DELETE SET NULL,
    FOREIGN KEY (teacher_user_id) REFERENCES t_user(user_id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_teacher (teacher_user_id),
    INDEX idx_difficulty (difficulty_level),
    INDEX idx_online (is_online)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程主表';

-- 课程章节表
DROP TABLE IF EXISTS t_course_chapter;
CREATE TABLE t_course_chapter (
    chapter_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '章节唯一ID',
    course_id INT NOT NULL COMMENT '所属课程ID',
    chapter_title VARCHAR(255) NOT NULL COMMENT '章节标题',
    order_index INT DEFAULT 0 COMMENT '章节排序位置',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES t_course(course_id) ON DELETE CASCADE,
    INDEX idx_course (course_id),
    INDEX idx_order (order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程章节表';

-- 课程视频表
DROP TABLE IF EXISTS t_course_video;
CREATE TABLE t_course_video (
    video_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '视频唯一ID',
    chapter_id INT NOT NULL COMMENT '所属章节ID',
    video_title VARCHAR(255) NOT NULL COMMENT '视频标题',
    video_url VARCHAR(255) COMMENT '视频URL',
    video_desc TEXT COMMENT '视频描述',
    duration_seconds INT DEFAULT 0 COMMENT '视频时长(秒)',
    order_index INT DEFAULT 0 COMMENT '课时在章节内的排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (chapter_id) REFERENCES t_course_chapter(chapter_id) ON DELETE CASCADE,
    INDEX idx_chapter (chapter_id),
    INDEX idx_order (order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程视频表';

-- ====================================
-- 3. 关联表
-- ====================================

-- 用户课程关系表(学习记录)
DROP TABLE IF EXISTS t_user_course;
CREATE TABLE t_user_course (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT '用户ID',
    course_id INT NOT NULL COMMENT '课程ID',
    enroll_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '报名时间',
    progress INT DEFAULT 0 COMMENT '学习进度(百分比)',
    last_learn_time DATETIME COMMENT '最后学习时间',
    is_favorite TINYINT DEFAULT 0 COMMENT '是否收藏',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES t_user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES t_course(course_id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_course (user_id, course_id),
    INDEX idx_user (user_id),
    INDEX idx_course (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户课程关系表';

-- 课程评价表
DROP TABLE IF EXISTS t_course_review;
CREATE TABLE t_course_review (
    review_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '评价唯一ID',
    course_id INT NOT NULL COMMENT '课程ID',
    user_id INT NOT NULL COMMENT '用户ID',
    rating INT NOT NULL COMMENT '评分(1-5)',
    review_content TEXT COMMENT '评价内容',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES t_course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES t_user(user_id) ON DELETE CASCADE,
    INDEX idx_course (course_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程评价表';

-- ====================================
-- 4. 插入测试数据
-- ====================================

-- 插入课程分类
INSERT INTO t_course_category (category_name, parent_category_id, category_icon, sort_order) VALUES
('编程开发', NULL, 'fa-code', 1),
('数据科学', NULL, 'fa-chart-bar', 2),
('人工智能', NULL, 'fa-brain', 3),
('移动开发', NULL, 'fa-mobile-alt', 4),
('UI/UX设计', NULL, 'fa-palette', 5),
('后端开发', NULL, 'fa-server', 6);

-- 插入测试用户(密码为 123456 的bcrypt加密)
INSERT INTO t_user (user_name, phone, email, password_hash, user_intro, occupation, role, avatar_url) VALUES
('张老师', '13800138001', 'zhang@example.com', '$2b$10$YQN9L7v0HZhVrF4VYhZKZeKGYj7M8rZxZc8V8ZGYk7YQN9L7v0HZh', '高级软件工程师，8年Python开发经验', 'Python开发工程师', 'instructor', 'https://via.placeholder.com/100'),
('李教授', '13800138002', 'li@example.com', '$2b$10$YQN9L7v0HZhVrF4VYhZKZeKGYj7M8rZxZc8V8ZGYk7YQN9L7v0HZh', '数据科学领域权威，前Google工程师', '数据科学家', 'instructor', 'https://via.placeholder.com/100'),
('王工程师', '13800138003', 'wang@example.com', '$2b$10$YQN9L7v0HZhVrF4VYhZKZeKGYj7M8rZxZc8V8ZGYk7YQN9L7v0HZh', '全栈开发专家，10年项目经验', '全栈工程师', 'instructor', 'https://via.placeholder.com/100'),
('张三', '13900139001', 'zhangsan@example.com', '$2b$10$YQN9L7v0HZhVrF4VYhZKZeKGYj7M8rZxZc8V8ZGYk7YQN9L7v0HZh', '热爱学习的程序员', '学生', 'learner', 'https://via.placeholder.com/100'),
('李四', '13900139002', 'lisi@example.com', '$2b$10$YQN9L7v0HZhVrF4VYhZKZeKGYj7M8rZxZc8V8ZGYk7YQN9L7v0HZh', '前端开发工程师', '前端工程师', 'learner', 'https://via.placeholder.com/100');

-- 插入测试课程
INSERT INTO t_course (course_name, course_desc, cover_img, category_id, teacher_user_id, difficulty_level, course_duration, is_online, student_count, rating, rating_count) VALUES
('Python编程入门', '从零开始学习Python编程，掌握基础语法和编程思维', 'https://via.placeholder.com/400x250/667eea/ffffff?text=Python', 1, 1, 'beginner', 1680, 1, 12589, 4.8, 2456),
('机器学习实战', '掌握机器学习核心算法，完成真实项目实践', 'https://via.placeholder.com/400x250/f093fb/ffffff?text=ML', 3, 2, 'intermediate', 2400, 1, 1800, 4.9, 856),
('React全栈开发', '从前端到后端，掌握现代Web开发全流程', 'https://via.placeholder.com/400x250/4facfe/ffffff?text=React', 1, 3, 'advanced', 3200, 1, 3200, 4.7, 1250),
('数据结构与算法', '系统学习数据结构，提升编程思维能力', 'https://via.placeholder.com/400x250/43e97b/ffffff?text=Algorithm', 1, 1, 'beginner', 2800, 1, 4100, 4.8, 1856),
('深度学习入门', '理解神经网络原理，掌握深度学习框架', 'https://via.placeholder.com/400x250/fa709a/ffffff?text=DL', 3, 2, 'intermediate', 2600, 1, 2900, 4.9, 1125),
('Git版本控制', '掌握团队协作开发必备的版本控制技能', 'https://via.placeholder.com/400x250/a8edea/ffffff?text=Git', 1, 3, 'beginner', 800, 1, 1500, 4.6, 625);

-- 插入课程章节(为Python编程入门课程)
INSERT INTO t_course_chapter (course_id, chapter_title, order_index) VALUES
(1, '第一章：Python基础入门', 1),
(1, '第二章：数据类型和运算符', 2),
(1, '第三章：控制流程', 3),
(1, '第四章：函数与模块', 4);

-- 插入课程视频
INSERT INTO t_course_video (chapter_id, video_title, video_url, video_desc, duration_seconds, order_index) VALUES
(1, 'Python简介和开发环境搭建', 'https://example.com/video1.mp4', '了解Python语言特点，配置开发环境', 1500, 1),
(1, '第一个Python程序', 'https://example.com/video2.mp4', '编写并运行第一个Python程序', 1800, 2),
(1, '变量和数据类型', 'https://example.com/video3.mp4', '学习Python的变量定义和基本数据类型', 2100, 3),
(1, '输入输出操作', 'https://example.com/video4.mp4', '掌握Python的输入输出方法', 1600, 4),
(2, '数字类型详解', 'https://example.com/video5.mp4', '深入学习整数、浮点数等数字类型', 2000, 1),
(2, '字符串操作', 'https://example.com/video6.mp4', '掌握字符串的常用操作方法', 2200, 2);

-- 插入用户课程关系
INSERT INTO t_user_course (user_id, course_id, progress, last_learn_time, is_favorite) VALUES
(4, 1, 35, NOW(), 1),
(4, 4, 60, NOW(), 1),
(5, 1, 80, NOW(), 0),
(5, 3, 45, NOW(), 1);

-- 插入课程评价
INSERT INTO t_course_review (course_id, user_id, rating, review_content) VALUES
(1, 5, 5, '非常适合零基础学习者的课程！张老师讲解得非常清晰，每个概念都配有实际案例。'),
(1, 4, 5, '课程结构合理，内容充实，受益匪浅！'),
(3, 5, 4, '内容很好，不过有些地方讲得有点快，需要反复观看。'),
(4, 4, 5, '数据结构讲解透彻，配合算法实战，帮助很大！');

-- ====================================
-- 5. 创建视图(可选)
-- ====================================

-- 课程详情视图
CREATE OR REPLACE VIEW v_course_detail AS
SELECT 
    c.*,
    cat.category_name,
    u.user_name as teacher_name,
    u.user_intro as teacher_intro,
    u.avatar_url as teacher_avatar
FROM t_course c
LEFT JOIN t_course_category cat ON c.category_id = cat.category_id
LEFT JOIN t_user u ON c.teacher_user_id = u.user_id;

-- 用户学习记录视图
CREATE OR REPLACE VIEW v_user_learning AS
SELECT 
    uc.*,
    c.course_name,
    c.cover_img,
    c.course_duration,
    u.user_name as teacher_name
FROM t_user_course uc
LEFT JOIN t_course c ON uc.course_id = c.course_id
LEFT JOIN t_user u ON c.teacher_user_id = u.user_id;

-- ====================================
-- 初始化完成
-- ====================================
