import request from '@/utils/request'

// 课程相关API
export const courseAPI = {
  // 获取推荐课程
  getRecommendedCourses(limit = 6) {
    return request({
      url: '/courses/recommended',
      method: 'get',
      params: { limit }
    })
  },

  // 获取热门课程
  getPopularCourses(limit = 6) {
    return request({
      url: '/courses/popular',
      method: 'get',
      params: { limit }
    })
  },

  // 获取最新课程
  getNewestCourses(limit = 6) {
    return request({
      url: '/courses/newest',
      method: 'get',
      params: { limit }
    })
  },

  // 获取课程列表
  getCourses(params) {
    return request({
      url: '/courses',
      method: 'get',
      params
    })
  },

  // 搜索课程
  searchCourses(keyword, params = {}) {
    return request({
      url: '/courses',
      method: 'get',
      params: { keyword, ...params }
    })
  },

  // 获取课程详情
  getCourseDetail(courseId) {
    return request({
      url: `/courses/${courseId}`,
      method: 'get'
    })
  },

  // 获取课程章节
  getCourseChapters(courseId) {
    return request({
      url: `/courses/${courseId}/chapters`,
      method: 'get'
    })
  },

  // 获取相关课程
  getRelatedCourses(courseId, limit = 4) {
    return request({
      url: `/courses/${courseId}/related`,
      method: 'get',
      params: { limit }
    })
  },

  // 获取课程分类
  getCategories() {
    return request({
      url: '/categories',
      method: 'get'
    })
  },

  // 获取分类详情
  getCategoryDetail(categoryId) {
    return request({
      url: `/categories/${categoryId}`,
      method: 'get'
    })
  },

  // 获取明星讲师
  getTopTeachers(limit = 6) {
    return request({
      url: '/teachers/top',
      method: 'get',
      params: { limit }
    })
  },

  // 报名课程
  enrollCourse(courseId) {
    return request({
      url: `/courses/${courseId}/enroll`,
      method: 'post'
    })
  },

  // 收藏/取消收藏课程
  toggleFavorite(courseId) {
    return request({
      url: `/courses/${courseId}/favorite`,
      method: 'post'
    })
  },

  // 更新学习进度
  updateProgress(courseId, progress) {
    return request({
      url: `/courses/${courseId}/progress`,
      method: 'put',
      data: { progress }
    })
  },

  // 获取我的课程
  getMyCourses() {
    return request({
      url: '/courses/my/enrolled',
      method: 'get'
    })
  },

  // 获取课程评价列表
  getCourseReviews(courseId, params = {}) {
    return request({
      url: `/reviews/course/${courseId}`,
      method: 'get',
      params
    })
  },

  // 添加评价
  addReview(courseId, data) {
    return request({
      url: `/reviews/course/${courseId}`,
      method: 'post',
      data
    })
  },

  // 更新评价
  updateReview(reviewId, data) {
    return request({
      url: `/reviews/${reviewId}`,
      method: 'put',
      data
    })
  },

  // 删除评价
  deleteReview(reviewId) {
    return request({
      url: `/reviews/${reviewId}`,
      method: 'delete'
    })
  }
}

export default courseAPI