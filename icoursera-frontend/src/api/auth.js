import request from '@/utils/request'

// 用户认证相关API
export const authAPI = {
  // 用户注册
  register(data) {
    return request({
      url: '/auth/register',
      method: 'post',
      data
    })
  },

  // 用户登录
  login(data) {
    return request({
      url: '/auth/login',
      method: 'post',
      data
    })
  },

  // 获取当前用户信息
  getCurrentUser() {
    return request({
      url: '/auth/me',
      method: 'get'
    })
  },

  // 更新用户信息
  updateProfile(data) {
    return request({
      url: '/auth/profile',
      method: 'put',
      data
    })
  },

  // 修改密码
  changePassword(data) {
    return request({
      url: '/auth/password',
      method: 'put',
      data
    })
  }
}

export default authAPI
