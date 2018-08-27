// Mine/credits/index.js
var app = getApp()
var i = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceInfo: {},
    points: []
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
    var s = this
    this.getUserCredits(1, function(points) {
      console.log(points)
      var totalPoint = 0
      for (var i=0; i<points.length; ++i) {
        totalPoint += points[i].point
        points[i].time = util.formatTime(new Date(points[i].createtime))
      }
      points.totalpoint = totalPoint
      s.setData({
        points: points
      })
    })
  },
  getUserCredits: function(curPage, callback) {
    var s = this
    var points = this.data.points
    // 获取用户积分详情
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/userpoints/list?currentPage=' + curPage,
      method: 'POST',
      header: app.globalData.header,
      success: function (res) {

        if (res['data']['isSuccess'] == 'TRUE') {

          if (i > 1) {
            //有下一页
            points.concat(res['data']['data']['list'])
          } else {
            //没有下一页
            points = res['data']['data']['list']
          }
          s.setData({
            points: points
          })

          if (res['data']['data']['hasMore'] == true) {
            // 有下一页
            s.getUserCredits(++i)
            return
          }
          if (typeof(callback) == 'function') {
            callback(points)
          }
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  }
})