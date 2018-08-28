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
      checked: true
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
  onLoad: function (options) {
    console.log(options)
    // 用户主动预约回收商
    if (options.tag == 'book') {
      var items = this.data.items
      items[0].checked = false
      items[0].disabled = true
      items[1].disabled = true
      items[2].checked = true
      var e = {
        detail: {
          value: 'book'
        }
      }
      this.setData({
        items: items
      })
      this.bindDegreeChange(e)
    }

    this.setData({
      deviceInfo: app.globalData.deviceInfo,
      userInfo: app.globalData.userInfo,
      options: options
    })
  },
  onShow: function () {
    var s = this
    let adcode = this.options.adcode

    // 获取当前选择区域的废品回收信息
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/areawasteprice/list?areamoreid=' + adcode,
      method: 'POST',
      header: app.globalData.header,
      success: function (res) {
        console.log(res)
        if (res['data']['listwaste'].length == 0) {
          wx.showModal({
            title: '提示',
            content: '当前地区暂不在服务范围',
            showCancel: false,
            confirmText: '返回',
            confirmColor: '#ff0000',
            success: function () {
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
    // 获取当前默认上门回收地址
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHSTest/api/useraddress/getdefault',
      method: 'POST',
      header: app.globalData.header,
      success: function (res) {
        console.log(res)
        if (res['data']['isSuccess'] == 'TRUE') {
          s.setData({
            addressInfo: res['data']['data']
          })
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })

    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  bindImageTap: function (e) {

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
  bindAmountFocus: function(e) {
    var inputData = this.data.inputData
    if (inputData.amount == 0) {
      inputData.amount = ''
      this.setData({
        inputData: inputData
      })
    }
  },
  bindAmountTap: function (e) {

    var inputData = this.data.inputData
    inputData.amount = e.detail.value
    this.setData({
      inputData: inputData
    })
  },
  bindDegreeChange: function (e) {

    var inputData = this.data.inputData
    inputData.degree = e.detail.value

    if (e.detail.value == 'book') {

      wx.showToast({
        title: '七天内可接受预约,时间为9点-18点,15点后的预约顺延到下一工作日',
        icon: 'none',
        duration: 2000
      })
      var datetime = util.formatTime(new Date())
      var startDate = datetime.split(' ')[0].split('/').join('-')
      var time = parseInt(datetime.split(' ')[1].slice(0, 2))<18 ? datetime.split(' ')[1].slice(0, 5):'18:00'
      var endDate = util.formatTime(new Date(new Date().getTime() + 7 * 24 * 3600 * 1000)).split(' ')[0].split('/').join('-')

      if (parseInt(datetime.split(' ')[1].slice(0, 2)) >= 15) {
        startDate = util.formatTime(new Date(new Date().getTime() + 1 * 24 * 3600 * 1000)).split(' ')[0].split('/').join('-')
        endDate = util.formatTime(new Date(new Date().getTime() + 8 * 24 * 3600 * 1000)).split(' ')[0].split('/').join('-')
      }
      this.setData({
        timeSet: {
          date: startDate,
          startDate: startDate,
          endDate: endDate,
          time: time
        }
      })
      console.log(this.data.timeSet)
    }

    this.setData({
      inputData: inputData
    })

  },
  bindAddressModify: function (e) {
    app.adjustAOpacity(this)
    wx.navigateTo({
      url: '/pages/addressList/index',
      success: function () {
        wx.setNavigationBarTitle({
          title: '收货地址列表',
        })
      }
    })
  },
  bindReleaseTap: function (e) {
    app.adjustBOpacity(this)
    var inputData = this.data.inputData
    var s = this
    console.log(inputData)
    if (inputData.amount == 0) {
      wx.showModal({
        title: '提示',
        content: '请设置大于0的斤数！',
        showCancel: false,
        success: function () {
          s.setData({
            focus: true
          })
        }
      })
      return
    }
    let ak = app.globalData.ak
    let opt = this.data.options
    let addressInfo = this.data.addressInfo

    // 获取当前上门回收地址的行政区划代码
    wx.request({
      url: 'http://api.map.baidu.com/geocoder/v2/?location=' + addressInfo.lat + ',' + addressInfo.lng + '&output=json&ak=' + ak,
      method: 'GET',
      success: function (res) {
        if (res['data']['status'] == 0) {

          let adcode = res['data']['result']['addressComponent']['adcode']
          console.log(adcode, opt.adcode)

          // 当前上门回收地址属于当前所选区域
          if (adcode == opt.adcode) {

            // 进行发单操作: 1.主动预约商户上门回收  2.用户发布上门回收
            if (opt.tag == 'book' || inputData.degree == 'book') {
              // 1.主动预约商户上门回收
              let merchantid = opt.bookmerchantid
              let timestamp = s.data.timeSet.date.split('-').join('') + s.data.timeSet.time.split(':').join('')+ '00'
              console.log('主动预约商户上门回收')
              
              wx.request({
                url: 'https://www.dingdonhuishou.com/AHS/api/userorder/book/merchant',
                data: {                
                  lat: addressInfo.lat,
                  lng: addressInfo.lng,
                  merchanttid: merchantid,
                  address: addressInfo.address,
                  detailaddress: addressInfo.detailaddress,
                  areawastepriceid: inputData.areawastepriceid,
                  wasteprice: inputData.price,
                  wasteweight: inputData.amount,
                  recyclingwastestate: 3,
                  bookingtime: timestamp,
                  areamoreid: adcode

                },
                method: 'POST',
                header: app.globalData.header,
                success: function(res) {
                  if (res['data']['isSuccess'] == 'TRUE') {
                    wx.showToast({
                      title: '预约成功',
                      success: function() {
                        wx.navigateBack()
                      }
                    })
                  }else {
                    wx.showModal({
                      title: '提示',
                      content: res['data']['content'],
                      showCancel: false,
                      confirmText: '重试',
                      confirmColor: '#ff0000'
                    })
                  }
                },
                fail: function(error) {
                  console.log(error)
                }
              })

            } else {
              // 2.用户发布上门回收
              console.log('用户发布上门回收')
              
              wx.request({
                url: 'https://www.dingdonhuishou.com/AHS/api/userorder/postorder',
                data: {
                  lat: addressInfo.lat,
                  lng: addressInfo.lng,
                  address: addressInfo.address,
                  detailaddress: addressInfo.detailaddress,
                  areawastepriceid: inputData.areawastepriceid,
                  wasteprice: inputData.price,
                  wasteweight: inputData.amount,
                  recyclingwastestate: inputData.degree == 'normal' ? 0 : 1,
                  bookingtime: inputData.degree == 'normal' ? util.formatTime(new Date(new Date().getTime() + 2 * 24 * 3600 * 1000)) : util.formatTime(new Date(new Date().getTime() + 0.5 * 24 * 3600 * 1000)),
                  areamoreid: adcode

                },
                method: 'POST',
                header: app.globalData.header,
                success: function (res) {
                  if (res['data']['isSuccess'] == 'TRUE') {
                    wx.showToast({
                      title: res['data']['content'],
                      success: function () {
                        wx.navigateBack()
                      }
                    })
                  }
                  else {
                    wx.showModal({
                      title: '提示',
                      content: res['data']['content'],
                      showCancel: false,
                      confirmText: '重试',
                      confirmColor: '#ff0000'
                    })
                  }
                },
                fail: function (error) {
                  console.log(error)
                }
              })
            }

          } else {
            // 当前上门回收地址不属于属于当前所选区域
            // 1.获取当前上门回收地址的废品回收信息
            console.log('当前上门回收地址不属于属于当前所选区域')
            wx.request({
              url: 'https://www.dingdonhuishou.com/AHS/api/areawasteprice/list?areamoreid=' + adcode,
              method: 'POST',
              header: app.globalData.header,
              success: function (res) {

                // 2.判断当前上门回收地址所属区域是否在服务范围内
                if (res['data']['listwaste'].length == 0) {
                  // 2.1不在服务范围内
                  wx.showModal({
                    title: '提示',
                    content: '当前上门回收地址未查询到相关废品回收信息，点击确定修改地址，点击返回重新选择发单区域',
                    cancelText: '返回',
                    success: function (rt) {
                      if (rt.confirm) {
                        // 用户点击确定按钮，跳转到地址栏页面
                        wx.navigateTo({
                          url: '/pages/addressList/index',
                        })

                      } else {
                        // 用户点击取消，返回首页重新选择发单区域
                        wx.navigateBack()
                      }
                    }
                  })
                } else {
                  // 2.2在服务范围内
                  wx.showModal({
                    title: '提示',
                    content: '当前上门回收地址废品信息与当前发单区域废品信息不一致，将为您获取当前上门回收地址的废品回收信息',
                    showCancel: false,
                    success: function () {
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
                      wx.showModal({
                        title: '提示',
                        content: '获取当前上门回收地址的废品回收信息成功，继续发布吗？',
                        cancelText: '返回',
                        success: function(rt) {
                          if (rt.confirm) {
                            opt.adcode = adcode
                            s.setData({
                              optins: opt
                            })
                            s.bindReleaseTap()
                          }else {
                            opt.adcode = adcode
                            s.setData({
                              optins: opt
                            })
                          }
                        }
                      })                
                    }
                  })                  
                }
              },
              fail: function (error) {
                console.log(error)
              }
            })
          }
        }

      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  bindMinusTap: function (e) {
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
  bindPlusTap: function (e) {
    var inputData = this.data.inputData
    ++inputData.amount
    this.setData({
      inputData: inputData
    })
  },
  bindDateChange: function (e) {

    var timeSet = this.data.timeSet
    timeSet.date = e.detail.value
    this.setData({
      timeSet: timeSet
    })
  },
  bindTimeChange: function (e) {

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