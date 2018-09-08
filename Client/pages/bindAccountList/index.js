// pages/bankcard/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkIcon: 'https://lg-gwh53phk-1252040173.cos.ap-shanghai.myqcloud.com/check.png',
    checkedIcon: 'https://lg-gwh53phk-1252040173.cos.ap-shanghai.myqcloud.com/checked.png'    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var userInfo = app.globalData.userInfo
    userInfo.banknum = userInfo.banknum=='' ? '':'**** ' + '**** ' + '**** ' + userInfo.banknum.slice(15,19)
    if (userInfo.alipaynum.length > 4) {
      var star = ''
      let prelen = userInfo.alipaynum.length-4
      let len = userInfo.alipaynum.length
      for (var i=0; i<prelen; ++i) {
        star += '*'
      }
      userInfo.alipaynum = star + userInfo.alipaynum.slice(prelen,len)
    }
    this.setData({
      userInfo: userInfo      
    })
  },
  bindAccountTap: function(e) {
    let userInfo = app.globalData.userInfo
    let tag = e.currentTarget.id
    let title = userInfo[tag]=='' ? '绑定账号':'重新绑定'
    // console.log(tag, userInfo[tag])
    // 跳转到绑定页面
    wx.navigateTo({
      url: '/pages/bindPage/index?tag=' + tag,
      success: function() {
        wx.setNavigationBarTitle({
          title: title,
        })
      }
    })
  },
  bindSetdefaultTap: function(e) {
    
    var s = this
    var checkIcon = this.data.checkIcon
    var userInfo = this.data.userInfo    
    var method = ''
    let paytype = e.currentTarget.id    

    if (paytype == 'wechat') {
      method = 0      
    }else if (paytype == 'alipay') {
      method = 1
    }else if (paytype == 'bank') {
      method = 2
    }
    // 设置默认支付方式
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/user/modify/paymethod?paymethod=' + method,
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        if (res['data']['isSuccess'] == 'TRUE') {
          wx.showToast({
            title: res['data']['content'],
            icon: 'none'
          })
          userInfo.paymethod = method + ''
          s.setData({
            userInfo: userInfo
          })
        }else {
          wx.showToast({
            title: res['data']['content'],
            icon: 'none'
          })
        }
      },
      fail: function(error) {
        console.log(error)
      }
    })
  }
})