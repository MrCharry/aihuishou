// pages/orderIssue/index.js
var app = getApp()
var wxMarkerData = []
var bmap = require('../../utils/bmap-wx.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ak = app.globalData.ak
    var s = this
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: ak
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      console.log(wxMarkerData)
      s.setData({
        curAddress: wxMarkerData[0].address,
        curLocation: {
          latitude: wxMarkerData[0].latitude,
          longitude: wxMarkerData[0].longitude
        }
      }); 
    }
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success
    }); 

    this.setData({
      deviceInfo: app.globalData.deviceInfo
    })
  },
  modifyaddress: function(e) {

    var location = this.data.curLocation
    var s = this

    app.adjustAOpacity(this)

    wx.openLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      success: function(res) {        
        wx.chooseLocation({
          success: function(res) {
            s.setData({
              curAddress: res.address              
            })          
          },
        })
      }
    })
  }
})