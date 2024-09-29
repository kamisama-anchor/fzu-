// 定义页面数据模型
const db = wx.cloud.database({
  env: 'software-9g3qgled9f6190ea'
})

const app = getApp();

Page({
  data: {
    records: [],
    xuenum: '',
    add:'',
    randomRecord: null,
    self: app.globalData.mynum
  },

  onLoad: function () {
    this.clickBtn();
    
},
onShow: function () {
    this.clickBtn();
},
onPullDownRefresh: function () { //下拉刷新
    wx.stopPullDownRefresh();
    this.clickBtn();
},
clickBtn() {
  const that = this;
  let pageSize = 20; // 每页数据量
  let page = 0; // 当前页码
  let allData = []; // 存储所有数据

  function getData() {
    db.collection('users').skip(page * pageSize).limit(pageSize).get({
      success: function(res) {
        console.log(res.data);
        allData = allData.concat(res.data); // 将新获取的数据添加到数组中
        that.setData({
          records: allData
        });

        if (res.data.length < pageSize) {
          // 如果返回的数据少于pageSize，说明已经获取完所有数据
          const sortedRecords = allData.sort(function(a, b) {
            return b.score - a.score;
          });
          that.setData({
            records: sortedRecords
          });
        } else {
          // 否则，继续获取下一页数据
          page++;
          getData();
        }
      },
      fail: function(err) {
        console.error(err);
      }
    });
  }

  getData(); // 调用函数开始获取数据
},
inputChange: function(e) {
  this.setData({
    add: e.detail.value
  });
},

queryUser: function(){
  const xuenum = this.data.xuenum; // 从data对象中获取xuenum
  const add = this.data.add
  const temp = +this.data.randomRecord.score-add
  db.collection('users').where({
    num:xuenum
  }).update({
    data:{
      score:temp
    }
  }).then(res => {
    console.log('更新成功')
    clickBtn();
  }).catch(err => {
    console.log('更新失败',err)
  })  

},
});
