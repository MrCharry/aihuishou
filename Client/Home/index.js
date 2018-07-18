//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    deviceInfo: {},
    view: {
      showMenu: false
    },
    inputData: {}
  },
  onLoad: function () {
    
    this.setData({
      deviceInfo: app.globalData.deviceInfo,
    })
  },
  onShow: function() {
    var view = this.data.view
    view.showLoginModel = !app.globalData.loginStatus
    var userInfo = app.globalData.userInfo
    this.setData({
      userInfo: userInfo,
      loginStatus: app.globalData.loginStatus,
      view: view
    })
  },
  clickMenu: function (e) {
    var view = this.data.view
    view.showMenu = !view.showMenu
    app.adjustAOpacity(this)
  },
  clickOrderRecord: function (e) {
    var view = this.data.view
    app.adjustCOpacity(this)
    wx.navigateTo({
      url: '/pages/orderRecords/index',
      success: function () {
        wx.setNavigationBarTitle({
          title: '订单记录',
        })
      }
    })
    view.showMenu = false
  },
  clickRecycleRecord: function (e) {
    var view = this.data.view
    app.adjustDOpacity(this)
    wx.navigateTo({
      url: '/Mine/orders/index',
      success: function () {
        wx.setNavigationBarTitle({
          title: '回收记录',
        })
      }
    })
    view.showMenu = false
  },
  clickNotification: function (e) {
    var view = this.data.view
    var s = this
    view.eOpacity = 0.5
    this.setData({
      view: view
    })
    setTimeout(function () {
      view.eOpacity = 1
      s.setData({
        view: view
      })
    }, 200)
    wx.navigateTo({
      url: '/Mine/notification/index',
      success: function () {
        wx.setNavigationBarTitle({
          title: '消息通知',
        })
      }
    })
    view.showMenu = false
  },
  clickUserIcon: function (e) {
    var view = this.data.view
    app.adjustBOpacity(this)
    var s = this
    if (app.globalData.loginStatus) {
      wx.navigateTo({
        url: '/Mine/index',
        success: function () {
          wx.setNavigationBarTitle({
            title: '慧回收个人中心'
          })
        }
      })

    } else {
      wx.showModal({
        title: '提示',
        content: '暂未登录，需要登录吗？',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login_register/index',
              success: function () {
                wx.setNavigationBarTitle({
                  title: '慧回收用户登录',
                })
              }
            })
          } else if (res.cancel) {
            console.log("用户取消登录！")
            wx.showToast({
              title: '用户取消登录！',
              image: '/Resources/images/closeIcon_01.png'
            })
          }
        }
      })
    }
    view.showMenu = false
  },
  clickCloseLoginModel: function (e) {
    var view = this.data.view
    var s = this
    view.fOpacity = 0.5
    this.setData({
      view: view
    })
    setTimeout(function () {
      view.fOpacity = 1
      view.showLoginModel = false
      s.setData({
        view: view
      })
    }, 300)
  },
  getInput: function (e) {
    var inputData = this.data.inputData
    if (e.target.dataset.name == 'phonenum') {
      inputData.phonenum = e.detail.value
    } else if (e.target.dataset.name == 'verifiedCode') {
      inputData.verifiedCode = e.detail.value
    }
    this.setData({
      inputData: inputData
    })
  },
  getVerifiedCode: function (e) {
    app.getVerifiedCode(this)
  },
  clickLogin: function (e) {

    var phonenum = this.data.inputData.phonenum
    var verifiedCode = this.data.inputData.verifiedCode
    var s = this
    var header = app.globalData.header
    console.log(header)
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/user/login',
      data: {
        phonenum: phonenum,
        code: verifiedCode
      },
      method: 'POST',
      header: header,
      success: function (res) {
        console.log(res)
        var success = res['data']['isSuccess']

        if (success == 'TRUE') {
          app.getUserInfo(s, function() {
            app.globalData.loginStatus = true
            wx.showToast({
              title: '登录成功',
              success: function() {
                setTimeout(function() {
                  wx.navigateTo({
                    url: '/Mine/index'
                  })
                }, 1000)          
              }
            }) 
          }) 
          
        }else {
          console.log(res['data']['content'])
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
    app.adjustDOpacity(this)
  },
  clickLoginLabel: function (e) {
    app.adjustCOpacity(this)
    wx.navigateTo({
      url: '/pages/login_register/index',
      success: function () {
        wx.setNavigationBarTitle({
          title: '慧回收用户登录',
        })
      }
    })
  }
})
