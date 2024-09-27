const db = wx.cloud.database({
  env: 'software-9g3qgled9f6190ea'
})

Page({
    data: {
    randomRecord: null ,// 用来存储随机抽取的整个记录
    xuenum: 0,
    add:0,
    status:''
    },
    // 生命周期函数--监听页面加载
    onLoad: function() {
    this.getRandomRecord();
    },
    getRandomRecord: function() {
      const db = wx.cloud.database();
      const _ = db.command;
    
      db.collection('users').limit(1000).get({
        success: res => {
          if (res.data.length > 0) {
            // 计算权重并选择记录
            const weightedRecords = this.calculateWeights(res.data);
            const randomRecord = this.selectRecordByWeight(weightedRecords);
            const xuenum = randomRecord.num;
    
            // 更新数据库中的记录，并添加当前服务器时间戳
            db.collection('users').doc(randomRecord._id).update({
              data: {
                timestamp: _.set(db.serverDate()) // 设置当前服务器时间
              },
              success: updateRes => {
                console.log('记录更新成功，时间戳添加');
              },
              fail: updateErr => {
                console.error('记录更新失败', updateErr);
              }
            });
    
            // 更新页面data对象中的randomRecord变量
            this.setData({
              randomRecord: randomRecord,
              xuenum: xuenum
            });
    
            console.log('随机记录：', randomRecord);
          } else {
            console.log('没有找到记录');
          }
        },
        fail: err => {
          console.error('查询失败', err);
        }
      });
      db.collection('user_ol').where({
        num:this.data.xuenum
      }).get({
        success: res => {
          // 查询成功
          console.log(res)
          if (res.data.length > 0) {
            // 如果查询到数据
            wx.showToast({
              title: '学生在线',
              icon: 'success',
              duration: 2000
            });
          } else {
            // 如果没有查询到数据
            wx.showToast({
              title: '学生缺勤',
              icon: 'none',
              duration: 2000
            });
          }
        },
      })
    },
    calculateWeights: function(records) {
    return records.map(record => {
        // 假设权重是分数的倒数，分数越高，权重越低
        const weight = 1 / (record.score || 1); // 防止除以0
        return { record, weight };
    });
    },
    selectRecordByWeight: function(weightedRecords) {
    let cumulativeWeight = 0;
    weightedRecords.forEach(item => {
        cumulativeWeight += item.weight;
    });
    
    if (cumulativeWeight === 0) return null; // 防止除以0
    
    const randomValue = Math.random() * cumulativeWeight;
    let currentWeight = 0;
    for (let i = 0; i < weightedRecords.length; i++) {
        currentWeight += weightedRecords[i].weight;
        if (currentWeight >= randomValue) {
        return weightedRecords[i].record;
        }
    }
    return null; // 默认返回null，理论上不应该执行到这里
    },
   gotoindex5()
   {
    wx.navigateTo({
        url: '/pages/index5/index5' // 确保路径正确
      })
   },

   inputChange: function(e) {
    this.setData({
      add: e.detail.value
    });
  },


   queryUser: function(){
    const xuenum = this.data.xuenum; // 从data对象中获取xuenum
    const add = this.data.add;
    const temp = this.data.randomRecord.score + parseFloat(add);
    db.collection('users').where({
      num:xuenum
    }).update({
      data:{
        score:temp,
      }
    }).then(res => {
      console.log('更新成功')
    }).catch(err => {
      console.log('更新失败',err)
    })  
  
  },

});
