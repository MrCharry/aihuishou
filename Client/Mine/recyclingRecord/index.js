// Mine/orders/index.js
var app = getApp()
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  records: [],
  count: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceInfo: app.globalData.deviceInfo
    })
  },
  onShow: function() {
    wx.startPullDownRefresh()
  },
  getRecyclingRecord: function(curPage, callback) {

    var s = this
    // 获取回收记录
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/userorder/look/finishorders?page.currentPage='+curPage + '&page.pageNumber=5',
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        
        if (res['data']['hasMore']) {
          ++s.count
          s.observer = true
        }
        if (typeof (callback) == 'function') {
          callback(res['data']['data'])
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
    s.records = []
    this.getRecyclingRecord(1, function (records) {
      s.solveRecyingRecordList(records)

    })
    setTimeout(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1000)
  },
  onReachBottom: function(e) {
    var s = this
    if (s.observer) {
      s.observer = false
      s.getRecyclingRecord(s.count, function(records) {
        s.solveRecyingRecordList(records)
      })
    }
  },
  solveRecyingRecordList: function(list) {
    var s = this
    for (var i=0; i<list.length; ++i) {
      list[i].inpayidtime = util.formatTime(new Date(list[i].inpayidtime))
      s.records.push(list[i])
    }
    // if (s.records.length == 0) {
    //   s.records = list
    // }else {
    //   app.uniqueArr(s.records, list)
    // }
    s.setData({
      records: s.records
    })
  }
})