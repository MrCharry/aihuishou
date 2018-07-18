var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: {
      editNickname: false
    },
    genderPic: '/Resources/images/check.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var userInfo = app.globalData.userInfo
    if (userInfo.address.length > 20) {
      userInfo.address = userInfo.address.slice(0,20) + '...'
    }
    this.setData({
      userInfo: userInfo,
      defaultGenderPic: '/Resources/images/check.png',
      selectedGenderPic: '/Resources/images/checked.png'
    })
  },
  choosePhoto: function(e) {
    var s = this
    var userInfo = s.data.userInfo
    app.adjustAOpacity(this)
    wx.chooseImage({
      count: 1,
      success: function(res) {
        userInfo.portrait = res.tempFilePaths[0]
        s.setData({
          userInfo: userInfo
        })
      },
    })
  },
  clickGender: function(e) {
    var gender = parseInt(e.currentTarget.dataset.gender)
    var userInfo = app.globalData.userInfo
    var self = this
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHSTest/api/user/modify/sex',
      data: {
        sex: gender
      },
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        if (res['data']['isSuccess'] == 'TRUE') {
          console.log(res['data'])
          userInfo.sex = gender
          self.setData({
            userInfo: userInfo
          })          
          app.setStorageSync('userInfo', userInfo)

        }else {
          console.log(res['data']['content'])
        }
      }
    })

  },
  clickModifyName: function(e) {
    var view = this.data.view
    view.editNickname = !view.editNickname
    this.setData({
      view: view
    })
  },
  editNicknameDone: function(e) {
    console.log(e.detail)
    var userInfo = this.data.userInfo
    var view = this.data.view
    view.editNickname = !view.editNickname
    userInfo.nickname = e.detail.value
    this.setData({
      userInfo: userInfo,
      view: view
    })
  },
  bindPhone: function(e) {
    app.adjustBOpacity(this)
    wx.navigateTo({
      url: '/pages/modifyPhone/index',
      success: function() {
        wx.setNavigationBarTitle({
          title: '修改电话号码',
        })
      }
    })
  },
  bindBankcard: function(e) {
    app.adjustCOpacity(this)
    wx.navigateTo({
      url: '/pages/bankcard/index',
      success: function () {
        wx.setNavigationBarTitle({
          title: '提现绑定',
        })
      }
    })
  },
  modifyAddress: function(e) {
    app.adjustDOpacity(this)
    wx.navigateTo({
      url: '/pages/modifyAddress/index',
      success: function () {
        wx.setNavigationBarTitle({
          title: '收货地址',
        })
      }
    })
  }
})