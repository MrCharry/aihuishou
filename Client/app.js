//app.js

//设置时效缓存，time为有效时间，单位小时，默认24小时
var postfix = '_deadtime'
App({
  // ifReturn: false,
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    this.globalData.deviceInfo = wx.getSystemInfoSync()
    console.log(this.globalData.deviceInfo)
    wx.setStorageSync('logs', logs)
    var sessionid = this.getStorageSync('sessionid')
    
    if (sessionid == undefined) {
      this.globalData.header = { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': '' }
      this.globalData.loginStatus = false
      this.globalData.userInfo = ''
    }else {
      this.globalData.header = { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': sessionid }
      this.globalData.loginStatus = true
      this.globalData.userInfo = this.getUserInfo()
      // this.globalData.userInfo = this.getStorageSync('userInfo')
    }
    
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好,是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好,调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~,请您删除当前小程序,重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序,可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低,无法使用该功能,请升级到最新微信版本后重试。'
      })
    }
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    deviceInfo: null,
    loginStatus: false,
    ak: 'iNG9vVwmH7HqGhnbokSIZGSnRr2VtPCn'
  },
  adjustAOpacity: function (that) {
    var view = that.data.view
    var s = that
    view.aOpacity = 0.5
    that.setData({
      view: view
    })
    setTimeout(function () {
      view.aOpacity = 1
      s.setData({
        view: view
      })
    }, 200)
  },
  adjustBOpacity: function (that) {
    var view = that.data.view
    var s = that
    view.bOpacity = 0.5
    that.setData({
      view: view
    })
    setTimeout(function () {
      view.bOpacity = 1
      s.setData({
        view: view
      })
    }, 200)
  },
  adjustCOpacity: function (that) {
    var view = that.data.view
    var s = that
    view.cOpacity = 0.5
    that.setData({
      view: view
    })
    setTimeout(function () {
      view.cOpacity = 1
      s.setData({
        view: view
      })
    }, 200)
  },
  adjustDOpacity: function (that) {
    var view = that.data.view
    var s = that
    view.dOpacity = 0.5
    that.setData({
      view: view
    })
    setTimeout(function () {
      view.dOpacity = 1
      s.setData({
        view: view
      })
    }, 200)
  },
  adjustEOpacity: function (that) {
    var view = that.data.view
    var s = that
    view.eOpacity = 0.5
    that.setData({
      view: view
    })
    setTimeout(function () {
      view.eOpacity = 1
      s.setData({
        view: view
      })
    }, 200)
  },
  adjustFOpacity: function (that) {
    var view = that.data.view
    var s = that
    view.fOpacity = 0.5
    that.setData({
      view: view
    })
    setTimeout(function () {
      view.fOpacity = 1
      s.setData({
        view: view
      })
    }, 200)
  },
  getUserInfo: function (that, callback) {

    var header = this.globalData.header
    var self = this
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/user/get/personalinfo',
      method: 'POST',
      header: header,
      success: function (res) {

        console.log(res)
        var success = res['data']['isSuccess']
        if (success == 'TRUE') {
          console.log(res['data']['content'])
          var userInfo = res['data']['data']
          userInfo.imgpath = 'https://www.dingdonhuishou.com/AHS/uploads/' + userInfo.imgpath
          self.globalData.userInfo = userInfo
          self.setStorageSync('userInfo', userInfo, 7*24)
          console.log(userInfo)
          if (typeof (callback) == 'function') {
            callback(userInfo)
          }
        } else {
          console.log(res['data']['content'])
        }

      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  setStorageSync: function (k, v, time) {
    wx.setStorageSync(k, v);
    var t = time ? time : 24;
    var seconds = parseInt(t * 3600);
    if (seconds > 0) {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000 + seconds;
      wx.setStorageSync(k + postfix, timestamp + "")
    } else {
      wx.removeStorageSync(k + postfix)
    }
  },
  //读取缓存，若缓存不存在，返回def，若没有设置默认返回值，则返回undefined
  getStorageSync: function (k, def) {
    var deadtime = parseInt(wx.getStorageSync(k + postfix))
    if (deadtime) {
      if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
        wx.removeStorageSync(k);
        wx.removeStorageSync(k + postfix);
        if (def) { return def; } else { return; }
      }
    }
    var res = wx.getStorageSync(k);
    if (res) {
      return res;
    } else if (def) {
      return def;
    } else {
      return;
    }
  },
  getVerifiedCode: function (that) {

    var phonenum = that.data.inputData.phonenum
    console.log(phonenum)
    if (phonenum == undefined) {
      wx.showModal({
        title: '提示',
        content: '请输入手机号',
        showCancel: false,
        confirmColor: '#ff0000'
      })
      return
    }
    var header = this.globalData.header
    console.log(header)
    var self = this
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/requestcode',
      data: {
        phonenum: phonenum
      },
      method: 'POST',
      header: header,
      success: function (res) {
        console.log(res)
        if (header['Cookie'] == '') {
          var sessionid = res['header']['Set-Cookie'].split(';')[0]
          console.log(sessionid)
          self.globalData.header = { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': sessionid }
          self.setStorageSync('sessionid', sessionid)
          // self.getVerifiedCode()
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })

    //验证码倒计时函数
    var currentTime = 60
    that.setData({
      time: currentTime + '秒',
      disabled: true
    })
    var interval = setInterval(function () {
      that.setData({
        time: (currentTime - 1) + '秒'
      })
      currentTime--;
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新获取',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
  },
  iflegalphone: function(that) {
    var pattern = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
    var phonenum = that.data.inputData.phonenum == undefined ? '' : that.data.inputData.phonenum

    if (phonenum.length == 0) {
      wx.showToast({
        title: '手机号为空',
        image: '/Resources/images/error.png'
      })
      return false;
    } else if (!pattern.test(phonenum)) {
      wx.showToast({
        title: '手机号有误！',
        image: '/Resources/images/error.png'
      })
      return false;
    }else {
      return true;
    }
  },
  iflegalpassword: function(that) {

    var newPassword = that.data.inputData.newPassword == undefined ? '' : that.data.inputData.newPassword
    console.log(typeof(newPassword))
    // 检测输入密码长度是否合法
    if (newPassword.length < 6 || newPassword.length > 18) {
      wx.showToast({
        title: '密码过短或过长',
        image: '/Resources/images/error.png'
      })
      return false;
    }
    // 检测输入密码强度是否过弱
    for (var i = 0; i < newPassword.length - 1; ++i) {
      if (newPassword[i + 1].charCodeAt() - newPassword[i].charCodeAt() != 1) {
        break;
      }
    }
    for (var j = 0; j < newPassword.length - 1; ++j) {
      if (newPassword[j + 1].charCodeAt() - newPassword[j].charCodeAt() != -1) {
        break;
      }
    }
    if (i == newPassword.length - 1 || j == newPassword.length - 1) {
      wx.showToast({
        title: '连续的字符',
        image: '/Resources/images/error.png'
      })
      return false;
    }
    return true;
  }
})