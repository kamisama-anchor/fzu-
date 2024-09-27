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
      const correctId = '33210';
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
      } else {
        const app = getApp();
        let db = wx.cloud.database(); // 设置数据库
        let user_ol = db.collection('user_ol');
        let users = db.collection('users');
        let num = parseInt(that.data.id, 10);
        app.globalData.myname = that.data.name;
        app.globalData.mynum = num;
        users.where({
          name: app.globalData.myname,
          num: app.globalData.mynum
        }).get({
          success: res => {
            if (res.data.length > 0) {
              // 如果查询到数据
              that.addtemp(); // 确保这里使用 that 调用 addtemp
              wx.showToast({
                title: '登陆成功',
                icon: 'success',
                duration: 2000
              });
            } else {
              // 如果没有查询到数据
              wx.showToast({
                title: '您不在学生名单上',
                icon: 'none',
                duration: 2000
              });
            }
          },
          fail: err => {
            console.error('查询失败', err);
            wx.showToast({
              title: '查询失败，请重试',
              icon: 'none',
              duration: 2000
            });
          }
        });
      }
    },
    
    addtemp() {
      const that = this; // 保存当前上下文
      const user_ol = wx.cloud.database().collection('user_ol');
      const num = parseInt(that.data.id, 10); // 确保这里重新获取 num
      user_ol.add({
        data: {
          num: num,
          name: that.data.name,
          count: 0,
        }
      }).then(res => {
        console.log('添加成功', res);
        wx.navigateTo({
          url: '/pages/index3/index3' // 确保路径正确
        });
      }).catch(err => {
        console.log('添加失败', err); // 失败提示错误信息
      });
    },

    forgotPwd() {
      wx.showToast({ title: '忘记信息', icon: 'none' });
    },
  });
