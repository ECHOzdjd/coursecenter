<template>
  <div class="search-results">
    <!-- 搜索头部 -->
    <section class="search-header">
      <div class="container">
        <div class="search-box">
          <input 
            type="text" 
            class="search-input" 
            placeholder="搜索课程、技能或知识点..."
            v-model="searchQuery"
            @keyup.enter="performSearch"
          >
          <button class="search-btn" @click="performSearch">
            <i class="fas fa-search"></i>
          </button>
        </div>
        
        <div class="search-meta" v-if="searchQuery">
          <span class="result-count">找到 {{ searchResults.length }} 个相关结果</span>
          <span class="search-keyword">关键词: "{{ searchQuery }}"</span>
        </div>
      </div>
    </section>

    <div class="container">
      <!-- 搜索建议（无搜索结果时显示） -->
      <div v-if="!searchQuery && !hasSearched" class="suggestions-section">
        <div class="popular-searches">
          <h3>热门搜索</h3>
          <div class="popular-tags">
            <span 
              v-for="tag in popularTags" 
              :key="tag"
              class="search-tag"
              @click="searchByTag(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div v-else class="search-results-content">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-section">
          <div class="loading-spinner"></div>
          <p>正在搜索中...</p>
        </div>

        <!-- 无结果 -->
        <div v-else-if="searchResults.length === 0 && hasSearched" class="no-results">
          <div class="no-results-icon">
            <i class="fas fa-search"></i>
          </div>
          <h3>没有找到相关课程</h3>
          <p>建议您尝试其他关键词或浏览课程分类</p>
          <button class="btn-primary" @click="clearSearch">返回浏览课程</button>
        </div>

        <!-- 有结果 -->
        <div v-else-if="searchResults.length > 0" class="results-section">
          <div class="results-header">
            <h2 class="section-title">搜索结果</h2>
            <div class="sort-options">
              <select v-model="sortBy" class="sort-select">
                <option value="relevance">按相关性</option>
                <option value="rating">按评分</option>
                <option value="students">按学习人数</option>
                <option value="newest">按最新发布</option>
              </select>
            </div>
          </div>

          <div class="results-grid">
            <CourseCard 
              v-for="course in sortedResults" 
              :key="course.id"
              :course="course"
            />
          </div>
        </div>
      </div>

      <!-- 推荐课程（搜索后显示） -->
      <div v-if="hasSearched && searchResults.length > 0" class="recommended-section">
        <h2 class="section-title">相关推荐</h2>
        <div class="courses-grid">
          <CourseCard 
            v-for="course in recommendedCourses" 
            :key="course.id"
            :course="course"
          />
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Footer from '@/components/layout/Footer.vue'
import CourseCard from '@/components/course/CourseCard.vue'

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const searchResults = ref([])
const isLoading = ref(false)
const hasSearched = ref(false)
const sortBy = ref('relevance')

// 热门搜索标签
const popularTags = ref([
  'Python', '机器学习', '前端开发', '数据分析', 
  'UI设计', '项目管理', '英语学习', '人工智能'
])

// 推荐课程数据
const recommendedCourses = ref([
  {
    id: 10,
    title: 'Vue.js实战开发',
    description: '掌握Vue.js框架，构建现代化Web应用',
    instructor: '前端导师',
    students: '3.8k',
    rating: 4.8,
    difficulty: '中级',
    image: 'linear-gradient(135deg, #42b883, #347474)'
  },
  {
    id: 11,
    title: 'Node.js后端开发',
    description: '学习使用Node.js构建高性能后端服务',
    instructor: '后端专家',
    students: '2.9k',
    rating: 4.7,
    difficulty: '中级',
    image: 'linear-gradient(135deg, #68b588, #8dc26f)'
  }
])

// 计算排序后的结果
const sortedResults = computed(() => {
  const results = [...searchResults.value]
  
  switch (sortBy.value) {
    case 'rating':
      return results.sort((a, b) => b.rating - a.rating)
    case 'students':
      return results.sort((a, b) => parseInt(b.students) - parseInt(a.students))
    case 'newest':
      return results.sort((a, b) => b.id - a.id)
    default:
      return results
  }
})

// 执行搜索
const performSearch = async () => {
  if (!searchQuery.value.trim()) return

  isLoading.value = true
  hasSearched.value = true

  try {
    // 调用后端搜索 API
    const response = await fetch(`http://localhost:3000/api/courses?keyword=${encodeURIComponent(searchQuery.value)}`)
    const result = await response.json()
    
    if (result.success) {
      // 处理返回的课程数据
      searchResults.value = (result.data.courses || []).map(course => ({
        id: course.course_id,
        title: course.course_name,
        description: course.course_desc,
        instructor: course.teacher_name,
        students: formatStudentCount(course.student_count),
        rating: course.rating || '5.0',
        difficulty: course.difficulty_level || '初级',
        image: getDefaultGradient(course.course_id)
      }))
    } else {
      searchResults.value = []
    }
  } catch (error) {
    console.error('搜索失败:', error)
    searchResults.value = []
  } finally {
    isLoading.value = false
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

// 通过标签搜索
const searchByTag = (tag) => {
  searchQuery.value = tag
  performSearch()
}

// 清空搜索
const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  hasSearched.value = false
  router.push('/')
}

// 初始化
onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q
    performSearch()
  }
})
</script>

<style scoped>
.search-results {
  min-height: 100vh;
}

.search-header {
  background: linear-gradient(135deg, #1a73e8, #6c8ef5);
  color: white;
  padding: 40px 0;
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
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
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

.search-meta {
  text-align: center;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.result-count, .search-keyword {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 搜索建议 */
.suggestions-section {
  padding: 60px 0;
  text-align: center;
}

.popular-searches h3 {
  margin-bottom: 20px;
  color: #202124;
  font-size: 1.3rem;
}

.popular-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.search-tag {
  background: white;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #dadce0;
  font-size: 0.9rem;
}

.search-tag:hover {
  background: #1a73e8;
  color: white;
  border-color: #1a73e8;
}

/* 搜索结果 */
.search-results-content {
  padding: 40px 0;
}

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

.no-results {
  text-align: center;
  padding: 80px 0;
}

.no-results-icon {
  font-size: 4rem;
  color: #dadce0;
  margin-bottom: 20px;
}

.no-results h3 {
  margin-bottom: 10px;
  color: #202124;
}

.no-results p {
  color: #5f6368;
  margin-bottom: 30px;
}

.btn-primary {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.btn-primary:hover {
  background: #0d5bb9;
}

/* 结果头部 */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.section-title {
  font-size: 1.5rem;
  color: #202124;
}

.sort-select {
  padding: 8px 16px;
  border: 1px solid #dadce0;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}

/* 推荐课程 */
.recommended-section {
  padding: 40px 0;
  border-top: 1px solid #dadce0;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .results-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .results-grid,
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .search-meta {
    flex-direction: column;
    gap: 10px;
  }
}
</style>