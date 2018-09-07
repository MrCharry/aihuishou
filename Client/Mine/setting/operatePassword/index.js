// // Mine/setting/modifyPassword/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {

    this.setData({
      opt: opt,
      deviceInfo: app.globalData.deviceInfo
    })
  },
  bindInputTap: function(e) {
    let identifier = e.currentTarget.id
    let inputval = e.detail.value

    if (identifier == 'oldpassword') {
      this.oldpassword = inputval
    }else if (identifier == 'newpassword') {
      this.newpassword = inputval
    }else if (identifier == 'code') {
      this.code = inputval
    }else if (identifier == 'phonenum') {
      this.phonenum = inputval
    }
  },
  iflegalphone: function(e) {
    if (this.data.opt.tag == 'forget') {
      app.iflegalphone(this, this.phonenum)
    }
  },
  iflegalpassword: function(e) {
    
    app.iflegalpassword(this, this.newpassword)
  },
  getVerifiedCode: function(e) {
    app.getVerifiedCode(this, this.phonenum ? this.phonenum:app.globalData.userInfo.phonenum)
  },
  bindConfirmTap: function(e) {
  
    let tag = this.data.opt.tag
    // 判断旧密码是否为空
    if (tag=='modify' && app.ifEmptyInput(this, this.oldpassword, 'password')) {
       return
    }
    if (tag=='forget' && !app.iflegalphone(this, this.phonenum)) {
      // 判断手机号码是否合法
        return
    }
    // 判断新密码是否合法
    if (!app.iflegalpassword(this, this.newpassword)) {
      return
    }
    // 判断验证码是否合法
    if (app.ifEmptyInput(this, this.code, 'code')) {
      return
    }
    var s = this
    // 进行密码操作
    if (tag == 'modify') {
      // 修改密码
      wx.request({
        url: 'https://www.dingdonhuishou.com/AHS/api/user/modify',
        data: {
          oldpassword: s.oldpassword,
          newpassword: s.newpassword,
          code: s.code
        },
        method: 'POST',
        header: app.globalData.header,
        success: function(res) {
          if (res['data']['isSuccess'] == 'TRUE') {
            wx.showToast({
              title: res['data']['content'],
              success: function() {
                setTimeout(function(){
                  wx.navigateBack()
                }, 1000)
              }
            })
          }
        },
        fail: function(error) {
          console.log(error)
        }
      })
    }else if (tag == 'forget') {
      // 忘记密码
      // 修改密码
      wx.request({
        url: 'https://www.dingdonhuishou.com/AHS/api/user/forgetpassword',
        data: {
          phonenum: s.phonenum,
          newpassword: s.newpassword,
          code: s.code
        },
        method: 'POST',
        header: app.globalData.header,
        success: function (res) {
          if (res['data']['isSuccess'] == 'TRUE') {
            wx.showToast({
              title: res['data']['content'],
              success: function () {
                setTimeout(function () {
                  wx.navigateBack()
                }, 1000)
              }
            })
          }
        },
        fail: function (error) {
          console.log(error)
        }
      })
    }
  },
  bindForgetTap: function(e) {
    wx.redirectTo({
      url: '/Mine/setting/operatePassword/index?tag=forget',
    })
  }
})