// Mine/setting/index.js
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
  onLoad: function (options) {
    this.setData({
      deviceInfo: app.globalData.deviceInfo
    })
  },
  operatePassword: function(e) {
    
    wx.navigateTo({
      url: '/Mine/setting/operatePassword/index?tag=' + 'modify',
      success: function() {
        wx.setNavigationBarTitle({
          title: '修改密码',
        })
      }
    })
  },
  bindPaypasswordTap: function(e) {
    
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

        }
      },
      fail: function(error) {
        console.log(error)
      }
    })
  }
})