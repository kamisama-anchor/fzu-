// 定义页面数据模型
const db = wx.cloud.database({
  env: 'software-9g3qgled9f6190ea'
})

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
    
}，
onShow: function () {
    this.clickBtn();
}，
onPullDownRefresh: function () { //下拉刷新
    wx.stopPullDownRefresh();
    this.clickBtn();
}，
  clickBtn(){
    const that = this;
  db.collection('users').get({
    success: function(res) {
      // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
      console.log(res.data);
      const sortedRecords = res.data.sort(function(a, b) {
        return b.score - a.score;
      });
      that.setData({
        records: res.data
      });
    }
  })
}，
inputChange: function(e) {
  this.setData({
    add: e.detail.value
  });
}，

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

}，
});
