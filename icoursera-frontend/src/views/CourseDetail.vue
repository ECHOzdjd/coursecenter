<template>
  <div class="course-detail">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-section">
      <div class="loading-spinner"></div>
      <p>加载课程详情中...</p>
    </div>

    <div v-else>
      <!-- 课程头部 -->
      <section class="course-header">
        <div class="container">
          <div class="course-info">
            <span class="course-category">{{ course.category }}</span>
            <h1>{{ course.title }}</h1>
            <p class="course-description">{{ course.description }}</p>
          <div class="course-meta">
            <div class="meta-item">
              <i class="fas fa-star"></i>
              <span>{{ course.rating }} ({{ course.reviewCount }} 评价)</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-users"></i>
              <span>{{ course.studentCount }} 名学生</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-clock"></i>
              <span>{{ course.duration }} 小时</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-signal"></i>
              <span>{{ course.difficulty }}</span>
            </div>
          </div>
          <div class="course-actions">
            <button class="btn btn-primary" @click="startLearning">
              <i class="fas fa-play"></i>
              开始学习
            </button>
            <button class="btn btn-secondary" @click="toggleFavorite">
              <i :class="isFavorited ? 'fas fa-heart' : 'far fa-heart'"></i>
              {{ isFavorited ? '已收藏' : '收藏' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="container">
      <!-- 标签页 -->
      <div class="tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab" 
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </div>
      </div>

      <!-- 课程介绍 -->
      <div v-if="activeTab === 'overview'" class="tab-content">
        <div class="content-section">
          <h2 class="section-title">课程介绍</h2>
          <div class="course-overview">
            <div class="overview-content">
              <p>{{ course.description }}</p>
              
              <div v-if="courseStore.currentCourse?.course_goals" class="goals-section">
                <h3>学习目标</h3>
                <p style="white-space: pre-wrap;">{{ courseStore.currentCourse.course_goals }}</p>
              </div>
              
              <div class="features-grid">
                <div class="feature-item">
                  <div class="feature-icon">
                    <i class="fas fa-laptop-code"></i>
                  </div>
                  <h4>实战驱动</h4>
                  <p>通过真实项目学习</p>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <i class="fas fa-graduation-cap"></i>
                  </div>
                  <h4>循序渐进</h4>
                  <p>系统学习路径</p>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <i class="fas fa-comments"></i>
                  </div>
                  <h4>社区支持</h4>
                  <p>互动交流学习</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 课程大纲 -->
      <div v-if="activeTab === 'curriculum'" class="tab-content">
        <div class="content-section">
          <h2 class="section-title">课程大纲</h2>
          <div class="curriculum-content">
            <div v-if="chapters.length === 0" class="empty-state">
              <p>暂无课程大纲</p>
            </div>
            <div 
              v-else
              v-for="chapter in chapters" 
              :key="chapter.id"
              class="chapter" 
              :class="{ active: chapter.isOpen }"
            >
              <div class="chapter-header" @click="toggleChapter(chapter.id)">
                <div class="chapter-title">
                  <i :class="chapter.isOpen ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
                  <span>{{ chapter.title }}</span>
                </div>
                <span>{{ chapter.lessonCount }}个视频</span>
              </div>
              <div class="chapter-content">
                <div 
                  v-for="lesson in chapter.lessons" 
                  :key="lesson.id"
                  class="lesson"
                  @click="playVideo(lesson.id, lesson.title)"
                >
                  <div class="lesson-icon">
                    <i class="fas fa-play-circle"></i>
                  </div>
                  <div class="lesson-info">
                    <div class="lesson-title">{{ lesson.title }}</div>
                    <div class="lesson-meta">{{ lesson.duration }}分钟</div>
                  </div>
                  <div class="lesson-action">
                    <i class="fas fa-chevron-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 讲师介绍 -->
      <div v-if="activeTab === 'instructor'" class="tab-content">
        <div class="content-section">
          <h2 class="section-title">讲师介绍</h2>
          <div class="instructor-card">
            <div class="instructor-avatar">张</div>
            <div class="instructor-info">
              <h3>张老师</h3>
              <div class="instructor-title">高级软件工程师</div>
              <p style="margin-bottom: 15px; line-height: 1.5;">
                拥有8年Python开发经验，曾在多家知名互联网公司担任技术负责人。
              </p>
              <div class="instructor-stats">
                <div class="stat">
                  <div class="stat-value">4.8/5.0</div>
                  <div class="stat-label">讲师评分</div>
                </div>
                <div class="stat">
                  <div class="stat-value">24,589</div>
                  <div class="stat-label">学生人数</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 学生评价 -->
      <div v-if="activeTab === 'reviews'" class="tab-content">
        <div class="content-section">
          <h2 class="section-title">学生评价</h2>
          <div v-if="reviews.length === 0" class="empty-state">
            <p>暂无学生评价</p>
          </div>
          <div v-else class="reviews-grid">
            <div 
              v-for="review in reviews" 
              :key="review.id"
              class="review-card"
            >
              <div class="review-header">
                <div class="reviewer">
                  <div class="reviewer-avatar">{{ review.avatar }}</div>
                  <div>
                    <div style="font-weight: 600;">{{ review.name }}</div>
                    <div style="font-size: 0.8rem; color: #5f6368;">{{ review.job }}</div>
                  </div>
                </div>
                <div class="rating">
                  <i v-for="n in Math.floor(review.rating || 5)" :key="n" class="fas fa-star"></i>
                </div>
              </div>
              <div class="review-content">
                {{ review.content }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 相关课程 -->
      <div class="content-section">
        <h2 class="section-title">相关课程推荐</h2>
        <div class="related-courses">
          <CourseCard 
            v-for="relatedCourse in relatedCourses" 
            :key="relatedCourse.id"
            :course="relatedCourse"
          />
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCourseStore } from '@/stores/course'
import CourseCard from '@/components/course/CourseCard.vue'

const route = useRoute()
const courseStore = useCourseStore()
const activeTab = ref('overview')
const loading = ref(true)
const openChapters = ref(new Set()) // 存储展开的章节ID
const isFavorited = ref(false) // 收藏状态
const isEnrolled = ref(false) // 是否已报名

const tabs = ref([
  { id: 'overview', name: '课程介绍' },
  { id: 'curriculum', name: '课程大纲' },
  { id: 'instructor', name: '讲师介绍' },
  { id: 'reviews', name: '学生评价' }
])

// 从 store 获取当前课程数据
const course = computed(() => {
  const c = courseStore.currentCourse
  if (!c) return {
    title: '加载中...',
    description: '',
    rating: 0,
    reviewCount: 0,
    studentCount: 0,
    duration: 0,
    difficulty: '初级'
  }
  
  return {
    id: c.course_id,
    title: c.course_name,
    description: c.course_desc,
    rating: c.rating || 0,
    reviewCount: c.rating_count || 0,
    studentCount: c.student_count || 0,
    duration: Math.ceil((c.course_duration || 0) / 60), // 转换为小时
    difficulty: c.difficulty_level || '初级',
    category: c.category_name || '编程开发',
    teacher: c.teacher_name || '讲师'
  }
})

// 章节数据
const chapters = computed(() => {
  return (courseStore.courseChapters || []).map((ch, index) => ({
    id: ch.chapter_id,
    title: ch.chapter_title,
    lessonCount: ch.videos?.length || 0,
    isOpen: openChapters.value.has(ch.chapter_id) || index === 0, // 检查是否在展开列表中，或默认展开第一个
    lessons: (ch.videos || []).map(v => ({
      id: v.video_id,
      title: v.video_title,
      duration: Math.ceil(v.duration_seconds / 60) // 转换为分钟
    }))
  }))
})

// 评价数据
const reviews = computed(() => {
  const reviewsData = courseStore.courseReviews
  // 确保是数组
  if (!Array.isArray(reviewsData)) {
    return []
  }
  return reviewsData.slice(0, 5).map(r => ({
    id: r.review_id,
    name: r.user_name,
    job: r.occupation || '学员',
    avatar: r.user_name?.charAt(0) || '学',
    content: r.review_content,
    rating: r.rating,
    date: r.created_at
  }))
})

// 相关课程
const relatedCourses = computed(() => {
  return (courseStore.relatedCourses || []).map(c => ({
    id: c.course_id,
    title: c.course_name,
    description: c.course_desc,
    instructor: c.teacher_name,
    students: formatStudentCount(c.student_count),
    rating: c.rating || '5.0',
    difficulty: c.difficulty_level || '初级',
    image: getDefaultGradient(c.course_id)
  }))
})

// 格式化学生数量
const formatStudentCount = (count) => {
  if (!count) return '0'
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}

// 默认渐变背景
const getDefaultGradient = (id) => {
  const gradients = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)'
  ]
  return gradients[id % gradients.length]
}

