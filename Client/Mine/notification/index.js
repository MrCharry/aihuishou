// Mine/notification/index.js
var app = getApp()
var util = require('../../utils/util.js')
var m = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notifications: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.setData({
      deviceInfo: app.globalData.deviceInfo
    })
    var s = this
    this.getUserNotifications(1, function(notifications) {
      console.log(notifications)
      m = 1
      for (var i=0; i<notifications.length; ++i) {
        notifications[i].time =  util.formatTime(new Date(notifications[i].createtime))
      }
      s.setData({
        notifications: notifications
      })
    })
  },
  getUserNotifications: function(curPage, callback) {

    var notifications = this.data.notifications
    var s = this
    // 获取用户消息通知
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/usermsg/list?currentPage=' + curPage,
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        if (res['data']['isSuccess'] == 'TRUE') {
          if (m > 1) {
            notifications.concat(res['data']['data']['list'])
          }else {
            notifications = res['data']['data']['list']
          }
          s.setData({
            notifications: notifications
          })
          if (res['data']['data']['hasMore'] == true) {
            // 有下一页
            s.getUserNotifications(++m)
            return
          }
          // 回调函数
          if (typeof(callback) == 'function') {
            callback(notifications)
          }
        }
      },
      fail: function(error) {
        console.log(error)
      }
    })
  }
})