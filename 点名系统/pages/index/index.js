// pages/login/login.js
const app = getApp();

Page({
    data: {
      id: '', // 学号
      name: '' // 姓名
    },
    bindidInput(e) {
      this.setData({
        id: e.detail.value
      });
    },
    bindnameInput(e) {
      this.setData({
        name: e.detail.value
      });
    },
    login() {
      var that = this;
      // 假设正确的学号和姓名
      const correctId = '33210' ;
      const correctName = '33210';
  
      if (!that.data.id) {
        wx.showToast({ title: '请输入学号', icon: 'none' });
        return;
      }
      if (!that.data.name) {
        wx.showToast({ title: '请输入姓名', icon: 'none' });
        return;
      }
      
      // 验证学号和姓名是否正确
      if (that.data.id === correctId && that.data.name === correctName) {
        wx.showToast({ title: '登录成功！', icon: 'success' });
        wx.navigateTo({
          url: '/pages/index2/index2' // 确保路径正确
        });
      } else if(!that.data.id || !that.data.name){
        wx.showToast({ title: '学号或姓名错误', icon: 'none' });
      }
      else
      {
        const app = getApp();
        let db = wx.cloud.database() //设置数据库
        let user = db.collection('user_ol')
        let num = parseInt(that.data.id, 10);
        app.globalData.myname = that.data.name
        app.globalData.mynum = num
        user.add({
          data: {
              num:  num,
              name: that.data.name
            }
        }).then(res => {
          console.log('添加成功',res)
        }).catch(err => {
          console.log('添加失败',err)//失败提示错误信息
        })
        wx.navigateTo({
            url: '/pages/index3/index3' // 确保路径正确
          });
      }
    },
    
    forgotPwd() {
      wx.showToast({ title: '忘记信息', icon: 'none' });
    },
  });