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
      url: 'https://www.dingdonhuishou.com/AHS/api/useraddress/modify',
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
          wx.showToast({
            title: res['data']['content'],
            success: function() {
              setTimeout(function () {
                wx.navigateBack()
              }, 1500)
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
      url: 'https://www.dingdonhuishou.com/AHS/api/useraddress/add',
      data: {
        address: addressInfo.address,
        detailaddress: inputData.detailaddress ? inputData.detailaddress : addressInfo.name,
        lat: addressInfo.latitude,
        lng: addressInfo.longitude
      },
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        console.log(res)
        if (res['data']['isSuccess'] == 'TRUE') {
          wx.showToast({
            title: res['data']['content'],
            success: function() {
              setTimeout(function () {
                wx.navigateBack()  
              }, 1500)
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
      url: 'https://www.dingdonhuishou.com/AHS/api/useraddress/del?id=' + addressid,
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        if (res['data']['isSuccess'] == 'TRUE') {
          //删除成功
          wx.showToast({
            title: res['data']['content'],
            success: function() {
              setTimeout(function () {
                wx.navigateBack()
              }, 1500)
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