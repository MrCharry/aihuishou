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
      deviceInfo: app.globalData.deviceInfo,
      opt: options
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
    }else if (e.target.dataset.name == 'phonenum') {
      inputData.phonenum = e.detail.value
    }
    this.setData({
      inputData: inputData
    })
  },
  getVerifiedCode: function(e) {
    var inputData = this.data.inputData
    inputData.phonenum = app.globalData.userInfo.phonenum
    this.setData({
      inputData: inputData
    })
    app.getVerifiedCode(this)
  },
  iflegalphone: function(e) {
    var opt = this.data.opt
    if (opt.name == 'phonenum') {
      var phonenum = this.data.inputData.phonenum
      app.iflegalphone(this)
    }
  },
  iflegalpassword: function(e) {
    app.iflegalpassword(this)
  },
  confirm: function(e) {

    var opt = this.data.opt
    var inputData = this.data.inputData
    var newPassword = inputData.newPassword
    var verifiedCode = inputData.verifiedCode
    
    if (opt.name == 'phonenum') {
      var phonenum = this.data.inputData.phonenum
      console.log(phonenum)
      // 忘记密码
      wx.request({
        url: 'https://www.dingdonhuishou.com/AHSTest/api/user/forgetpassword',
        data: {
          phonenum: phonenum,
          newpassword: newPassword,
          code: verifiedCode
        },
        method: 'POST',
        header: app.globalData.header,
        success: function(res) {

          if (res['data']['isSuccess'] == 'TRUE') {
            wx.showToast({
              title: res['data']['content'],
              duration: 1500
            })
            wx.navigateBack({})
          }else {
            wx.showToast({
              title: res['data']['content'],
              image: '/Resources/images/closeIcon_01.png',
              duration: 1500
            })
          }
        }
      })
      
    }else if (opt.name == 'oldPassword') {
      var oldPassword = inputData.oldPassword
      console.log(oldPassword)
      // 修改密码
      wx.request({
        url: 'https://www.dingdonhuishou.com/AHSTest/api/user/modify',
        data: {
          oldpassword: oldPassword,
          newpassword: newPassword,
          code: verifiedCode
        },
        method: 'POST',
        header: app.globalData.header,
        success: function(res) {
          console.log(res)
          if (res['data']['isSuccess'] == 'TRUE') {
            wx.showToast({
              title: res['data']['content'],
              duration: 1500
            })
            wx.navigateBack({})
          } else {
            wx.showToast({
              title: '旧密码错误',
              image: '/Resources/images/closeIcon_01.png',
              duration: 1500
            })
          }
        }        
      })
    }
  }
})