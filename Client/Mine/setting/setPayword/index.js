// Mine/setting/setPayword/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: {},
     // 输入框参数设置
    inputData: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: true,//是否有下一步的按钮
      get_focus: true,//输入框的聚焦状态
      focus_class: true,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "80rpx",//输入框高度
      width: '500rpx',//输入框宽度
      see: true,//是否明文展示
      interval: false,//是否显示间隔格子
    }
  },
  // 当组件输入数字6位数时的自定义函数
  valueSix(data) {
    console.log("1");
    // 模态交互效果
    // wx.showToast({
    //   title: '支付成功',
    //   icon: 'success',
    //   duration: 2000
    // })
    console.log(data)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceInfo: app.globalData.deviceInfo
    })
  },
  getVerifiedCode: function(e) {
    app.adjustAOpacity(this)
  },
  formSubmit: function(e) {
    console.log(e.detail.value)
    app.adjustBOpacity(this)
  }
})