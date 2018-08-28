// pages/orderRecords/index.js
var app = getApp()
var util = require('../../utils/util.js')
var i = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: {
      aColor: "#19c4aa"
    },
    operatableOrders: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      deviceInfo: app.globalData.deviceInfo
    })
  },
  onShow: function() {
    var s = this
    // 获取当前默认上门回收地址
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHSTest/api/useraddress/getdefault',
      method: 'POST',
      header: app.globalData.header,
      success: function (res) {
        console.log(res)
        if (res['data']['isSuccess'] == 'TRUE') {
          s.setData({
            addressInfo: res['data']['data']
          })
        }
        s.getUserOperatableOrders(1, function (operatableOrderList) {
          console.log(operatableOrderList)
        })
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  getUserOperatableOrders: function (curPage, callback) {

    var operatableOrderList = this.data.operatableOrderList    
    var addressInfo = this.data.addressInfo
    var s = this
    // 获取当前用户所有可操作订单列表
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/userorder/get/operateringorders?page.currentPage='+curPage + '&lng='+addressInfo.lng + '&lat='+addressInfo.lat + '&lengthofnear=0',
      method: 'POST',
      header: app.globalData.header,
      success: function (res) {
        if (i > 1) {
          operatableOrderList.concat(res['data']['data'])
        } else {
          operatableOrderList = res['data']['data']
        }
        s.setData({
          operatableOrderList: operatableOrderList
        })
        if (res['data']['hasMore']) {
          s.getUserOperatableOrders(++i)
          return
        }
        if (typeof (callback) == 'function') {
          callback(operatableOrderList)
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  clickOperatableOrder: function(e) {
    var view = this.data.view
    view.aColor = "#19c4aa";
    view.bColor = "#3e3e3e";
    app.adjustAOpacity(this)
    this.setData({
      view: view
    })
    
  },
  clickUnoperatableOrder: function(e) {
    var view = this.data.view
    view.bColor = "#19c4aa";
    view.aColor = "#3e3e3e";
    app.adjustBOpacity(this)
    this.setData({
      view: view
    })
  }
})