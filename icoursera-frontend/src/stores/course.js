import { defineStore } from 'pinia'
import { courseAPI } from '@/api/courses'

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: [],
    recommendedCourses: [],
    popularCourses: [],
    newestCourses: [],
    currentCourse: null,
    courseChapters: [],
    relatedCourses: [],
    categories: [],
    topTeachers: [],
    searchResults: [],
    courseReviews: [],
    myCourses: [],
    loading: false
  }),

  actions: {
    async fetchRecommendedCourses(limit = 6) {
      this.loading = true
      try {
        const data = await courseAPI.getRecommendedCourses(limit)
        this.recommendedCourses = data
        return data
      } catch (error) {
        console.error('获取推荐课程失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPopularCourses(limit = 6) {
      this.loading = true
      try {
        const data = await courseAPI.getPopularCourses(limit)
        this.popularCourses = data
        return data
      } catch (error) {
        console.error('获取热门课程失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchNewestCourses(limit = 6) {
      this.loading = true
      try {
        const data = await courseAPI.getNewestCourses(limit)
        this.newestCourses = data
        return data
      } catch (error) {
        console.error('获取最新课程失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCourses(params = {}) {
      this.loading = true
      try {
        const data = await courseAPI.getCourses(params)
        // data 格式: {courses: [...], pagination: {...}}
        this.courses = data.courses || []
        return data
      } catch (error) {
        console.error('获取课程列表失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async searchCourses(keyword, params = {}) {
      this.loading = true
      try {
        const data = await courseAPI.searchCourses(keyword, params)
        // data 格式: {courses: [...], pagination: {...}}
        this.searchResults = data.courses || []
        return data
      } catch (error) {
        console.error('搜索课程失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCourseDetail(courseId) {
      this.loading = true
      try {
        const data = await courseAPI.getCourseDetail(courseId)
        this.currentCourse = data
        return data
      } catch (error) {
        console.error('获取课程详情失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCourseChapters(courseId) {
      this.loading = true
      try {
        const data = await courseAPI.getCourseChapters(courseId)
        this.courseChapters = data
        return data
      } catch (error) {
        console.error('获取课程章节失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchRelatedCourses(courseId, limit = 4) {
      try {
        const data = await courseAPI.getRelatedCourses(courseId, limit)
        this.relatedCourses = data
        return data
      } catch (error) {
        console.error('获取相关课程失败:', error)
        throw error
      }
    },

    async fetchCategories() {
      try {
        const data = await courseAPI.getCategories()
        // 映射后端字段到前端格式
        this.categories = data.map(cat => ({
          id: cat.category_id,
          name: cat.category_name,
          icon: cat.category_icon,
          courseCount: cat.course_count,
          parentId: cat.parent_category_id,
          sortOrder: cat.sort_order
        }))
        return this.categories
      } catch (error) {
        console.error('获取分类失败:', error)
        throw error
      }
    },

    async fetchTopTeachers(limit = 6) {
      try {
        const data = await courseAPI.getTopTeachers(limit)
        this.topTeachers = data
        return data
      } catch (error) {
        console.error('获取明星讲师失败:', error)
        throw error
      }
    },

    async fetchCourseReviews(courseId, params = {}) {
      try {
        const data = await courseAPI.getCourseReviews(courseId, params)
        // data 格式: {reviews: [...], pagination: {...}}
        this.courseReviews = data.reviews || []
        return data
      } catch (error) {
        console.error('获取课程评价失败:', error)
        this.courseReviews = []
        throw error
      }
    },

    async fetchMyCourses() {
      this.loading = true
      try {
        const data = await courseAPI.getMyCourses()
        this.myCourses = data
        return data
      } catch (error) {
        console.error('获取我的课程失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async enrollCourse(courseId) {
      try {
        const data = await courseAPI.enrollCourse(courseId)
        return data
      } catch (error) {
        console.error('报名课程失败:', error)
        throw error
      }
    },

    async toggleFavorite(courseId) {
      try {
        const data = await courseAPI.toggleFavorite(courseId)
        return data
      } catch (error) {
        console.error('收藏操作失败:', error)
        throw error
      }
    },

    async updateProgress(courseId, progress) {
      try {
        const data = await courseAPI.updateProgress(courseId, progress)
        return data
      } catch (error) {
        console.error('更新进度失败:', error)
        throw error
      }
    },

    async addReview(courseId, reviewData) {
      try {
        const data = await courseAPI.addReview(courseId, reviewData)
        return data
      } catch (error) {
        console.error('添加评价失败:', error)
        throw error
      }
    }
  }
})
