// Mine/wallets/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceInfo: {},
    showModal: false,
    inputData: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: true,//是否有下一步的按钮
      get_focus: true,//输入框的聚焦状态
      focus_class: true,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "70rpx",//输入框高度
      width: '420rpx',//输入框宽度
      see: false,//是否明文展示
      interval: true,//是否显示间隔格子
    }
  },
  // 待用数据
  paymethod: 0,
  animationData: wx.createAnimation({
    duration: 1000, // 默认为400     动画持续时间，单位ms
    timingFunction: 'ease-in-out',
  }),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceInfo: app.globalData.deviceInfo,
      userInfo: app.globalData.userInfo
    })
  },
  bindWithdrowTap: function(e) {
    var s = this
    wx.showActionSheet({
      itemList: [
        '提现到微信',
        '提现到银行卡'        
      ],
      success: function(res) {
        
        s.paymethod = res.tapIndex
        s.setData({
          showModal: true,
          focus: true
        })
      }
    })
  },
  bindCloseTap: function(e) {
    this.setData({
      showModal: false,
      showPasswordModal: false
    })
  },
  bindInput: function(e) {

    var bill = parseFloat(e.detail.value)
    this.setData({
      bill: bill.toFixed(2)
    })
  },
  bindWithdrowMoney: function(e) {
    let userInfo = this.data.userInfo
    if (userInfo.paypassword == '') {
      wx.showModal({
        title: '提示',
        content: '请先设置支付密码',
        success: function(rt) {
          if (rt.confirm) {
            wx.navigateTo({
              url: '/Mine/setting/paypassword/index'
            })
          }
        }
      })
      return
    }
    var s = this
    if (s.data.bill > userInfo.balance) {
      wx.showToast({
        title: '超过可提现额度',
        icon: 'none',
        success: function() {
          s.setData({
            focus: true
          })
        }
      })
      return
    }
    if (s.data.bill == 0) {
      wx.showToast({
        title: '请输入大于1元的金额',
        icon: 'none',
        success: function () {
          s.setData({
            focus: true
          })
        }
      })
      return
    }
    var paylogo = ''
    if (s.paymethod == 0) {
      paylogo = 'https://lg-gwh53phk-1252040173.cos.ap-shanghai.myqcloud.com/weixin.png'
    }else if (s.paymethod == 1) {
      paylogo = 'https://lg-gwh53phk-1252040173.cos.ap-shanghai.myqcloud.com/card.png'
    }
    s.setData({
      paylogo: paylogo
    })    
    // 支付动画效果
    s.setData({
      showPaylogoModal: true,
      showModal: false,
    })

    s.animationData.translateX(75).step({ duration: 1000 }).translateX(0).step({ duration: 1000 })
    s.setData({
      // 导出动画示例
      animationData: s.animationData.export()
    })
    setTimeout(function() {
      s.setData({
        showPaylogoModal: false,        
        showPasswordModal: true,
        animationData: null
      })
    }, 2100)
  },
  // 当组件输入数字6位数时的自定义函数
  valueSix(e) {
    var s = this
    let password = e.detail
    let bill = this.data.bill
    let paymethod = this.paymethod
    console.log(paymethod, bill, password)

    var s = this
    // var paylogo = ''
    // if (paymethod == 0) {
    //   paylogo = 'https://lg-gwh53phk-1252040173.cos.ap-shanghai.myqcloud.com/weixin.png'
    // } else if (paymethod == 1) {
    //   paylogo = 'https://lg-gwh53phk-1252040173.cos.ap-shanghai.myqcloud.com/card.png'
    // }
    // s.setData({
    //   paylogo: paylogo
    // })
    // 支付动画效果

    s.setData({
      showPaylogoModal: true,
    })

    s.animationData.translateX(75).step({ duration: 1000 }).translateX(0).step({ duration: 1000 })
    s.setData({
      // 导出动画示例
      animationData: s.animationData.export()
    })
    setTimeout(function () {
      s.setData({
        showPaylogoModal: false,
        animationData: null
      })
      // 进行提现操作
      wx.request({
        url: 'https://www.dingdonhuishou.com/AHS/api/user/withdrawcash?pay=' + bill + '&paymethod=' + paymethod + '&paypassword=' + password,
        method: 'POST',
        header: app.globalData.header,
        success: function (res) {
          if (res['data']['content'] == 'TRUE') {
            wx.showToast({
              title: res['data']['content'],
              icon: 'none',
              success: function () {
                wx.navigateBack()
              }
            })

          } else {
            wx.showModal({
              title: '提示',
              content: res['data']['content'],
              showCancel: false,
              confirmText: '返回',
              confirmColor: '#ff0000',
              success: function () {
                s.setData({
                  showPasswordModal: false
                })
              }
            })
          }
        },
        fail: function (error) {
          console.log(error)
        }
      })
    }, 2100)
  },
  bindContactTap: function(e) {
    wx.makePhoneCall({
      phoneNumber: '18688958966'
    })
  }
})