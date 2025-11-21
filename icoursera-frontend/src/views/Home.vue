<template>
  <div class="home">
    <!-- 搜索区域 -->
    <section class="search-section">
      <div class="search-container">
        <h1>探索优质在线课程</h1>
        <p>AI驱动的个性化学习推荐，助你快速成长</p>
        <div class="search-box">
          <input
            type="text"
            class="search-input"
            placeholder="搜索课程、技能或知识点..."
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </section>

    <div class="container">
      <!-- 加载状态 -->
      <div v-if="courseStore.loading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- 课程分类 -->
      <section v-if="categories.length > 0" class="module-section">
        <div class="module-header">
          <h2 class="section-title">
            <i class="fas fa-th-large"></i> 课程分类
          </h2>
          <a href="#" class="view-all"
            >查看全部 <i class="fas fa-chevron-right"></i
          ></a>
        </div>
        <div class="categories-grid">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-card"
            @click="handleCategoryClick(category.id)"
          >
            <div class="category-icon">
              <i :class="category.icon || 'fas fa-folder'"></i>
            </div>
            <h3 class="category-title">{{ category.name }}</h3>
            <p class="category-count">{{ category.courseCount || 0 }} 课程</p>
          </div>
        </div>
      </section>

      <!-- 课程筛选器 -->
      <section class="module-section">
        <div class="filters">
          <button
            v-for="filter in filters"
            :key="filter.id"
            class="filter-btn"
            :class="{ active: activeFilter === filter.id }"
            @click="handleFilterClick(filter.id)"
          >
            {{ filter.name }}
          </button>
        </div>
      </section>

      <!-- 明星讲师 -->
      <section v-if="instructors.length > 0" class="module-section">
        <div class="module-header">
          <h2 class="section-title">
            <i class="fas fa-user-tie"></i> 明星讲师
          </h2>
          <a href="#" class="view-all"
            >查看全部 <i class="fas fa-chevron-right"></i
          ></a>
        </div>
        <div class="instructors-grid">
          <div
            v-for="instructor in instructors"
            :key="instructor.user_id"
            class="instructor-card"
          >
            <div class="instructor-avatar">{{ getAvatarText(instructor.user_name) }}</div>
            <div class="instructor-info">
              <h3>{{ instructor.user_name }}</h3>
              <p>{{ instructor.course_count }} 门课程 · {{ instructor.total_students }} 学生</p>
              <div class="instructor-rating">
                <i class="fas fa-star"></i>
                <span>{{ instructor.avg_rating ? Number(instructor.avg_rating).toFixed(1) : '5.0' }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 推荐课程 -->
      <section v-if="recommendedCourses.length > 0" class="module-section">
        <div class="module-header">
          <h2 class="section-title"><i class="fas fa-fire"></i> 为你推荐</h2>
          <a href="#" class="view-all"
            >查看全部 <i class="fas fa-chevron-right"></i
          ></a>
        </div>
        <div class="courses-grid">
          <CourseCard
            v-for="course in recommendedCourses"
            :key="course.id"
            :course="formatCourseData(course)"
          />
        </div>
      </section>

      <!-- 热门课程 -->
      <section v-if="popularCourses.length > 0" class="module-section">
        <div class="module-header">
          <h2 class="section-title">
            <i class="fas fa-chart-line"></i> 热门课程
          </h2>
          <a href="#" class="view-all"
            >查看全部 <i class="fas fa-chevron-right"></i
          ></a>
        </div>
        <div class="courses-grid">
          <CourseCard
            v-for="course in popularCourses"
            :key="course.id"
            :course="formatCourseData(course)"
          />
        </div>
      </section>

      <!-- 新上线课程 -->
      <section v-if="newCourses.length > 0" class="module-section">
        <div class="module-header">
          <h2 class="section-title">
            <i class="fas fa-rocket"></i> 新上线课程
          </h2>
          <a href="#" class="view-all"
            >查看全部 <i class="fas fa-chevron-right"></i
          ></a>
        </div>
        <div class="courses-grid">
          <CourseCard
            v-for="course in newCourses"
            :key="course.id"
            :course="formatCourseData(course)"
          />
        </div>
      </section>

      <!-- 空状态 -->
      <div v-if="!courseStore.loading && categories.length === 0" class="empty-state">
        <p>暂无数据</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from 'vue-router';
import { useCourseStore } from '@/stores/course';
import CourseCard from "@/components/course/CourseCard.vue";

const router = useRouter();
const courseStore = useCourseStore();

const searchKeyword = ref("");
const activeFilter = ref("all");

// 使用计算属性获取store中的数据
const categories = computed(() => courseStore.categories || [])
const instructors = computed(() => courseStore.topTeachers || [])
const recommendedCourses = computed(() => courseStore.recommendedCourses || [])
const popularCourses = computed(() => courseStore.popularCourses || [])
const newCourses = computed(() => courseStore.newestCourses || [])

// 筛选器数据
const filters = computed(() => [
  { id: 'all', name: '全部' },
  ...categories.value.map(cat => ({
    id: cat.id,
    name: cat.name
  }))
])

// 初始化数据
onMounted(async () => {
  try {
    console.log('开始加载首页数据...')
    // 并行获取首页所有数据 - 每个模块只显示3个
    await Promise.all([
      courseStore.fetchCategories().then(() => console.log('✅ 分类加载成功', courseStore.categories)),
      courseStore.fetchTopTeachers(3).then(() => console.log('✅ 讲师加载成功', courseStore.topTeachers)),
      courseStore.fetchRecommendedCourses(3).then(() => console.log('✅ 推荐课程加载成功', courseStore.recommendedCourses)),
      courseStore.fetchPopularCourses(3).then(() => console.log('✅ 热门课程加载成功', courseStore.popularCourses)),
      courseStore.fetchNewestCourses(3).then(() => console.log('✅ 最新课程加载成功', courseStore.newestCourses))
    ])
    console.log('🎉 所有数据加载完成')
  } catch (error) {
    console.error('❌ 初始化数据失败:', error)
    // 可以在这里设置默认数据或显示错误信息
  }
})

// 搜索处理
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchKeyword.value.trim() }
    })
  }
}

