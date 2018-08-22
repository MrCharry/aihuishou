// Mine/feedback/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: {
      uptop: 508
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
  formSubmit: function(e) {
    console.log(e.detail.value)
    app.adjustAOpacity(this)
    var submitData = e.detail.value
    // 提交反馈到后台
    wx.request({
      url: 'https://www.dingdonhuishou/AHS/api/opinion/create',
      data: {
        phonenum: submitData.phonenum,
        title: submitData.title,
        question: submitData.question
      },
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        if (res['data']['isSuccess'] == 'TRUE') {
          console.log(res['data']['content'])
          wx.showModal({
            title: '提示',
            content: res['data']['content'],
            showCancel: false,
            confirmText: '返回',
            success: function() {
              wx.navigateBack()
            }
          })
        }
      },
      fail: function(error) {
        console.log(error)
        wx.showModal({
          title: '通知',
          content: '提交反馈失败，请稍后再试！',
          cancelText: '返回',
          success: function(res) {
            if (res['cancel']) {
              wx.navigateBack()
            }
          }
        })
      }
    })
  },
  makePhoneCall: function() {
    app.adjustBOpacity(this)
    wx.makePhoneCall({
      phoneNumber: '18688958966'
    })
  }
})