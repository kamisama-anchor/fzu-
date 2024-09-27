// pages/index3/index3.js
const app = getApp();

Page({
  data: {
    latestRecord: null, // 使用null初始化
    comment: '',
    comments: []
  },

  onLoad: function() {
    this.readLatestRecord();

  },
  
  

  clickBtn: function() {
    this.readLatestRecord();
  },

 
  readLatestRecord: function() {
    const db = wx.cloud.database(); // 获取数据库的引用
    const users = db.collection('users'); // 获取users集合的引用

    // 使用orderBy和limit方法来查询timestamp最新的记录
    users.orderBy('timestamp', 'desc').limit(1).get({
      success: res => {
        // 查询成功，获取最新的记录
        if (res.data.length > 0) {
          const latestRecord = res.data[0];
          // 将查询结果存储在页面数据中
          this.setData({
            latestRecord: latestRecord
          });
          console.log('最新的记录：', latestRecord);
        } else {
          console.log('没有查询到记录');
          this.setData({
            latestRecord: {
              name: '暂时未开启点名'
            }
          });
        }
      },
      fail: err => {
        // 查询失败的处理逻辑
        console.error('查询失败：', err);
      }
    });
  },
  loadComments: function() {
    const db = wx.cloud.database();
    // 按创建时间降序排序
    db.collection('comments').orderBy('createTime', 'desc').get({
      success: res => {
        if (res.data.length > 0) {
          this.setData({
            comments: res.data
          });
        } else {
          console.log('没有查询到评论');
        }
      },
      fail: err => {
        console.error('查询失败：', err);
      }
    });
  }
});
