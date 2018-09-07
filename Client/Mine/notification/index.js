// Mine/notification/index.js
var app = getApp()
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  notifications: [],
  count: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var s = this

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    wx.startPullDownRefresh()
    this.setData({
      deviceInfo: app.globalData.deviceInfo
    })
  },
  getUserNotifications: function(curPage, callback) {
    
    var s = this
    // 获取用户消息通知
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/usermsg/list?page.currentPage=' + curPage + '&page.pageNumber=5',
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        
        if (res['data']['isSuccess'] == 'TRUE') {

          if (res['data']['data']['hasMore'] == true) {
            // 有下一页
            s.observer = true
            ++s.count
          }
        }
        // 回调函数
        if (typeof (callback) == 'function') {
          callback(res['data']['data']['list'])
        }
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },
  onPullDownRefresh: function(e) {
    wx.showNavigationBarLoading()
    var s = this
    s.count = 1
    s.observer = false
    s.notifications = []
    this.getUserNotifications(1, function (notifications) {
      s.solveNotificationList(notifications)
    })
    setTimeout(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1000)
  },
  onReachBottom: function(e) {
    var s = this
    console.log(s.observer, s.count)
    if (s.observer) {
      s.observer = false  
      s.getUserNotifications(s.count, function (notifications) {
        s.solveNotificationList(notifications)
      })
    }
  },
  solveNotificationList: function(list) {
    var s = this

    for (var i = 0; i < list.length; ++i) {
      list[i].time = util.formatTime(new Date(list[i].createtime))
      s.notifications.push(list[i])
    }
    // if (s.notifications.length == 0) {
    //   s.notifications = list
    // } else {
    //   app.uniqueArr(s.notifications, list)
    // }
    s.setData({
      notifications: s.notifications
    })
  }
})