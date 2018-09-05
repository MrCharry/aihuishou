// // Mine/setting/modifyPassword/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {

    this.setData({
      opt: opt,
      deviceInfo: app.globalData.deviceInfo
    })
  },
  bindInputTap: function(e) {
    let identifier = e.currentTarget.id
    let inputval = e.detail.value

    if (identifier == 'oldpassword') {
      this.oldpassword = inputval
    }else if (identifier == 'newpassword') {
      this.newpassword = inputval
    }else if (identifier == 'code') {
      this.code = inputval
    }else if (identifier == 'phonenum') {
      this.phonenum = inputval
    }
  },
  iflegalphone: function(e) {
    let s = this
    this.setData({
      inputData: {
        phonenum: s.phonenum
      }
    })
    app.iflegalphone(this)
  },
  iflegalpassword: function(e) {
    
    app.iflegalpassword(this)
  }
})