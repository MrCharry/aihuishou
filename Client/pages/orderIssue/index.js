// pages/orderIssue/index.js
var app = getApp()
var wxMarkerData = []
const bmap = require('../../utils/bmap-wx.js')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
        name: 'normal',
        value: '一般',
        checked: 'true'
      },
      {
        name: 'emergency',
        value: '加急'
      },
      {
        name: 'book',
        value: '预约'
      }
    ],
    view: {},
    inputData: {
      amount: 0,
      degree: 'normal'
    },
    borderStyle: [
      '2px solid orange'
    ],
    idx: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      deviceInfo: app.globalData.deviceInfo,
      userInfo: app.globalData.userInfo
    })
  },
  onShow: function() {
    var s = this
    let adcode = app.globalData.adcode
    // 获取当前默认上门回收地址
    // wx.request({
    //   url: 'https://www.dingdonhuishou.com/AHSTest/api/useraddress/list?page.currentPage=1',
    //   method: 'POST',
    //   header: app.globalData.header,
    //   success: function(res) {

    //     var addressList = res['data']['data']
    //     console.log(addressList)
    //     for (var i = 0; i < addressList.length; ++i) {
    //       if (addressList[i].first == 1) {
    //         s.setData({
    //           addressInfo: addressList[i]
    //         })
    //       }
    //     }

    //   },
    //   fail: function(error) {
    //     console.log(error)
    //   }
    // })
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHSTest/api/useraddress/getdefault',
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        if (res['data']['isSuccess'] == 'TRUE') {
          s.setData({
            addressInfo: res['data']['data']
          })
        }
      },
      fail: function(error) {
        console.log(error)
      }
    })
    // 获取当前选择地址的废品回收信息
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/areawasteprice/list?areamoreid=' + adcode,
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        console.log(res)
        if (res['data']['listwaste'].length == 0) {
          wx.showModal({
            title: '提示',
            content: '当前地区暂不在服务范围',
            showCancel: false,
            confirmText: '返回',
            confirmColor: '#ff0000',
            success: function() {
              wx.navigateBack()
            }
          })
          return
        }
        var wasteinfo = res['data']['listwaste'][0]['listwastesub']
        var wastetypeinfo = res['data']['listwaste'][0]['wastetypeinfo'].split('<p>').join('').split('</p>').join('')
        var imgWidth = (app.globalData.deviceInfo.windowWidth - 30) / wasteinfo.length - 10
        for (var i = 0; i < wasteinfo.length; ++i) {
          wasteinfo[i]['wasteimg'] = 'https://dingdonhuishou.com/HHSmanager/wasteimg/' + wasteinfo[i]['wasteimg']
        }
        var inputData = s.data.inputData
        inputData.areawastepriceid = wasteinfo[0]['areawastepriceid']
        inputData.category = wasteinfo[0]['wastesubtype']
        inputData.price = wasteinfo[0]['price']
        s.setData({
          wasteinfo: wasteinfo,
          wastetypeinfo: wastetypeinfo,
          imgWidth: imgWidth,
          inputData: inputData
        })
      }
    })
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  bindImageTap: function(e) {

    var id = e.currentTarget.id
    var wasteinfo = this.data.wasteinfo
    var borderStyle = this.data.borderStyle
    var inputData = this.data.inputData

    for (var i = 0; i < wasteinfo.length; ++i) {
      if (i == id) {
        borderStyle[i] = '2px solid orange'
        this.setData({
          idx: i
        })
      } else {
        borderStyle[i] = ''
      }
    }
    inputData.priceid = e.currentTarget.dataset.priceid
    inputData.category = e.currentTarget.dataset.category
    inputData.price = e.currentTarget.dataset.price
    this.setData({
      borderStyle: borderStyle,
      inputData: inputData
    })
  },
  bindAmountTap: function(e) {
    // console.log(e)
    var inputData = this.data.inputData
    inputData.amount = e.detail.value
    this.setData({
      inputData: inputData
    })
  },
  bindDegreeChange: function(e) {

    var inputData = this.data.inputData
    inputData.degree = e.detail.value

    if (e.detail.value == 'book') {

      wx.showToast({
        title: '即日起七天内可接受预约,时间为9:00-18:00,下午三点后的预约顺延到下一工作日',
        icon: 'none',
        duration: 2000
      })
      var datetime = util.formatTime(new Date())
      var startDate = datetime.split(' ')[0].split('/').join('-')
      var time = datetime.split(' ')[1].slice(0, 5)
      var endDate = util.formatTime(new Date(new Date().getTime() + 7 * 24 * 3600 * 1000)).split(' ')[0].split('/').join('-')

      if (parseInt(datetime.split(' ')[1].slice(0, 2)) >= 15) {
        startDate = util.formatTime(new Date(new Date().getTime() + 1 * 24 * 3600 * 1000)).split(' ')[0].split('/').join('-')
        endDate = util.formatTime(new Date(new Date().getTime() + 8 * 24 * 3600 * 1000)).split(' ')[0].split('/').join('-')
      }
      console.log(startDate, endDate, time)

      this.setData({
        timeSet: {
          date: startDate,
          startDate: startDate,
          endDate: endDate,
          time: time
        }
      })
    }

    this.setData({
      inputData: inputData
    })

  },
  bindAddressModify: function(e) {
    app.adjustAOpacity(this)
    wx.navigateTo({
      url: '/pages/addressList/index',
      success: function() {
        wx.setNavigationBarTitle({
          title: '收货地址列表',
        })
      }
    })
  },
  bindReleaseTap: function(e) {
    app.adjustBOpacity(this)
    var inputData = this.data.inputData
    var s = this
    console.log(inputData)
    if (inputData.amount == 0) {
      wx.showModal({
        title: '提示',
        content: '请设置大于0的斤数！',
        showCancel: false,
        success: function() {
          s.setData({
            focus: true
          })
        }
      })
      return
    }
    let userInfo = app.globalData.userInfo
    let ak = app.globalData.ak
    var adcode = app.globalData.adcode

    wx.request({
      url: 'http://api.map.baidu.com/geocoder/v2/?address=' + userInfo.address + userInfo.detailaddress + '&output=json&ak=' + ak,
      method: 'GET',
      success: function(res) {
        if (res['data']['status'] == 0) {
          // 当前上门回收地址的经纬度
          let location = res['data']['result'].location
          // 获取当前上门回收地址的行政区划代码
          wx.request({
            url: 'http://api.map.baidu.com/geocoder/v2/?location=' + location.lat + ',' + location.lng + '&output=json&ak=' + ak,
            method: 'GET',
            success: function(res) {
              if (res['data']['status'] == 0) {

                adcode = res['data']['result']['addressComponent']['adcode']
                console.log(adcode, app.globalData.adcode)
                if (adcode == app.globalData.adcode) {
                  // 当前上门回收地址属于当前所选区域
                  // 进行发单操作
                  // wx.request({
                  //   url: 'https://www.dingdonhuishou.com/AHS/api/userorder/postorder',
                  //   data: {
                  //     lat: location.lat,
                  //     lng: location.lng,
                  //     address: inputData.address,
                  //     detailaddress: inputData.detailaddress,
                  //     areawastepriceid: inputData.areawastepriceid,
                  //     wasteprice: inputData.price,
                  //     wasteweight: inputData.amount,
                  //     recyclingwastestate: inputData.degree,
                  //     bookingtime: inputData.bookingtime,
                  //     areamoreid: x

                  //   },
                  //   method: 'POST',
                  //   header: app.globalData.header,
                  //   success: function (res) {

                  //   },
                  //   fail: function (error) {

                  //   }
                  // })

                } else {
                  // 当前上门回收地址不属于属于当前所选区域
                  // 1.获取当前上门回收地址的废品回收信息
                  wx.request({
                    url: 'https://www.dingdonhuishou.com/AHS/api/areawasteprice/list?areamoreid=' + adcode,
                    method: 'POST',
                    header: app.globalData.header,
                    success: function(res) {

                      // 2.判断当前上门回收地址所属区域是否在服务范围内
                      if (res['data']['listwaste'].length == 0) {
                        // 2.1不在服务范围内
                        wx.showModal({
                          title: '提示',
                          content: '当前上门回收地址未查询到相关废品回收信息，点击确定修改地址，点击返回重新选择发单区域',
                          success: function(opt) {
                            if (opt.confirm) {
                              // 用户点击确定按钮，跳转到地址栏页面
                              wx.navigateTo({
                                url: '/pages/modifyAddress/index',
                              })

                            } else {
                              // 用户点击取消，返回首页重新选择发单区域
                              wx.navigateBack()
                            }
                          }
                        })
                      } else {
                        // 2.2在服务范围内
                        // // 2.2.1判断当前上门回收地址废品信息与当前发单区域废品信息是否一致
                        // let wasteinfo = s.data.wasteinfo
                        // console.log(res['data'])
                        // if (res['data']['listwaste'][0]['listwastesub'][0]['areawastepriceid'] == wasteinfo[0]['areawastepriceid']) {
                        //   // 当前上门回收地址废品信息与当前发单区域废品信息一致
                        //   // 进行发单操作
                        //   console.log('发单')

                        // } else {
                        // 当前上门回收地址废品信息与当前发单区域废品信息不一致
                        // 提示用户即将修改废品回收信息与当前回收地址一致
                        wx.showModal({
                          title: '提示',
                          content: '当前上门回收地址废品信息与当前发单区域废品信息不一致，将为您获取当前上门回收地址的废品回收信息',
                          showCancel: false,
                          success: function() {
                            var wasteinfo = res['data']['listwaste'][0]['listwastesub']
                            var wastetypeinfo = res['data']['listwaste'][0]['wastetypeinfo'].split('<p>').join('').split('</p>').join('')
                            var imgWidth = (app.globalData.deviceInfo.windowWidth - 30) / wasteinfo.length - 10
                            for (var i = 0; i < wasteinfo.length; ++i) {
                              wasteinfo[i]['wasteimg'] = 'https://dingdonhuishou.com/HHSmanager/wasteimg/' + wasteinfo[i]['wasteimg']
                            }

                            inputData.areawastepriceid = wasteinfo[0]['areawastepriceid']
                            inputData.category = wasteinfo[0]['wastesubtype']
                            inputData.price = wasteinfo[0]['price']
                            s.setData({
                              wasteinfo: wasteinfo,
                              wastetypeinfo: wastetypeinfo,
                              imgWidth: imgWidth,
                              inputData: inputData
                            })
                            wx.showToast({
                              title: '获取当前上门回收地址的废品回收信息成功',
                            })
                            // 进行发布订单操作
                          }
                        })
                        // }
                      }

                    },
                    fail: function(error) {
                      console.log(error)
                    }
                  })
                }
              }
            },
            fail: function(error) {
              console.log(error)
            }
          })
        }
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },
  bindMinusTap: function(e) {
    var inputData = this.data.inputData
    if (inputData.amount == 0) {
      wx.showModal({
        title: '提示',
        content: '斤数必须大于0',
        showCancel: false
      })
      return
    }
    --inputData.amount
    this.setData({
      inputData: inputData
    })
  },
  bindPlusTap: function(e) {
    var inputData = this.data.inputData
      ++inputData.amount
    this.setData({
      inputData: inputData
    })
  },
  bindDateChange: function(e) {

    var timeSet = this.data.timeSet
    timeSet.date = e.detail.value
    this.setData({
      timeSet: timeSet
    })
  },
  bindTimeChange: function(e) {

    var tiemSet = this.data.timeSet
    tiemSet.time = e.detail.value
    this.setData({
      timeSet: tiemSet
    })
  },
})
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     view: {}
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     var ak = app.globalData.ak
//     var s = this
//     // 新建百度地图对象 
//     var BMap = new bmap.BMapWX({
//       ak: ak
//     });
//     var fail = function (data) {
//       console.log(data)
//     };
//     var success = function (data) {
//       wxMarkerData = data.wxMarkerData;
//       console.log(wxMarkerData)
//       s.setData({
//         curAddress: wxMarkerData[0].address,
//         curLocation: {
//           latitude: wxMarkerData[0].latitude,
//           longitude: wxMarkerData[0].longitude
//         }
//       }); 
//     }
//     // 发起regeocoding检索请求 
//     BMap.regeocoding({
//       fail: fail,
//       success: success
//     }); 

//     this.setData({
//       deviceInfo: app.globalData.deviceInfo
//     })
//   },
//   modifyaddress: function(e) {

//     var location = this.data.curLocation
//     var s = this

//     app.adjustAOpacity(this)

//     wx.openLocation({
//       latitude: location.latitude,
//       longitude: location.longitude,
//       success: function(res) {        
//         wx.chooseLocation({
//           success: function(res) {
//             s.setData({
//               curAddress: res.address              
//             })          
//           },
//         })
//       }
//     })
//   }
// })