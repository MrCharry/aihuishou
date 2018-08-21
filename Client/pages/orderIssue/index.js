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
    inputData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceInfo: app.globalData.deviceInfo,
      userInfo: app.globalData.userInfo,
      price: 'A级类回收价格: 0.8元',
      aBorderStyle: '2px solid orange'
    })
  },
  bindImageTap: function (e) {

    let borderStyle = '2px solid orange'

    var id = e.currentTarget.id
    if (id == '1') {
      this.setData({
        price: 'A级类回收价格: 0.8元',
        aBorderStyle: borderStyle,
        bBorderStyle: '',
        cBorderStyle: ''
      })
    } else if (id == '2') {
      this.setData({
        price: 'B级类回收价格: 0.7元',
        bBorderStyle: borderStyle,
        aBorderStyle: '',
        cBorderStyle: ''
      })
    } else if (id == '3') {
      this.setData({
        price: '低级类回收价格: 0.5元',
        cBorderStyle: borderStyle,
        aBorderStyle: '',
        bBorderStyle: ''
      })
    }
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
    console.log(inputData)
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