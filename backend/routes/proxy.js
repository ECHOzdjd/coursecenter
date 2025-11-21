const express = require('express');
const router = express.Router();
const axios = require('axios');

// 图片代理路由
router.get('/image', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ 
        success: false, 
        message: '缺少图片URL参数' 
      });
    }

    // 获取外部图片
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // 设置响应头
    const contentType = response.headers['content-type'];
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400'); // 缓存1天
    
    // 返回图片数据
    res.send(response.data);
  } catch (error) {
    console.error('图片代理失败:', error.message);
    res.status(500).json({ 
      success: false, 
      message: '获取图片失败' 
    });
  }
});

module.exports = router;
