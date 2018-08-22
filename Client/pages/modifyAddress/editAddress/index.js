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
    app.adjustAOpacity(this)
    var s = this
    wx.getLocation({
      success: function(res) {
        wx.openLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          success: function(res) {
            wx.chooseLocation({
              success: function(res) {
                s.setData({
                  selectedAddress: res.address
                })
              },
            })
          }
        })
      },
    })
  },
  bindInputTap: function(e) {
    var inputData = this.data.inputData
    inputData.housenumber = e.detaill.value
    this.setData({
      inputData: inputData
    })
  }
})