const app = getApp();

Page({
  data: {
    latestRecord: null, // 使用null初始化
    comment: '',
    comments: []
  },

  onLoad: function() {
    this.loadComments();
  },
  
  bindCommentInput: function(e) {
    // 绑定输入框的输入事件
    this.setData({
      comment: e.detail.value
    });
  },

  clickBtn: function() {
    this.loadComments();
  },

  submitComment: function() {
    // 提交评论的逻辑
    const db = wx.cloud.database();
    const _ = db.command;

    if (this.data.comment.trim() === '') {
      wx.showToast({
        title: '评论不能为空',
        icon: 'none'
      });
      return;
    }

    // 添加评论到数据库
    db.collection('comments').add({
      data: {
        content: this.data.comment,
        createTime: _.set(db.serverDate()), // 设置当前服务器时间
        name:app.globalData.myname
      },
      success: res => {
        console.log('评论添加成功', res);
        wx.showToast({
          title: '评论成功',
          icon: 'success'
        });
        // 清空输入框
        this.setData({
          comment: ''
        });
      },
      fail: err => {
        console.error('评论添加失败', err);
        wx.showToast({
          title: '评论失败',
          icon: 'none'
        });
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
