var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceInfo: {},
    view: {
      btnText: "登录",
      leftLabelText: "立即注册",
      rightLabelText: "密码登录",
      showOptions: true,
      showRow2: true
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
  getInput: function (e) {
    
    if (e.target.dataset.name == 'phonenum') {
      this.phonenum = e.detail.value
    } else if (e.target.dataset.name == 'verifiedCode') {
      this.verifiedCode = e.detail.value
    } else if (e.target.dataset.name == 'password') {
      this.password = e.detail.value
    }
  },
  iflegalphone: function (e) {
    app.iflegalphone(this, this.phonenum)
  },
  getVerifiedCode: function (e) {

    let phonenum = this.phonenum

    if (phonenum == undefined) {
      wx.showModal({
        title: '请输入手机号',
        image: '/Resources/images/error.png',
        success: function () {
          that.setData({
            focus: true
          })
        }
      })
      return
    }
    app.getVerifiedCode(this, phonenum)
  },
  clickLogin: function (e) {

    var view = this.data.view
    var phonenum = this.phonenum
    var header = app.globalData.header
    var self = this
    app.adjustBOpacity(this)

    if (view.rightLabelText == '验证码登录') {
      //当前为密码登录模式
      var password = this.password
      // 判断旧密码是否为空
      if (app.ifEmptyInput(this, password, 'password')) {
        return
      }
      wx.request({
        url: 'https://www.dingdonhuishou.com/AHS/api/user/loginbypassword',
        data: {
          phonenum: phonenum,
          password: password
        },
        method: 'POST',
        header: header,
        success: function (res) {
          console.log(res)
          var success = res['data']['isSuccess']

          if (success == 'TRUE') {
            if (header['Cookie'] == '') {
              var sessionid = res['header']['Set-Cookie'].split(';')[0]
              console.log(sessionid)
              app.globalData.header = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': sessionid
              }
              app.setStorageSync('sessionid', sessionid)

            }
            app.getUserInfo(self, function () {
              app.globalData.loginStatus = true
              wx.showToast({
                title: '登录成功',
                success: function () {
                  setTimeout(function () {
                    wx.reLaunch({
                      url: '/Home/index',
                      success: function () {
                        setTimeout(function () {
                          wx.navigateTo({
                            url: '/Mine/index',
                          })
                        }, 500)
                      }
                    })
                  }, 1000)
                }
              })
            })

          } else {
            wx.showModal({
              title: '提示',
              content: res['data']['content'],
              showCancel: false,
              confirmText: '重试',
              confirmColor: '#ff0000'
            })
            console.log(res['data']['content'])
          }

        },
        fail: function (error) {
          console.log(error)
        }
      })
    } else if (view.rightLabelText == '密码登录') {
      //当前为验证码登录模式
      this.code = this.verifiedCode
      // 判断验证码是否为空
      if (app.ifEmptyInput(this, this.code, 'code')) {
        return
      }
      
      wx.request({
        url: 'https://www.dingdonhuishou.com/AHS/api/user/login',
        data: {
          phonenum: phonenum,
          code: self.code
        },
        method: 'POST',
        header: header,
        success: function (res) {
          console.log(res)
          var success = res['data']['isSuccess']

          if (success == 'TRUE') {

            app.getUserInfo(self, function () {
              app.globalData.loginStatus = true
              wx.showToast({
                title: '登录成功',
                success: function () {
                  setTimeout(function () {
                    wx.reLaunch({
                      url: '/Home/index',
                      success: function () {
                        setTimeout(function () {
                          wx.navigateTo({
                            url: '/Mine/index',
                          })
                        }, 500)
                      }
                    })
                  }, 1000)
                }
              })
            })

          } else {
            wx.showModal({
              title: '提示',
              content: res['data']['content'],
              showCancel: false,
              confirmText: '重试',
              confirmColor: '#ff0000'
            })
            console.log(res['data']['content'])
          }

        },
        fail: function (error) {
          console.log(error)
        }
      })

    } else if (view.btnText == '立即注册') {
      //注册页面
      var password = this.password
      var verifiedCode = this.verifiedCode
      wx.request({
        url: 'https://www.dingdonhuishou.com/AHS/api/user/register',
        data: {
          phonenum: phonenum,
          password: password,
          code: verifiedCode
        },
        method: 'POST',
        header: header,
        success: function (res) {
          if (res['data']['isSuccess'] == 'TRUE') {
            wx.showToast({
              title: '注册成功',
              success: function () {
                wx.request({
                  url: 'https://www.dingdonhuishou.com/AHS/api/user/loginbypassword',
                  data: {
                    phonenum: phonenum,
                    password: password
                  },
                  method: 'POST',
                  header: header,
                  success: function (res) {
                    console.log(res)
                    var success = res['data']['isSuccess']

                    if (success == 'TRUE') {
                      if (header['Cookie'] == undefined) {
                        var sessionid = res['header']['Set-Cookie'].split(';')[0]
                        console.log(sessionid)
                        app.globalData.header = {
                          'Content-Type': 'application/x-www-form-urlencoded',
                          'Cookie': sessionid
                        }
                        app.setStorageSync('sessionid', sessionid)

                      }
                      app.getUserInfo(self, function () {
                        app.globalData.loginStatus = true
                        wx.reLaunch({
                          url: '/Home/index',
                          success: function () {
                            setTimeout(function () {
                              wx.navigateTo({
                                url: '/Mine/index',
                              })
                            }, 1000)
                          }
                        })
                      })

                    } else {
                      console.log(res['data']['content'])
                    }

                  },
                  fail: function (error) {
                    console.log(error)
                  }
                })
              }
            })

          } else {
            wx.showModal({
              title: '提示',
              content: res['data']['content'],
              showCancel: false,
              confirmText: '重试',
              confirmColor: '#ff0000'
            })
            console.log(res['data']['content'])
          }

        },
        fail: function (error) {
          console.log(error)
        }
      })

    }
  },
  clickLeftLabel: function (e) {

    var view = this.data.view
    app.adjustCOpacity(this)
    if (view.leftLabelText == '忘记密码') {
      wx.navigateTo({
        url: '/Mine/setting/modifyPassword/index?tag=' + 'forget',
        success: function (e) {
          wx.setNavigationBarTitle({
            title: '设置',
          })
        }
      })
    } else {
      view.showRow1 = true
      view.showLoginLabel = true
      view.showOptions = false
      view.btnText = "注册"
      this.setData({
        view: view
      })
      wx.setNavigationBarTitle({
        title: '慧回收用户注册',
      })
    }
  },
  clickRightLabel: function (e) {
    var view = this.data.view
    app.adjustDOpacity(this)
    if (view.rightLabelText == '验证码登录') {
      wx.navigateTo({
        url: '/pages/login_register/index',
        success: function (e) {
          wx.setNavigationBarTitle({
            title: '慧回收用户登录',
          })
        }
      })
    } else {
      view.leftLabelText = "忘记密码"
      view.rightLabelText = "验证码登录"
      view.btnText = '登录'
      view.showRow1 = true
      view.showRow2 = false
      this.setData({
        view: view
      })
    }
  },
  goLogin: function (e) {
    console.log("直接登录")
    var view = this.data.view
    view.showRow1 = false
    view.showOptions = true
    view.showLoginLabel = false
    view.btnText = '登录'
    wx.setNavigationBarTitle({
      title: '慧回收用户登录',
    })
    this.setData({
      view: view
    })
  }
})