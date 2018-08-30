// pages/modifyAddress/index.js
var app = getApp()
var i = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: {},
    addressList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceInfo: app.globalData.deviceInfo,
      defaultIcon: '/Resources/images/checked.png',
      icon: '/Resources/images/check.png'
    })
  },
  onShow: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    var s = this
    // 获取用户地址列表
    this.getAddressList(1, function(addressList) {
      console.log(addressList)
      // 设置默认图标
      for (var i = 0; i < addressList.length; ++i) {
        if (addressList[i].first == 1) {
          var temp = addressList[i]
          addressList[i] = addressList[0]
          addressList[0] = temp
        }
      }
      app.globalData.addressList = addressList
      s.setData({
        addressList: addressList
      })
    })
  },
  bindEditTap: function (e) {
    
    var index = e.currentTarget.id
    var addressid = this.data.addressList[index].id
    wx.navigateTo({
      url: '/pages/addressList/editAddress/index?tag=edit&id=' + addressid,
      success: function () {
        wx.setNavigationBarTitle({
          title: '编辑收货地址',
        })
      }
    })
  },
  bindAddAddress: function (e) {
    // app.adjustBOpacity(this)
    wx.navigateTo({
      url: '/pages/addressList/editAddress/index?tag=add',
      success: function () {
        wx.setNavigationBarTitle({
          title: '添加收货地址',
        })
      }
    })
  },
  getAddressList: function (curPage, callback) {
    var s = this
    var addressList = this.data.addressList
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHSTest/api/useraddress/list?page.currentPage=' + curPage,
      method: 'POST',
      header: app.globalData.header,
      success: function (res) {

        if (i > 1) {
          addressList.concat(res['data']['data'])
        }else {
          addressList = res['data']['data']
        }
       
        s.setData({
          addressList: addressList
        })

        if (res['data']['hasMore'] == true) {
          //有下一页
          s.getAddressList(++i)
          return
        }
        if (typeof(callback) == 'function') {
          callback(addressList)
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  bindSetDefaultAddress: function (e) {
    var index = e.currentTarget.id
    var addressid = this.data.addressList[index].id
    var s = this
    // 用户设置默认地址    
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHSTest/api/useraddress/setdefault?id=' + addressid,
      method: 'POST',
      header: app.globalData.header,
      success: function (res) {

        if (res['data']['isSuccess'] == 'TRUE') {
          s.getAddressList(1)
          wx.showToast({
            title: '默认地址已设置'
          })
        } else {
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
})