// 分类点击
const handleCategoryClick = (categoryId) => {
  activeFilter.value = categoryId
  handleFilterClick(categoryId)
}

// 筛选处理
const handleFilterClick = async (filterId) => {
  activeFilter.value = filterId
  try {
    if (filterId === 'all') {
      const result = await courseStore.fetchCourses()
      // result 是 {courses: [...], pagination: {...}}
      courseStore.recommendedCourses = result.courses || []
    } else {
      const result = await courseStore.fetchCourses({ category_id: filterId })
      // result 是 {courses: [...], pagination: {...}}
      courseStore.recommendedCourses = result.courses || []
    }
  } catch (error) {
    console.error('筛选课程失败:', error)
  }
}

// 工具函数：获取头像文字
const getAvatarText = (name) => {
  return name ? name.charAt(0) : '用'
}

// 格式化课程数据，适配CourseCard组件
const formatCourseData = (course) => {
  const courseId = course.course_id || course.id
  const coverImg = course.cover_img || course.coverImage
  
  // 如果有图片URL，需要确保是完整路径
  let imageValue
  if (coverImg && coverImg.trim()) {
    // 如果是 placeholder.com 外部图片，通过后端代理加载
    if (coverImg.includes('placeholder.com')) {
      imageValue = `url(http://localhost:3000/api/proxy/image?url=${encodeURIComponent(coverImg)})`
    }
    // 如果是完整的 HTTP URL（非 placeholder），直接使用
    else if (coverImg.startsWith('http')) {
      imageValue = `url(${coverImg})`
    }
    // 如果是本地上传的图片路径
    else if (coverImg.startsWith('/uploads')) {
      imageValue = `url(http://localhost:3000${coverImg})`
    }
    // 其他情况使用渐变背景
    else {
      imageValue = getDefaultGradient(courseId)
    }
  } else {
    // 使用默认渐变背景
    imageValue = getDefaultGradient(courseId)
  }
  
  return {
    id: courseId,
    title: course.course_name || course.title,
    description: course.course_desc || course.description,
    instructor: course.teacher_name || course.instructor || course.teacherName,
    students: formatStudentCount(course.student_count || course.studentCount),
    rating: course.rating || '5.0',
    difficulty: course.difficulty_level || course.difficulty || '初级',
    image: imageValue
  }
}

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
</script>

<style scoped>
/* 原有的样式保持不变，只添加加载状态样式 */

.loading-section {
  text-align: center;
  padding: 60px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1a73e8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #5f6368;
}

/* 原有的其他样式保持不变 */
.home {
  min-height: 100vh;
}

.search-section {
  background: linear-gradient(135deg, #1a73e8, #6c8ef5);
  color: white;
  padding: 60px 0;
  margin-bottom: 40px;
}

.search-container {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-container h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.search-container p {
  font-size: 1.1rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.search-box {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 15px 50px 15px 20px;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: #1a73e8;
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.module-section {
  margin-bottom: 50px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.5rem;
  color: #202124;
  display: flex;
  align-items: center;
  gap: 10px;
}

.view-all {
  color: #1a73e8;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.category-card {
  background: white;
  border-radius: 12px;
  padding: 25px 20px;
  text-align: center;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.category-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #1a73e8;
}

.category-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.category-count {
  color: #5f6368;
  font-size: 0.9rem;
}

.instructors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

.instructor-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.instructor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.instructor-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #1a73e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.instructor-info h3 {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.instructor-info p {
  color: #5f6368;
  font-size: 0.9rem;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  padding: 10px 20px;
  border: 1px solid #dadce0;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  white-space: nowrap;
}

.filter-btn.active,
.filter-btn:hover {
  background: #1a73e8;
  color: white;
  border-color: #1a73e8;
}

@media (max-width: 768px) {
  .search-container h1 {
    font-size: 2rem;
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .instructors-grid,
  .courses-grid {
    grid-template-columns: 1fr;
  }
}
</style>