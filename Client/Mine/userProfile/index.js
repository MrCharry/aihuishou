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
  
    this.setData({
      userInfo: app.globalData.userInfo,
      addressInfo: app.globalData.addressInfo,
      defaultGenderPic: '/Resources/images/check.png',
      selectedGenderPic: '/Resources/images/checked.png'
    })
  },
  onShow: function() {

    var addressInfo = app.globalData.addressInfo
    var userInfo = app.globalData.userInfo
    var simpleAddress = ''
    this.setData({
      phoneNumber: userInfo.phonenum.slice(0, 3) + '****' + userInfo.phonenum.slice(7, 11)
    })

    if (addressInfo == '') {
      
      if (userInfo.address.length + userInfo.detailaddress.length + 1 > 20) {
       
        simpleAddress = (userInfo.address + '-' + userInfo.detailaddress).slice(0, 20) + '...'

      }else {
        simpleAddress = userInfo.address + '-' + userInfo.detailaddress
      }
    } else {
      if (addressInfo.address.length + addressInfo.detailaddress.length + 1 > 20) {

        simpleAddress = (addressInfo.address + '-' + addressInfo.detailaddress).slice(0, 20) + '...'

      } else {
        simpleAddress = addressInfo.address + '-' + addressInfo.detailaddress
      }
    }
    this.setData({
      simpleAddress: simpleAddress
    })
  },
  bindUpdatePortrait: function(e) {
    var s = this
    var userInfo = s.data.userInfo
    var sessionid = app.getStorageSync('sessionid')

    app.adjustAOpacity(this)

    wx.chooseImage({
      count: 1,
      success: function(res) {
        var tempPath = res.tempFilePaths[0]
        wx.uploadFile({
          url: 'https://www.dingdonhuishou.com/AHS/api/user/picture',
          filePath: tempPath,
          name: 'fileUpload',
          header: {
            'content-type': 'multipart/form-data',
            'Cookie': sessionid
          },
          success: function(res) {
            
            var result = JSON.parse(res['data'])
            console.log(result)
            if (result['isSuccess'] == 'TRUE') {
              userInfo.imgpath = tempPath
              s.setData({
                userInfo: userInfo
              })
              app.globalData.userInfo = userInfo
              wx.showModal({
                title: '提示',
                content: result['content'],
                showCancel: false
              })
            }else {
              wx.showModal({
                title: '提示',
                content: result['content'],
                showCancel: false,
                confirmText: '重试',
                confirmColor: '#ff0000'
              })
            }
          }
        })
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },
  clickGender: function(e) {
    var gender = parseInt(e.currentTarget.id)
    var userInfo = app.globalData.userInfo
    var self = this
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/user/modify/sex',
      data: {
        sex: gender
      },
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {
        if (res['data']['isSuccess'] == 'TRUE') {
          
          userInfo.sex = gender
          self.setData({
            userInfo: userInfo
          })
          app.globalData.userInfo = userInfo
          wx.showModal({
            title: '提示',
            content: res['data']['content'],
            showCancel: false
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
    var s = this
    view.editNickname = !view.editNickname
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/user/modify/nickname',
      data: {
        nickname: e.detail.value
      },
      method: 'POST',
      header: app.globalData.header,
      success: function(res) {

        if (res['data']['isSuccess'] == 'TRUE') {
          userInfo.nickname = e.detail.value
          s.setData({
            userInfo: userInfo
          })
          app.globalData.userInfo = userInfo
          wx.showModal({
            title: '提示',
            content: res['data']['content'],
            showCancel: false
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
        s.setData({
          view: view
        })
      },
      fail: function(error) {
        console.log(error)
      }
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
  bindAccountTap: function(e) {
    app.adjustCOpacity(this)
    wx.navigateTo({
      url: '/pages/bindAccountList/index',
      success: function () {
        wx.setNavigationBarTitle({
          title: '提现绑定',
        })
      }
    })
  },
  bindAddressList: function(e) {
    app.adjustDOpacity(this)
    wx.navigateTo({
      url: '/pages/addressList/index',
      success: function () {
        wx.setNavigationBarTitle({
          title: '收货地址列表',
        })
      }
    })
  }
})