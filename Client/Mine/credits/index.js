// Mine/credits/index.js
var app = getApp()
let util = require('../../utils/util.js')
var m = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceInfo: {},
    points: new Array()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceInfo: app.globalData.deviceInfo
    })
    var s = this
    this.getUserCredits(1, function (points) {

      var totalPoint = 0
      for (var i = 0; i < points.length; ++i) {
        totalPoint += points[i].point
        // points[i].time = util.formatTime(new Date(points[i].createtime))
      }
      s.setData({
        points: points,
        totalpoint: totalPoint        
      })
      console.log(points)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getUserCredits: function(curPage, callback) {
    var s = this
    // var points = this.data.points
    
    // 获取用户积分详情
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/userpoints/list?currentPage=' + curPage,
      method: 'POST',
      header: app.globalData.header,
      success: function (res) {

        if (res['data']['isSuccess'] == 'TRUE') {

          if (m > 1) {
            //有下一页
            s.points.concat(res['data']['data']['list'])
          } else {
            //没有下一页
            s.points = res['data']['data']['list']
          }

          if (res['data']['data']['hasMore'] == true) {
            // 有下一页
            s.getUserCredits(++m)
            return
          }
          if (typeof(callback) == 'function') {
            callback(s.points)
          }
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  }
})