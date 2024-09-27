Page({
    enterAttendance: function() {
        wx.navigateTo({
            url: '/pages/change/change'
          });
    },
    gotoindex2: function() {
        // 这里写跳转到 index2 页面的代码
        wx.navigateTo({
          url: '/pages/index2/index2' // 确保路径正确
        });
      },
      goBack: function() {
        wx.navigateBack({
          delta: 1 // 返回上一页面
        });
      }  
  });