// 开始学习
const startLearning = async () => {
  const courseId = route.params.id
  
  try {
    // 如果未报名，先报名
    if (!isEnrolled.value) {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('请先登录')
        return
      }
      
      await courseStore.enrollCourse(courseId)
      isEnrolled.value = true
      alert('报名成功！')
    }
    
    // 跳转到第一个视频或课程学习页面
    if (chapters.value.length > 0 && chapters.value[0].lessons.length > 0) {
      const firstVideo = chapters.value[0].lessons[0]
      playVideo(firstVideo.id, firstVideo.title)
    } else {
      alert('该课程暂无视频内容')
    }
  } catch (error) {
    console.error('开始学习失败:', error)
    alert('操作失败，请稍后重试')
  }
}

// 收藏/取消收藏
const toggleFavorite = async () => {
  const courseId = route.params.id
  const token = localStorage.getItem('token')
  
  if (!token) {
    alert('请先登录')
    return
  }
  
  try {
    await courseStore.toggleFavorite(courseId)
    isFavorited.value = !isFavorited.value
    alert(isFavorited.value ? '收藏成功！' : '已取消收藏')
  } catch (error) {
    console.error('收藏操作失败:', error)
    alert('操作失败，请稍后重试')
  }
}

// 播放视频
const playVideo = (videoId, videoTitle) => {
  console.log('播放视频:', videoId, videoTitle)
  // TODO: 实现视频播放功能
  // 可以跳转到视频播放页面或打开弹窗播放
  alert(`即将播放: ${videoTitle}\n\n提示：视频播放功能待实现`)
}

