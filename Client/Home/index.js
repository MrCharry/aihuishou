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
  onLoad: function () {

    this.setData({
      deviceInfo: app.globalData.deviceInfo,
      loginStatus: app.globalData.loginStatus
    })
  },
  onShow: function () {

    var userInfo = app.globalData.userInfo ? app.globalData.userInfo : app.getStorageSync('userInfo')    
    if (userInfo != undefined) {
      this.setData({
        userInfo: userInfo,
        nickname: userInfo.nickname ? userInfo.nickname : userInfo.name
      })
    }
    var view = this.data.view
    view.showLoginModel = !app.globalData.loginStatus
    view.showMenu = false
    this.setData({
      loginStatus: app.globalData.loginStatus,
      view: view
    })
    this.showLocation()
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
    app.adjustFOpacity(this)

    wx.navigateTo({
      url: '/Mine/notification/index',
      success: function () {
        wx.setNavigationBarTitle({
          title: '消息通知',
        })
      }
    })          
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
              icon: 'none'
            })
          }
        }
      })
    }
    view.showMenu = false
  },
  clickCloseLoginModel: function (e) {

    var view = this.data.view
    view.showLoginModel = false
    this.setData({
      view: view
    })
    app.adjustFOpacity(this)
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
  iflegalphone: function (e) {
    app.iflegalphone(this)
  },
  clickLogin: function (e) {

    var phonenum = this.data.inputData.phonenum
    var verifiedCode = this.data.inputData.verifiedCode
    var self = this
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
          app.getUserInfo(self, function () {
            app.globalData.loginStatus = true
            wx.showToast({
              title: '登录成功',
              success: function () {
                setTimeout(function () {
                  wx.navigateTo({
                    url: '/Mine/index'
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
  },
  showLocation: function (location) {
    // console.log(location)
    var s = this
    app.adjustFOpacity(this)
    if (location == undefined) {
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          s.setData({
            curLocation: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            markers: [{
              id: 0,
              iconPath: '/Resources/images/location_01.png',
              latitude: res.latitude,
              longitude: res.longitude,
              callout: {
                content: '当前位置',
                fontSize: 20,
                borderRadius: 10,
                bgColor: "#fff",
                padding: 10,
                display: 'BYCLICK',
                textAlign: 'center'
              }

            }],
            circles: [{
              latitude: res.latitude,
              longitude: res.longitude,
              radius: 2000,
              fillColor: '#f2f2f2AA',
              color: '#2e84d4AA'
            }]
          })
          //获取当前经纬度的行政区划代码
          var ak = app.globalData.ak
          var location = s.data.curLocation
          var markers = s.data.markers

          wx.request({
            url: 'http://api.map.baidu.com/geocoder/v2/?location=' + location.latitude + ',' + location.longitude + '&output=json&ak=' + ak,
            method: 'GET',
            success: function (res) {
              console.log(res)
              var adcode = res['data']['result']['addressComponent']['adcode']
              s.getnearmerchants(adcode, 1, function (merchants) {
                console.log(merchants)
                for (var j = 0; j < merchants.length; ++j) {
                  var merchant = merchants[j]['merchant']
                  markers.push({
                    id: j+1,
                    iconPath: '/Resources/images/location_red.png',
                    latitude: merchant.lat,
                    longitude: merchant.lng,
                    callout: {
                      content: merchant.name + '\n' + '预约',
                      fontSize: 20,
                      borderRadius: 10,
                      bgColor: "#2dbea7",
                      padding: 10,
                      display: 'BYCLICK',
                      textAlign: 'center'
                    }
                  })
                }
                s.curadcode = adcode
                s.curdist = res['data']['result']['addressComponent']['district']
                s.setData({
                  markers: markers,
                  merchants: merchants,
                  region: [
                    res['data']['result']['addressComponent']['province'],
                    res['data']['result']['addressComponent']['city'],
                    res['data']['result']['addressComponent']['district']
                  ]
                })
                console.log(s.data.region)
              })
            }
          })
        },
      })
    } else {

      s.setData({
        curLocation: {
          latitude: location.lat,
          longitude: location.lng
        },
        markers: [{
          id: 0,
          iconPath: '/Resources/images/location_01.png',
          latitude: location.lat,
          longitude: location.lng,
          callout: {
            content: '当前位置',
            fontSize: 20,
            borderRadius: 10,
            bgColor: "#fff",
            padding: 10,
            display: 'BYCLICK',
            textAlign: 'center'
          }
        }],
        circles: [{
          latitude: location.lat,
          longitude: location.lng,
          radius: 2000,
          fillColor: '#f2f2f2AA',
          color: '#2e84d4AA'
        }]
      })

      //获取选择区域的行政区划代码
      var ak = app.globalData.ak
      var location = s.data.curLocation
      var markers = s.data.markers

      wx.request({
        url: 'http://api.map.baidu.com/geocoder/v2/?location=' + location.latitude + ',' + location.longitude + '&output=json&ak=' + ak,
        method: 'GET',
        success: function (res) {
          console.log(res)
          var adcode = res['data']['result']['addressComponent']['adcode']
          s.getnearmerchants(adcode, 1, function (merchants) {
            console.log(merchants)
            for (var j = 0; j < merchants.length; ++j) {
              var merchant = merchants[j]['merchant']
              markers.push({
                id: merchant.id,
                iconPath: '/Resources/images/location_red.png',
                latitude: merchant.lat,
                longitude: merchant.lng,
                callout: {
                  content: merchant.name + '\n' + '预约',
                  fontSize: 20,
                  borderRadius: 10,
                  bgColor: "#2dbea7",
                  padding: 10,
                  display: 'BYCLICK',
                  textAlign: 'center'
                }
              })
            }
            s.selectedadcode = adcode
            s.selecteddist = res['data']['result']['addressComponent']['district']
            s.setData({
              markers: markers,
              merchants: merchants,
              region: [
                res['data']['result']['addressComponent']['province'],
                res['data']['result']['addressComponent']['city'],
                res['data']['result']['addressComponent']['district']
              ]
            })
            console.log(s.data.region)
          })
        }
      })
    }
  },
  getnearmerchants: function (adcode, i, callback) {

    var merchants = this.data.merchants
    var location = this.data.curLocation
    var s = this

    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/userorder/get/nearmerchants?page.currentPage=' + i + '&lng=' + location.longitude + '&lat=' + location.latitude + '&areamoreid=' + adcode + '&lengthofnear=0',
      method: 'POST',
      header: app.globalData.header,
      success: function (res) {
        //汇总回收商地址
        if (i > 1) {
          merchants = merchants.concat(res['data']['data'])
        } else {
          merchants = res['data']['data']
        }
        s.setData({
          merchants: merchants
        })
        if (res['data']['hasMore'] == true) {
          s.getnearmerchants(adcode, ++i)
          return
        }
        if (typeof (callback) == 'function') {
          callback(merchants)
        }
      },
      fail: function (error) {
        console.log(error)
        if (typeof (callback) == 'function') {
          var errMsg = {
            status: false,
            content: '请求回收商地址失败'
          }
          callback(errMsg)
        }
      }
    })
  },
  callouttap: function (e) {
    this.setData({
      bookmerchantid: e.markerId
    })
    this.issueOrder('book')
  },
  issueOrder: function (tag) {

    app.adjustEOpacity(this)
    if (!app.globalData.loginStatus) {
      wx.showModal({
        title: '提示',
        content: '请先登录！',
        showCancel: false,
        success: function() {
          wx.navigateTo({
            url: '/pages/login_register/index',
            success: function() {
              wx.setNavigationBarTitle({
                title: '慧回收用户登录',
              })
            }
          })
        }
      })
      return
    }
    let bookmerchantid = this.data.bookmerchantid
    let adcode = this.selectedadcode ? this.selectedadcode:this.curadcode
    let dist = this.selecteddist ? this.selecteddist:this.curdist
    var url = ''
    if (tag == 'book') {
      url = '/pages/orderIssue/index?adcode=' + adcode + '&tag=' + tag + '&bookmerchantid=' + bookmerchantid + '&dist='+dist
    }else {
      url = '/pages/orderIssue/index?adcode=' + adcode + '&dist='+dist
    }
    this.selectedadcode = ''
    this.selecteddist = ''

    wx.navigateTo({
      url: url,
      success: function () {
        wx.setNavigationBarTitle({
          title: '发布订单',
        })
      }
    })
  },
  bindRegionChange: function (e) {
    let s = this
    if (e.detail.value == undefined) {
      return
    }
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
    // 正向地理解析：地名->经纬度
    let ak = app.globalData.ak
    let address = e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    console.log(address)
    wx.request({
      url: 'http://api.map.baidu.com/geocoder/v2/?address=' + address + '&ret_coordtype=gcj02ll&output=json&ak=' + ak,
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res['data']['status'] == 0) {
          s.showLocation(res['data']['result']['location'])
        }
      }
    })
  },
  getCurLocation: function(e) {
    this.showLocation()
  }
})