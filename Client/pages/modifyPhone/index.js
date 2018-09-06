// pages/modifyPhone/index.js
var app = getApp()
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
    
    var userInfo = app.globalData.userInfo
    userInfo.phonenum = userInfo.phonenum.slice(0,3) + '****' + userInfo.phonenum.slice(7,11)
    
    this.setData({
      userInfo: userInfo,
      deviceInfo: app.globalData.deviceInfo
    })
  },
  getInput: function(e) {
    
    var tag = e.currentTarget.id

    if (tag == 'oldnum') {
      this.oldnum = e.detail.value
    } else if (tag == 'newnum') {
      this.newnum = e.detail.value
    }else if (tag == 'oldcode') {
      this.oldcode = e.detail.value
    }else if (tag == 'newcode') {
      this.newcode = e.detail.value
    }
  },
  bindblurTap: function(e) {
    if (e.currentTarget.id == 'oldnum') {

      app.iflegalphone(this, this.oldnum)
     
    }else if (e.currentTarget.id == 'newnum') {

      app.iflegalphone(this, this.newnum)
   
    }
    
  },
  getVerifiedCode: function(e) {


    if (e.currentTarget.id == 'oldcode') {

      app.getVerifiedCode(this, this.oldnum)

    }else if (e.currentTarget.id == 'newcode') {

      app.getVerifiedCode(this, this.newnum)
    }

  },
  submit: function(e) {

    // 判断输入是否为空
    if (e.currentTarget.id == 'oldcode') {

      if (app.ifEmptyInput(this, this.oldcode, 'code')) {
        return
      }

    } else if (e.currentTarget.id == 'newcode') {

      if (app.ifEmptyInput(this, this.newcode, 'code')) {
        return
      }
    }

    var s = this
    
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/user/changephonenum',
      data: {
        oldphonenum: s.oldnum,
        oldcode: s.oldcode,
        newphonenum: s.newnum,
        newcode: s.newcode
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
            confirmColor: '#ff0000',
            success: function() {
              wx.redirectTo({
                url: '/pages/modifyPhone/index'
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