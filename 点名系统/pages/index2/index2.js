Page({  
    // 发起签到  
    startAttendance: function() {  
      // 这里可以添加发起签到的代码  
      wx.navigateTo({
        url: '/pages/index5/index5'
      });
    },  
    
    // 管理学生  
    gotorank: function() {  
      // 这里可以添加管理学生的代码  
      wx.navigateTo({
        url: '/pages/rankk/rankk'
      });
    },
    gotostu: function() {
        wx.navigateTo({
            url: '/pages/upload_stu/upload_stu'
          });
      },
      goBack: function() {
        wx.navigateBack({
          delta: 1 // 返回上一页面
        });
      }  
  });