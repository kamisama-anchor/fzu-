const db = wx.cloud.database({
  env: 'software-9g3qgled9f6190ea'
})

Page({
    data: {
    randomRecord: null ,// 用来存储随机抽取的整个记录
    xuenum: 0,
    add:0,
    question:''
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

  inputQuestion: function(e) {
    this.setData({
      question: e.detail.value
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
  // questionUser: function() {
  //     const temp = this.data.question;
  //     const xuenum = this.data.xuenum;
  //     const db = wx.cloud.database(); // 获取数据库的引用
  //     const currentTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  //     db.collection('user_ol').where({
  //       num: xuenum
  //     }).get({
  //       success: res => {
  //         // 查询成功的处理逻辑
  //         if (res.data.length > 0) {
  //           // 假设只更新第一条记录
  //           const record = res.data[0];
  //           db.collection("user_ol").doc(record._id).update({
  //             data: {
  //               question: temp,
  //               qtime:currentTime
  //             },
  //             success: updateRes => {
  //               // 更新成功的处理逻辑
  //               console.log('更新成功',temp);
  //               wx.showToast({
  //                 title: '提问成功',
  //                 icon: 'success',
  //                 duration: 2000
  //               });
  //             },
  //             fail: updateErr => {
  //               // 更新失败的处理逻辑
  //               console.error('更新失败', updateErr);
  //               wx.showToast({
  //                 title: '更新失败',
  //                 icon: 'none',
  //                 duration: 2000
  //               });
  //             }
  //           });
  //         } else {
  //           // 没有查询到记录的情况
  //           console.log('没有查询到记录');
  //           wx.showToast({
  //             title: '这个学生没到',
  //           });
  //         }
  //       },
  //       fail: err => {
  //         // 查询失败的处理逻辑
  //         console.error('查询失败', err);
  //         wx.showToast({
  //           title: '查询失败',
  //           icon: 'none',
  //           duration: 2000
  //         });
  //       }
  //     });
  //     db.collection('').add({

  //     })
  //   },

});