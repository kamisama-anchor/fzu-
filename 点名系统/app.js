// app.js
App({})
wx.cloud.init({
    env: 'software-9g3qgled9f6190ea' // 你的环境ID
  })
  App({
    globalData: {
      mynum: 0 ,
      myname:'',
    },
      onLaunch: function () {
        wx.cloud.init({
          env: 'software-9g3qgled9f6190ea', // 替换为你的云开发环境ID
          traceUser: false, // 是否在将用户访问记录到用户管理中，在控制台中可见，默认为false
        });
      },
      onHide: function(){
        const app = getApp();
        let db = wx.cloud.database(); //设置数据库
        let user = db.collection('user_ol');//单引号里为刚刚新建的集合名
        user.where({
	//先查询
        num: app.globalData.mynum
      }).remove().then(res => {
        console.log('删除成功')
      }).catch(err => {
        console.log('删除失败',err)//失败提示错误信息
      })

      },
    });