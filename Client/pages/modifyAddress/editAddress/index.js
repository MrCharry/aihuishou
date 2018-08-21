// pages/modifyAddress/editAddress/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: {},
    inputData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceInfo: app.globalData.deviceInfo,
      userInfo: app.globalData.userInfo
    })
  },
  bindLocateTap: function(e) {

  },
  bindInputTap: function(e) {
    var inputData = this.data.inputData
    inputData.housenumber = e.detaill.value
    this.setData({
      inputData: inputData
    })
  }
})