const toggleChapter = (chapterId) => {
  if (openChapters.value.has(chapterId)) {
    openChapters.value.delete(chapterId)
  } else {
    openChapters.value.add(chapterId)
  }
}

onMounted(async () => {
  const courseId = route.params.id
  console.log('加载课程详情:', courseId)
  
  loading.value = true
  try {
    // 并行加载课程详情、章节、相关课程和评价
    await Promise.all([
      courseStore.fetchCourseDetail(courseId),
      courseStore.fetchCourseChapters(courseId),
      courseStore.fetchRelatedCourses(courseId, 3),
      courseStore.fetchCourseReviews(courseId, { limit: 10 })
    ])
    
    console.log('课程详情加载完成:', courseStore.currentCourse)
    console.log('课程章节:', courseStore.courseChapters)
    console.log('课程评价:', courseStore.courseReviews)
    
    // 默认展开第一个章节
    if (courseStore.courseChapters && courseStore.courseChapters.length > 0) {
      openChapters.value.add(courseStore.courseChapters[0].chapter_id)
    }
  } catch (error) {
    console.error('加载课程详情失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.course-detail {
  min-height: 100vh;
}

/* 加载状态 */
.loading-section {
  text-align: center;
  padding: 100px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1a73e8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 课程头部样式 */
.course-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 40px 0;
  margin-bottom: 30px;
}

.course-info {
  max-width: 800px;
}

.course-category {
  background: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  display: inline-block;
  margin-bottom: 15px;
}

.course-info h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.course-description {
  font-size: 1rem;
  margin-bottom: 20px;
  opacity: 0.9;
  line-height: 1.5;
}

.course-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
}

.course-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: #1a73e8;
  color: white;
}

.btn-primary:hover {
  background: #0d5bb9;
}

.btn-secondary {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
}

.btn-secondary:hover {
  background: rgba(255,255,255,0.3);
}

/* 标签页样式 */
.tabs {
  display: flex;
  background: white;
  border-radius: 10px;
  padding: 8px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  overflow-x: auto;
}

.tab {
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 0.9rem;
}

.tab.active {
  background: #e8f0fe;
  color: #1a73e8;
  font-weight: 600;
}

/* 内容区域样式 */
.content-section {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.section-title {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: #202124;
}

/* 课程介绍样式 */
.course-overview {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.overview-content {
  line-height: 1.6;
}

.overview-content h3 {
  margin: 15px 0 8px;
  color: #202124;
  font-size: 1rem;
}

.overview-content ul {
  margin-left: 20px;
  margin-bottom: 15px;
}

.overview-content li {
  margin-bottom: 5px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.feature-item {
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 6px;
}

.feature-icon {
  font-size: 1.5rem;
  color: #1a73e8;
  margin-bottom: 8px;
}

.feature-item h4 {
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.feature-item p {
  font-size: 0.8rem;
  color: #5f6368;
}

/* 章节样式 */
.chapter {
  margin-bottom: 20px;
  border: 1px solid #dadce0;
  border-radius: 8px;
  overflow: hidden;
}

.chapter-header {
  background: #f8f9fa;
  padding: 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chapter-title {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.chapter-content {
  padding: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.chapter.active .chapter-content {
  padding: 15px;
  max-height: 1000px;
}

.lesson {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #dadce0;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin-bottom: 5px;
}

.lesson:last-child {
  border-bottom: none;
}

.lesson:hover {
  background: #f8f9fa;
  transform: translateX(5px);
}

.lesson:hover .lesson-icon {
  background: #1a73e8;
  color: white;
}

.lesson-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e8f0fe;
  color: #1a73e8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.lesson-info {
  flex: 1;
}

.lesson-action {
  color: #5f6368;
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lesson:hover .lesson-action {
  opacity: 1;
}

.lesson-title {
  font-weight: 500;
  margin-bottom: 2px;
  font-size: 0.9rem;
}

.lesson-meta {
  font-size: 0.8rem;
  color: #5f6368;
}

/* 讲师信息样式 */
.instructor-card {
  display: flex;
  gap: 15px;
  align-items: center;
}

.instructor-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a73e8, #6c8ef5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}

.instructor-info h3 {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.instructor-title {
  color: #1a73e8;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.instructor-stats {
  display: flex;
  gap: 15px;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 1rem;
  font-weight: bold;
  color: #1a73e8;
}

.stat-label {
  font-size: 0.8rem;
  color: #5f6368;
}

/* 评价样式 */
.reviews-grid {
  display: grid;
  gap: 15px;
}

.review-card {
  padding: 15px;
  border: 1px solid #dadce0;
  border-radius: 8px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 10px;
}

.reviewer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reviewer-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #1a73e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.rating {
  color: #f9ab00;
  font-size: 0.9rem;
}

.review-content {
  color: #202124;
  line-height: 1.5;
  font-size: 0.9rem;
}

/* 相关课程样式 */
.related-courses {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #5f6368;
}

.empty-state p {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .course-meta {
    gap: 15px;
  }
  
  .course-actions {
    flex-direction: column;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .related-courses {
    grid-template-columns: 1fr;
  }
}
</style>