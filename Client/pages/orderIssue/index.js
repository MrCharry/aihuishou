// pages/orderIssue/index.js
var app = getApp()
var wxMarkerData = []
var bmap = require('../../utils/bmap-wx.js')
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
      amount: 0
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
        s.setData({
          wasteinfo: wasteinfo,
          wastetypeinfo: wastetypeinfo,
          imgWidth: imgWidth
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
    this.setData({
      borderStyle: borderStyle,
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
    console.log(e.detail)
    var inputData = this.data.inputData
    inputData.degree = e.detail.value
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
  bindConfirmTap: function(e) {
    app.adjustBOpacity(this)
    var inputData = this.data.inputData
    inputData.degree = inputData.degree==undefined ? 'normal':inputData.degree
    var s = this
    console.log(inputData)
    if (inputData.amount == undefined) {
      wx.showModal({
        title: '提示',
        content: '请先设置预计发布的斤数，谢谢！',
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
  }
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