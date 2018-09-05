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

    var s = this
    this.getRecyclingRecord(1, function(records) {
      console.log(records)

      for (var i in records) {
        records[i].inpayidtime = util.formatTime(new Date(records[i].inpayidtime))
        s.records.push(records[i])
      }
      s.setData({
        records: s.records
      })
    })
    this.setData({
      deviceInfo: app.globalData.deviceInfo
    })
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
  onReachBottom: function(e) {
    var s = this
    if (s.observer) {
      s.getRecyclingRecord(s.count, function(records) {
        s.observer = false
        for (var i in records) {
          records[i].inpayidtime = util.formatTime(new Date(records[i].inpayidtime))
          s.records.push(records[i])
        }
        s.setData({
          records: s.records
        })
      })
    }
  }
})