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
    items: [
      { name: 'normal', value: '一般', checked: 'true'},
      { name: 'emergency', value: '加急'},
      { name: 'book', value: '预约' }
    ],
    view: {},
    inputData: {
      amount: 0,
      degree: 'normal'
    },
    borderStyle:[
      '2px solid orange'
    ],
    idx: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var adcode = options['adcode']
    var s = this
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/areawasteprice/list?areamoreid=' + adcode,
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        console.log(res)
        var wasteinfo = res['data']['listwaste'][0]['listwastesub']
        var wastetypeinfo = res['data']['listwaste'][0]['wastetypeinfo'].split('<p>').join('').split('</p>').join('')
        var imgWidth = (app.globalData.deviceInfo.windowWidth - 30) / wasteinfo.length - 10
        for (var i=0; i<wasteinfo.length; ++i) {
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
      deviceInfo: app.globalData.deviceInfo,
      userInfo: app.globalData.userInfo
    })
  },
  onShow: function() {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  bindImageTap: function (e) {

    var id = e.currentTarget.id
    var wasteinfo = this.data.wasteinfo
    var borderStyle = this.data.borderStyle
    var inputData = this.data.inputData

    for (var i=0; i<wasteinfo.length; ++i) {
      if (i == id) {
        borderStyle[i] = '2px solid orange'
        this.setData({
          idx: i
        })
      }else {
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
        title: '即日起七天内可接受预约,时间为9:00-18:00',
        icon: 'none',
        duration: 2000
      })
      var datetime = util.formatTime(new Date())
      var startDate = datetime.split(' ')[0].split('/').join('-')
      var time = datetime.split(' ')[1].slice(0, 5) 
      var endDate = util.formatTime( new Date( new Date().getTime() + 7*24*3600*1000 ) ).split(' ')[0].split('/').join('-')
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
      url: '/pages/modifyAddress/index',
      success: function() {
        wx.setNavigationBarTitle({
          title: '收货地址',
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
    }
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