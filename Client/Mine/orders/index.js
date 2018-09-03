// Mine/orders/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceInfo: app.globalData.deviceInfo
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

   
  },
})