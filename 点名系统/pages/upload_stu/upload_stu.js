Page({
  clickBtn(){
    let that = this
    wx.chooseMessageFile({
      count: 1, 
      type: 'file', 
      success:res=>{
        wx.showLoading({
          title: '正在上传',
        })
        let filePath=res.tempFiles[0].path;
        console.log("选择execl成功",filePath)
        that.clearDatabase();
        that.cloudFile(filePath);
      }
    })
  },
  
  clearDatabase() {
    const db = wx.cloud.database({
      env:'software-9g3qgled9f6190ea'
    });
    const stu = db.collection('users'); // 替换为你的集合名称
      stu.where({
        _id: db.command.exists(true)
      }).remove().then(res=>{
        console.log('删除成功')
        this.setData({
          number:''
        })
      }).catch(err => {
        console.log('删除失败',err)//失败提示错误信息
      })
  },

  cloudFile(path){
    let that = this
    wx.cloud.uploadFile({
      cloudPath:"stu/test.xlsx",
      filePath: path,
      success: res=>{
        wx.hideLoading()
        console.log("上传成功",res.fileID)
        that.jiexi(res.fileID)
      },
      fail: err=>{
        console.log("上传失败",err)
      }
    })
  },

  jiexi(fileId){
    wx.cloud.callFunction({
      name:"excel",
      data:{
        fileID: fileId
      },
      success(res) {
        console.log("success",res)
      } ,
      fail(res)
      {
        console.log("failed",res)
      }
    })
  },
  clickBtn2(){
    wx.downloadFile({
      url:"https://736f-software-9g3qgled9f6190ea-1329643751.tcb.qcloud.la/stu/test.xlsx?sign=db95dcc9da0c7a414610887585aabbc5&t=1727246704",
      success:res=>{
        var filePath=res.	tempFilePath
        this.opfile(filePath)
      }
    })
  },
  
  opfile(path){
    wx.openDocument({
      filePath:path,
      fileType:"xlsx"
    }).then(res=>{
      console.log(res)
    })
  }
});