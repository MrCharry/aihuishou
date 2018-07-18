// Mine/setting/modifyPassword/index.js
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
      deviceInfo: app.globalData.deviceInfo
    })
  },
  getInput: function (e) {
    var inputData = this.data.inputData
    if (e.target.dataset.name == 'oldPassword') {
      inputData.oldPassword = e.detail.value
    } else if (e.target.dataset.name == 'newPassword') {
      inputData.newPassword = e.detail.value
    }else if (e.target.dataset.name == 'verifiedCode') {
      inputData.verifiedCode = e.detail.value
    }
    this.setData({
      inputData: inputData
    })
  },
  getVerifiedCode: function(e) {
    app.adjustAOpacity(this)
    app.getVerifiedCode(this)
  },
  confirm: function(e) {
    var oldPassword = this.data.inputData.oldPassword
    var newPassword = this.data.inputData.newPassword
    var verifiedCode = this.data.inputData.verifiedCode
    app.adjustBOpacity(this)

  }
})