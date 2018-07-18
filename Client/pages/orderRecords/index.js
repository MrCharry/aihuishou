// pages/orderRecords/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: {
      aColor: "#19c4aa"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceInfo: app.globalData.deviceInfo
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