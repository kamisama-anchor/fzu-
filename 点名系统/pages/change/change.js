const db = wx.cloud.database({
  env: 'software-9g3qgled9f6190ea'
})

Page({
    data: {
    randomRecord: null ,// 用来存储随机抽取的整个记录
    xuenum: 0,
    add:0,
    },
    // 生命周期函数--监听页面加载
    onLoad: function() {
    this.getRandomRecord();
    },
    getRandomRecord: function() {
      const db = wx.cloud.database();
      const _ = db.command;
      let records = []; // 存储所有获取到的记录
      const pageSize = 20; // 每页的记录数
      let pageOffset = 0; // 当前页的偏移量
      const maxRecords = 1000; // 最大获取记录数
    
      // 分页获取记录的函数
      const fetchPageOfRecords = (offset, size) => {
        db.collection('users')
          .skip(offset)
          .limit(size)
          .get({
            success: res => {
              if (res.data.length > 0) {
                records = records.concat(res.data); // 将新获取的记录添加到records数组中
                if (records.length < maxRecords) {
                  pageOffset += pageSize; // 更新偏移量，准备获取下一页
                  fetchPageOfRecords(pageOffset, pageSize); // 递归调用以获取下一页的记录
                } else {
                  // 当获取到足够的记录后，处理records数组
                  processRecords();
                }
              } else {
                console.log('没有更多的记录');
                processRecords(); // 如果没有更多的记录，处理已有的records数组
              }
            },
            fail: err => {
              console.error('查询失败', err);
            }
          });
      };
    
      // 处理记录的函数
      const processRecords = () => {
        if (records.length === 0) {
          console.log('没有找到记录');
          return;
        }
        // 计算权重并选择记录
        const weightedRecords = this.calculateWeights(records);
        const randomRecord = this.selectRecordByWeight(weightedRecords);
        const xuenum = randomRecord.num;
    
        // 更新数据库中的记录，并添加当前服务器时间戳
        db.collection('users').doc(randomRecord._id).update({
          data: {
            timestamp: _.set(db.serverDate()) // 设置当前服务器时间
          },
          success: updateRes => {
            console.log('记录更新成功，时间戳添加');
            this.ifonlie();
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
      };
    
      // 开始分页查询
      fetchPageOfRecords(pageOffset, pageSize);
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
    
    ifonlie:function(){
      db.collection('user_ol').where({
        num:this.data.xuenum
      }).get({
        success: res => {
          // 查询成功
          this.addcount();
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



    addcount: function() {
      const that = this; // 保存当前上下文
      const db = wx.cloud.database(); // 获取数据库引用
      const xuenum = this.data.xuenum; // 从data对象中获取xuenum
    
      // 查询 user_ol 集合中特定学号的记录
      db.collection('user_ol').where({
        num: xuenum
      }).get({
        success: function(res) {
          // 查询成功，处理结果
          if (res.data.length > 0) {
            // 获取记录的 _id 和 count 属性
            const recordId = res.data[0]._id;
            const currentCount = res.data[0].count || 0;
    
            // 如果 count 是 0，则更新 users 集合中的 score 并增加 user_ol 集合中的 count
            let scoreUpdatePromise;
            if (currentCount === 0) {
              // 更新 users 集合中的 score
              scoreUpdatePromise = db.collection('users').where({
                num: xuenum
              }).update({
                data: {
                  score: that.data.randomRecord.score + 1 // 将 score 属性加1
                }
              });
            } else {
              scoreUpdatePromise = Promise.resolve(); // 如果不需要更新 score，使用空的 Promise
            }
    
            scoreUpdatePromise.then(() => {
              // 更新 user_ol 集合中的 count
              return db.collection('user_ol').doc(recordId).update({
                data: {
                  count: currentCount + 1 // 将 count 属性加1
                }
              });
            }).then(updateRes => {
              // 更新成功
              console.log('更新成功', updateRes);
            }).catch(updateErr => {
              // 更新失败
              console.error('更新失败', updateErr);
            });
          }
        }
      });
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


  queryUser: function() {
    const that = this; // 保存当前上下文
    const db = wx.cloud.database(); // 获取数据库引用
    const xuenum = this.data.xuenum; // 从data对象中获取xuenum
    const add = this.data.add;
  
    // 查询特定学号的记录
    db.collection('user_ol').where({
      num: xuenum
    }).get({
      success: function(res) {
        // 查询成功，处理结果
        if (res.data.length > 0) {
          // 获取记录的 count 属性，如果没有则默认为 0
          const count = res.data[0].count || 0;
          const temp = that.data.randomRecord.score;
  
          // 计算新的 score 值
          const newScore = parseFloat(add) * (0.9+ 0.1* count ) + temp;
          console.log('成绩',newScore);
          // 更新记录的 score
          db.collection('users').where({
            num: xuenum
          }).update({
            data: {
              score: newScore
            },
            success: function(updateRes) {
              // 更新成功
              console.log('更新成功', updateRes);
              wx.showToast({
                title: '分数更新成功',
                icon: 'success',
                duration: 2000
              });
            },
            fail: function(updateErr) {
              // 更新失败
              console.error('更新失败', updateErr);
              wx.showToast({
                title: '更新失败，请重试',
                icon: 'none',
                duration: 2000
              });
            }
          });
        } else {
          // 如果没有查询到数据
          wx.showToast({
            title: '未找到对应的记录',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: function(err) {
        // 查询失败
        console.error('查询失败', err);
        wx.showToast({
          title: '查询失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  decreaseScore: function() {
    const that = this;
    const db = wx.cloud.database();
    const xuenum = this.data.xuenum; // 从data对象中获取xuenum

    if (xuenum === 0) {
      wx.showToast({
        title: '学号未设置',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 查询 user_ol 集合中特定学号的记录
    db.collection('users').where({
      num: xuenum
    }).get({
      success: function(res) {
        if (res.data.length > 0) {
          const record = res.data[0];
          if (record.score > 0) { // 确保 score 大于 0 才进行减操作
            // 更新 users 集合中的 score
            db.collection('users').doc(record._id).update({
              data: {
                score: db.command.inc(-1) // 将 score 属性减1
              },
              success: function(updateRes) {
                // 更新成功
                console.log('分数减少成功', updateRes);
                wx.showToast({
                  title: '分数减少1',
                  icon: 'success',
                  duration: 2000
                });
              },
              fail: function(updateErr) {
                // 更新失败
                console.error('分数减少失败', updateErr);
                wx.showToast({
                  title: '分数减少失败，请重试',
                  icon: 'none',
                  duration: 2000
                });
              }
            });
          } else {
            wx.showToast({
              title: '分数不能为负',
              icon: 'none',
              duration: 2000
            });
          }
        } else {
          wx.showToast({
            title: '未找到对应的记录',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: function(err) {
        console.error('查询失败', err);
        wx.showToast({
          title: '查询失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  addScore: function() {
    const that = this;
    const db = wx.cloud.database();
    const xuenum = this.data.xuenum; // 从data对象中获取xuenum

    if (xuenum === 0) {
      wx.showToast({
        title: '学号未设置',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 查询 user_ol 集合中特定学号的记录
    db.collection('users').where({
      num: xuenum
    }).get({
      success: function(res) {
        if (res.data.length > 0) {
          const record = res.data[0];
          if (record.score > 0) { // 确保 score 大于 0 才进行减操作
            // 更新 users 集合中的 score
            db.collection('users').doc(record._id).update({
              data: {
                score: db.command.inc(0.5) // 将 score 属性减1
              },
              success: function(updateRes) {
                // 更新成功
                console.log('分数减少成功', updateRes);
                wx.showToast({
                  title: '分数增加0.5',
                  icon: 'success',
                  duration: 2000
                });
              },
              fail: function(updateErr) {
                // 更新失败
                console.error('分数减少失败', updateErr);
                wx.showToast({
                  title: '分数减少失败，请重试',
                  icon: 'none',
                  duration: 2000
                });
              }
            });
          } else {
            wx.showToast({
              title: '分数不能为负',
              icon: 'none',
              duration: 2000
            });
          }
        } else {
          wx.showToast({
            title: '未找到对应的记录',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: function(err) {
        console.error('查询失败', err);
        wx.showToast({
          title: '查询失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
});
