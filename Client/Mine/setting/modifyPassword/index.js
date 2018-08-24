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
    
    if (e.target.id == 'oldPassword') {
      inputData.oldPassword = e.detail.value
    } else if (e.target.id == 'newPassword') {
      inputData.newPassword = e.detail.value
    }else if (e.target.id == 'verifiedCode') {
      inputData.verifiedCode = e.detail.value
    }else if (e.target.id == 'phonenum') {
      inputData.phonenum = e.detail.value
    }
    this.setData({
      inputData: inputData
    })
  },
  getVerifiedCode: function(e) {
    var inputData = this.data.inputData
    console.log(inputData)
    this.setData({
      inputData: inputData
    })
    app.getVerifiedCode(this)
  },
  iflegalphone: function(e) {
    if (this.data.focus2 == true) {
      return
    }
    var opt = this.data.opt
    if (opt.name == 'phonenum') {
      var phonenum = this.data.inputData.phonenum
      if ( !app.iflegalphone(this) ) {
        this.setData({
          focus1: true
        })
      }else {
        this.setData({
          focus1: false
        })
      }
    }
  },
  iflegalpassword: function(e) {
    if (this.data.focus1 == true) {
      return
    }
    if ( !app.iflegalpassword(this) ) {
      this.setData({
        focus2: true
      })
    }else {
      this.setData({
        focus2: false
      })
    }
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
        url: 'https://www.dingdonhuishou.com/AHS/api/user/forgetpassword',
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
              icon: 'none',
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
        url: 'https://www.dingdonhuishou.com/AHS/api/user/modify',
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