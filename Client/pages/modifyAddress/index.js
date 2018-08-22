// pages/modifyAddress/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceInfo: app.globalData.deviceInfo,
      userInfo: app.globalData.userInfo,
      checkIcon: '/Resources/images/check.png'
    })
  },
  bindEditTap: function(e) {
    app.adjustAOpacity(this)
    wx.navigateTo({
      url: '/pages/modifyAddress/editAddress/index',
      success: function() {
        wx.setNavigationBarTitle({
          title: '编辑收货地址',
        })
      }
    })
  },
  bindAddAddress: function(e) {
    app.adjustBOpacity(this)
    wx.navigateTo({
      url: '/pages/modifyAddress/editAddress/index',
      success: function() {
        wx.setNavigationBarTitle({
          title: '编辑收货地址',
        })
      }
    })
  }
})