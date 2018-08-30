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
    
    var addressList = app.globalData.addressList
    console.log(options)
    this.setData({
      deviceInfo: app.globalData.deviceInfo,
      userInfo: app.globalData.userInfo,
      options: options
    })
    // 获取当前待修改地址
    if (options.tag == 'edit') {
      // 当前为编辑地址操作
      for (var i=0; i<addressList.length; ++i) {
        if (addressList[i].id == options.id) {
          addressList[i].name = addressList[i].detailaddress
          this.setData({
            addressInfo: addressList[i]
          })
        }
      }
    }else {
      // 当前为新增地址操作
      for (var i=0; i<addressList.length; ++i) {
        addressList[i].name = addressList[i].detailaddress
        if (addressList[i].first == 1) {
          this.setData({
            addressInfo: addressList[i]
          })
        }
      }
    }
  },
  bindLocateTap: function(e) {
    // app.adjustAOpacity(this)
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
    // app.adjustBOpacity(this)
    var addressInfo = this.data.addressInfo
    var inputData = this.data.inputData
    var addressid = this.data.options.id
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHSTest/api/useraddress/modify',
      data: {
        id: addressid,
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
              // var userInfo = app.globalData.userInfo
              // userInfo.address = addressInfo.address
              // userInfo.detailaddress = inputData.detailaddress ? inputData.detailaddress:addressInfo.name
              // app.globalData.userInfo = userInfo
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
  },
  bindAddNewAddress: function(e) {
    // 用户添加新地址到地址列表
    var addressInfo = this.data.addressInfo
    var inputData = this.data.inputData
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHSTest/api/useraddress/add',
      data: {
        address: addressInfo.address,
        detailaddress: inputData.detailaddress ? inputData.detailaddress : addressInfo.name,
        lat: addressInfo.latitude,
        lng: addressInfo.longitude
      },
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        if (res['data']['isSuccess'] == 'TRUE') {
          wx.showToast({
            title: res['data']['content'],
            success: function() {
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
  },
  bindDelAddress: function(e) {

    var addressid = this.data.options.id

    // 删除当前地址
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHSTest/api/useraddress/del?id' + addressid,
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        if (res['data']['isSuccess'] == 'TRUE') {
          //删除成功
          wx.showToast({
            title: res['data']['content'],
            success: function() {
              wx.navigateBack()
            }
          })
          
        }else {
          //删除失败
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