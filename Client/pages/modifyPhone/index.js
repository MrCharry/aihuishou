// pages/modifyPhone/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputData: {},
    view: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var userInfo = app.globalData.userInfo
    userInfo.phonenum = userInfo.phonenum.slice(0,3) + '****' + userInfo.phonenum.slice(7,11)
    
    this.setData({
      userInfo: userInfo,
      deviceInfo: app.globalData.deviceInfo
    })
  },
  getInput: function(e) {
    
    var inputData = this.data.inputData
    var tag = e.currentTarget.id

    if (tag == 'oldnum') {
      inputData.phonenum = e.detail.value
      inputData.oldnum = e.detail.value
    } else if (tag == 'newnum') {
      inputData.phonenum = e.detail.value
      inputData.newnum = e.detail.value
    }else if (tag == 'oldcode') {
      inputData.oldcode = e.detail.value
    }else if (tag == 'newcode') {
      inputData.newcode = e.detail.value
    }
    this.setData({
      inputData: inputData
    })
    // console.log(inputData)
  },
  getVerifiedCode: function(e) {

    var inputData = this.data.inputData

    if (e.currentTarget.id == 'oldcode') {
      // app.adjustAOpacity(this)
      inputData.phonenum = inputData.oldnum

    }else if (e.currentTarget.id == 'newcode') {
      inputData.phonenum = inputData.newnum
      // app.adjustBOpacity(this)
    }
    this.setData({
      inputData: inputData
    })
    console.log(inputData)
    // app.getVerifiedCode(this)
  },
  submit: function(e) {

    // app.adjustCOpacity(this)
    var submitText = this.data.inputData
    var s = this
    console.log(submitText)
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/user/changephonenum',
      data: {
        oldphonenum: submitText.oldnum,
        oldcode: submitText.oldcode,
        newphonenum: submitText.newnum,
        newcode: submitText.newcode
      },
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        console.log(res)
        if (res['data']['isSuccess'] == 'TRUE') {
          console.log(res['data']['content'])
          wx.showModal({
            title: '提示',
            content: res['data']['content'],
            showCancel: false,
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
            confirmColor: '#ff0000',
            success: function() {
              s.setData({
                inputData: {}
              })
            }
          })
        }
      },
      fail: function(error) {
        console.log(error)
      }
    })
  }
})