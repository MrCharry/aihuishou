// Mine/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceInfo: {},
    view: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {
    this.setData({
      deviceInfo: app.globalData.deviceInfo,
      userInfo: app.globalData.userInfo
    })
  },
  clickCredit: function(e) {
    app.adjustAOpacity(this)
    wx.navigateTo({
      url: '/Mine/credits/index',
      success: function() {
        wx.setNavigationBarTitle({
          title: '积分详情',
        })
      }
    })
  },
  clickOrder: function (e) {
    app.adjustBOpacity(this)
    wx.navigateTo({
      url: '/Mine/orders/index',
      success: function () {
        wx.setNavigationBarTitle({
          title: '回收记录',
        })
      }
    })
  },
  clickWallet: function (e) {
    app.adjustCOpacity(this)
    wx.navigateTo({
      url: '/Mine/wallets/index',
      success: function () {
        wx.setNavigationBarTitle({
          title: '我的钱包',
        })
      }
    })
  },
  clickNotification: function (e) {
    app.adjustDOpacity(this)
    wx.navigateTo({
      url: '/Mine/notification/index',
      success: function () {
        wx.setNavigationBarTitle({
          title: '消息通知',
        })
      }
    })
  },
  clickFeedback: function (e) {
    app.adjustEOpacity(this)
    wx.navigateTo({
      url: '/Mine/feedback/index',
      success: function () {
        wx.setNavigationBarTitle({
          title: '意见反馈',
        })
      }
    })
  },
  clickSetting: function (e) {
    app.adjustFOpacity(this)
    wx.navigateTo({
      url: '/Mine/setting/index',
      success: function () {
        wx.setNavigationBarTitle({
          title: '设置',
        })
      }
    })
  },
  clickUserProfile: function(e) {
    app.adjustFOpacity(this)
    wx.navigateTo({
      url: '/Mine/userProfile/index',
      success: function() {
        wx.setNavigationBarTitle({
          title: '个人信息',
        })
      }
    })
  }
})