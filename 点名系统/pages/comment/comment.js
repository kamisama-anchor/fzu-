const app = getApp();

Page({
  data: {
    latestRecord: null, // 使用null初始化
    comment: '',
    comments: [],
    hasMoreComments: true, // 是否还有更多评论
  },

  onLoad: function() {
    this.loadMoreComments();
  },
  
  bindCommentInput: function(e) {
    // 绑定输入框的输入事件
    this.setData({
      comment: e.detail.value
    });
  },

  clickBtn: function() {
    this.loadMoreComments();
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
        createTime: db.serverDate(), // 设置当前服务器时间
        name: app.globalData.myname
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
        // 重新加载评论
        this.loadMoreComments();
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

  loadMoreComments: function() {
    const db = wx.cloud.database();
    let that = this;
    let pageSize = 20; // 每页数据量
    let page = 0; // 当前页码
    let allComments = this.data.comments; // 存储所有评论

    function getData() {
      db.collection('comments').orderBy('createTime', 'desc').skip(page * pageSize).limit(pageSize).get({
        success: res => {
          console.log('评论', res.data);
          if (res.data.length > 0) {
            allComments = allComments.concat(res.data); // 将新获取的评论添加到数组中
            that.setData({
              comments: allComments
            });
            page++;
            if (res.data.length < pageSize) {
              // 如果返回的数据少于pageSize，说明已经获取完所有评论
              that.setData({
                hasMoreComments: false
              });
            }
          } else {
            console.log('没有查询到更多评论');
            that.setData({
              hasMoreComments: false
            });
          }
        },
        fail: err => {
          console.error('查询失败：', err);
        }
      });
    }

    getData(); // 调用函数开始获取评论
  }
});
