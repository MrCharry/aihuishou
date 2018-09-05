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
    this.getUserNotifications(1, function (notifications) {
      
      for (var i = 0; i < notifications.length; ++i) {
        notifications[i].time = util.formatTime(new Date(notifications[i].createtime))
        s.notifications.push(notifications[i])
      }
      s.setData({
        notifications: s.notifications
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.setData({
      deviceInfo: app.globalData.deviceInfo
    })
  },
  getUserNotifications: function(curPage, callback) {
    
    var s = this
    // 获取用户消息通知
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/usermsg/list?currentPage=' + curPage + '&page.pageNumber=5',
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        // console.log(res)
        if (res['data']['isSuccess'] == 'TRUE') {
          // if (m > 1) {
            // s.notifications.concat(res['data']['data']['list'])
          // }else {
          //   s.notifications = res['data']['data']['list']
          // }

          if (res['data']['data']['hasMore'] == true) {
            // 有下一页
            // s.getUserNotifications(++m)
            s.observer = true
            ++s.count
            // console.log(s.observer, s.count)
            // return
          }
          // 回调函数
          if (typeof(callback) == 'function') {
            // callback(s.notifications)
            callback(res['data']['data']['list'])
          }
        }
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },
  onReachBottom: function(e) {
    var s = this
    console.log(s.observer, s.count)
    if (s.observer) {
      s.getUserNotifications(s.count, function (notifications) {  

        s.observer = false      
        for (var i = 0; i < notifications.length; ++i) {
          notifications[i].time = util.formatTime(new Date(notifications[i].createtime))
          s.notifications.push(notifications[i])
        }
        s.setData({
          notifications: s.notifications
        })
      })
    }
  }
})