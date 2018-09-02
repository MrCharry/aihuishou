// Mine/setting/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceInfo: {},
    view: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceInfo: app.globalData.deviceInfo
    })
  },
  modifyPassword: function(e) {
    app.adjustAOpacity(this)
    wx.navigateTo({
      url: '/Mine/setting/modifyPassword/index?rowlabel=输入旧密码&placeholder=输入原密码&name=oldPassword&ifpassword=TRUE',
      success: function() {
        wx.setNavigationBarTitle({
          title: '设置',
        })
      }
    })
  },
  bindPaypasswordTap: function(e) {
    app.adjustBOpacity(this)
    var tag = ''
    if (app.globalData.userInfo.paypassword == '') {
      tag = 'new'
    }else {
      tag = 'modify'
    }
    wx.navigateTo({
      url: '/Mine/setting/paypassword/index?tag='+tag,
      success: function () {
        wx.setNavigationBarTitle({
          title: '设置',
        })
      }
    })
  },
  clickLogout: function(e) {
    console.log("退出登录")
    wx.showModal({
      title: '提示',
      content: '确定退出吗？',
      success: function(res) {
        if (res['confirm'] == true) {
          wx.request({
            url: 'https://www.dingdonhuishou.com/AHSTest/api/user/exit',
            method: 'POST',
            header: app.globalData.header,
            success: function(res) {
              if (res['data']['isSuccess'] == 'TRUE') {
                wx.removeStorageSync('sessionid')
                wx.removeStorageSync('userInfo')
                app.onLaunch()
                wx.reLaunch({
                  url: '/Home/index',
                })
              }else {
                console.log(res['data']['content'])
              }
            }
          })

        }else if (res['cancel'] == true) {

        }

      },
      fail: function(error) {
        console.log(error)
      }
    })
  }
})