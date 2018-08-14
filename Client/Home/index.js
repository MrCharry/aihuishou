//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    deviceInfo: {},
    view: {
      showMenu: false
    },
    inputData: {},
    merchants: []
  },
  onLoad: function() {
    var s = this

    wx.getLocation({

      success: function(res) {
        console.log(res)
        s.setData({
          deviceInfo: app.globalData.deviceInfo,
          curLocation: res,
          markers: [{
            id: 0,
            iconPath: '/Resources/images/location_01.png',
            longitude: res.longitude,
            latitude: res.latitude
          }],
          circles: [{
            latitude: res.latitude,
            longitude: res.longitude,
            radius: 1000,
            fillColor: '#f2f2f2AA',
            color: '#2e84d4AA'
          }]
        })
        //获取当前经纬度的行政区划代码
        var ak = app.globalData.ak
        var i = 1
        wx.request({
          url: 'http://api.map.baidu.com/geocoder/v2/?location=' + res.latitude + ',' + res.longitude + '&output=json&ak=' + ak,
          method: 'GET',
          success: function(res) {
            var adcode = res['data']['result']['addressComponent']['adcode']
            console.log(res)
            s.getnearmerchants(adcode, i)
          }
        })
      },
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
    console.log(this.data.merchants)
  },
  clickMenu: function(e) {
    var view = this.data.view
    view.showMenu = !view.showMenu
    app.adjustAOpacity(this)
  },
  clickOrderRecord: function(e) {
    var view = this.data.view
    app.adjustCOpacity(this)
    wx.navigateTo({
      url: '/pages/orderRecords/index',
      success: function() {
        wx.setNavigationBarTitle({
          title: '订单记录',
        })
      }
    })
    view.showMenu = false
  },
  clickRecycleRecord: function(e) {
    var view = this.data.view
    app.adjustDOpacity(this)
    wx.navigateTo({
      url: '/Mine/orders/index',
      success: function() {
        wx.setNavigationBarTitle({
          title: '回收记录',
        })
      }
    })
    view.showMenu = false
  },
  clickNotification: function(e) {
    var view = this.data.view
    var s = this
    view.eOpacity = 0.5
    this.setData({
      view: view
    })
    setTimeout(function() {
      view.eOpacity = 1
      s.setData({
        view: view
      })
    }, 200)
    wx.navigateTo({
      url: '/Mine/notification/index',
      success: function() {
        wx.setNavigationBarTitle({
          title: '消息通知',
        })
      }
    })
    view.showMenu = false
  },
  clickUserIcon: function(e) {
    var view = this.data.view
    app.adjustBOpacity(this)
    var s = this
    if (app.globalData.loginStatus) {
      wx.navigateTo({
        url: '/Mine/index',
        success: function() {
          wx.setNavigationBarTitle({
            title: '慧回收个人中心'
          })
        }
      })

    } else {
      wx.showModal({
        title: '提示',
        content: '暂未登录，需要登录吗？',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login_register/index',
              success: function() {
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
  clickCloseLoginModel: function(e) {
    var view = this.data.view
    var s = this
    view.fOpacity = 0.5
    this.setData({
      view: view
    })
    setTimeout(function() {
      view.fOpacity = 1
      view.showLoginModel = false
      s.setData({
        view: view
      })
    }, 300)
  },
  getInput: function(e) {
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
  getVerifiedCode: function(e) {
    app.getVerifiedCode(this)
  },
  iflegalphone: function(e) {
    app.iflegalphone(this)
  },
  clickLogin: function(e) {

    var phonenum = this.data.inputData.phonenum
    var verifiedCode = this.data.inputData.verifiedCode
    var self = this
    var header = app.globalData.header
    console.log(header)
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHSTest/api/user/login',
      data: {
        phonenum: phonenum,
        code: verifiedCode
      },
      method: 'POST',
      header: header,
      success: function(res) {
        console.log(res)
        var success = res['data']['isSuccess']

        if (success == 'TRUE') {
          app.getUserInfo(self, function() {
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

        } else {
          console.log(res['data']['content'])
        }
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },
  clickLoginLabel: function(e) {
    app.adjustCOpacity(this)
    wx.navigateTo({
      url: '/pages/login_register/index',
      success: function() {
        wx.setNavigationBarTitle({
          title: '慧回收用户登录',
        })
      }
    })
  },
  getCurLocation: function(e) {
    var s = this
    app.adjustFOpacity(this)
    let lat = 22.5595
    let lng = 113.8895
    this.setData({
      curLocation: {
        latitude: lat,
        longitude: lng
      },
      markers: [{
        iconPath: '/Resources/images/location_01.png',
        latitude: lat,
        longitude: lng

      }],
      circles: [{
        latitude: lat,
        longitude: lng,
        radius: 1000,
        fillColor: '#f2f2f2AA',
        color: '#2e84d4AA'
      }]
    })
    //获取当前经纬度的行政区划代码
    var ak = app.globalData.ak
    var i = 1
    var location = this.data.curLocation
    var markers = this.data.markers
    wx.request({
      url: 'http://api.map.baidu.com/geocoder/v2/?location=' + location.latitude + ',' + location.longitude + '&output=json&ak=' + ak,
      method: 'GET',
      success: function(res) {
        var adcode = res['data']['result']['addressComponent']['adcode']
        s.getnearmerchants(adcode, i, function(merchants) {
          console.log(merchants)
          for (var j = 0; j < merchants.length; ++j) {
            var merchant = merchants[j]['merchant']
            markers.push({
              id: j+1,
              iconPath: '/Resources/images/location_red.png',
              latitude: merchant.lat,
              longitude: merchant.lng
            })
          }
          s.setData({
            markers: markers,
            merchants: merchants
          })
        })
      }
    })

  },
  getnearmerchants: function(adcode, i, callback) {

    var merchants = this.data.merchants
    var location = this.data.curLocation
    var s = this

    wx.request({
      url: 'https://www.dingdonhuishou.com/AHSTest/api/userorder/get/nearmerchants?page.currentPage=' + i + '&lng=' + location.longitude + '&lat=' + location.latitude + '&areamoreid=' + adcode + '&lengthofnear=0',
      method: 'POST',
      success: function(res) {
        //汇总回收商地址
        if (i > 1) {
          merchants = merchants.concat(res['data']['data'])
        } else {
          merchants = res['data']['data']
        }

        if (res['data']['hasMore'] == true) {
          s.getnearmerchants(adcode, ++i)
        }
        if (typeof(callback) == 'function') {
          callback(merchants)
        }
      },
      fail: function(error) {
        console.log(error)
        if (typeof(callback) == 'function') {
          var errMsg = {
            status: false,
            content: '请求回收商地址失败'
          }
          callback(errMsg)
        }
      }
    })
  },
  markertap: function(e) {
    var s = this
    var id = e.markerId
    var marksers = s.data.markers    
    s.changeMarkerColor(marksers, id)
    
  },
  changeMarkerColor: function (data, id) {
    var that = this;
    // var markersTemp = data
    for (var i = 1; i < data.length; i++) {
      if (i === id) {
        data[i].iconPath = "/Resources/images/location_green.png";
      } else {
        data[i].iconPath = "/Resources/images/location_red.png";
      }
      // markersTemp[i] = data[i];
    }
    that.setData({
      markers: data
    });
  }
})
