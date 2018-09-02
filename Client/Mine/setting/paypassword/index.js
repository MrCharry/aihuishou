// Mine/setting/setPayword/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: {},
    inputData: {},
     // 输入框参数设置
    inputDatas: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: true,//是否有下一步的按钮
      get_focus: true,//输入框的聚焦状态
      focus_class: true,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "80rpx",//输入框高度
      width: '500rpx',//输入框宽度
      see: false,//是否明文展示
      interval: false,//是否显示间隔格子
    }
  },
// 本页面所用数据
password: '',
confirmpassword: '',
code: '',

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      deviceInfo: app.globalData.deviceInfo
    })
  },
  // 当组件输入数字6位数时的自定义函数
  valueSix(e) {
    console.log(e.detail)
    if (e.currentTarget.id == 'password') {
      this.password = e.detail
    }else if (e.currentTarget.id == 'confirmpassword') {
      this.confirmpassword = e.detail
    }
  },  
  bindInputTap: function(e) {
    this.code = e.detail.value
  },
  getVerifiedCode: function(e) {
    var inputData = this.data.inputData
    inputData.phonenum = app.globalData.userInfo.phonenum
    this.setData({
      inputData: inputData
    })
    app.getVerifiedCode(this)
  },
  bindConfirmTap: function(e) {

    if (this.password != this.confirmpassword) {
      wx.showToast({
        title: '两次输入密码不一致！',
        icon: 'none'
      })
      return
    }
    if (this.code == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      this.setData({
        focus: true
      })
      return   
    }
    var s = this
    let password = s.password
    let code = s.code
    console.log(password, s.confirmpassword, code)
    //进行修改支付密码操作
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/user/modify/paypassword?paypassword='+password + '&code='+code,
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        if (res['data']['isSuccess'] == 'TRUE') {
          wx.showToast({
            title: res['data']['content'],
            icon: 'none',
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
  }
})