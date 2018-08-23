// pages/modifyAddress/editAddress/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: {},
    inputData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceInfo: app.globalData.deviceInfo,
      userInfo: app.globalData.userInfo
    })
  },
  bindLocateTap: function(e) {
    app.adjustAOpacity(this)
    var s = this
    wx.getLocation({
      success: function(res) {
        wx.openLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          success: function(res) {
            wx.chooseLocation({
              success: function(res) {
                console.log(res)
                s.setData({
                  addressInfo: res
                })
              },
            })
          }
        })
      },
    })
  },
  bindInputTap: function(e) {

    var inputData = this.data.inputData
    inputData.detailaddress = e.detail.value
    console.log(e.detail.value)
    this.setData({
      inputData: inputData
    })
  },
  bindUpdateAddress: function(e) {
    app.adjustBOpacity(this)
    var addressInfo = this.data.addressInfo
    var inputData = this.data.inputData

    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/user/modify/address',
      data: {
        address: addressInfo.address,
        detailaddress: inputData.detailaddress ? inputData.detailaddress:addressInfo.name,
        lat: addressInfo.latitude,
        lng: addressInfo.longitude
      },
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        if (res['data']['isSuccess'] == 'TRUE') {
          wx.showModal({
            title: '提示',
            content: res['data']['content'],
            showCancel: false,
            success: function() {
              var userInfo = app.globalData.userInfo
              userInfo.address = addressInfo.address
              userInfo.detailaddress = inputData.detailaddress ? inputData.detailaddress:addressInfo.name
              app.globalData.userInfo = userInfo
              wx.navigateBack()
            }
          })
        }else {
          wx.showModal({
            title: '提示',
            content: res['data']['content'],
            showCancel: false,
            confirmText: '重试',
            confirmColor: '#ff0000'
          })
        }
      },
      fail: function(error) {
        console.log(error)
      }
    }) 
  }
})