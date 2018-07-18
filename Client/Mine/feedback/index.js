// Mine/feedback/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: {
      uptop: 508
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceInfo: app.globalData.deviceInfo
    })
  },
  formSubmit: function(e) {
    console.log(e.detail.value)
    app.adjustAOpacity(this)
  },
  makePhoneCall: function() {
    app.adjustBOpacity(this)
    wx.makePhoneCall({
      phoneNumber: '18688958966'
    })
  }
})