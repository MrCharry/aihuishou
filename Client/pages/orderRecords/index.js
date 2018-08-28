// pages/orderRecords/index.js
var app = getApp()
var util = require('../../utils/util.js')
var i = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: {
      aColor: "#19c4aa"
    },
    operatableOrderList: [],
    operatabledOrderList: [],
    height: 0,
    scrollY: true,
    tag: 'operatable'
  },
  swipeCheckX: 35, //激活检测滑动的阈值
  swipeCheckState: 0, //0未激活 1激活
  maxMoveLeft: 75, //消息列表项最大左滑距离
  correctMoveLeft: 75, //显示菜单时的左滑距离
  thresholdMoveLeft: 40,//左滑阈值，超过则显示菜单
  lastShowId: '', //记录上次显示菜单的消息id
  moveX: 0,  //记录平移距离
  showState: 0, //0 未显示菜单 1显示菜单
  touchStartState: 0, // 开始触摸时的状态 0 未显示菜单 1 显示菜单
  swipeDirection: 0, //是否触发水平滑动 0:未触发 1:触发水平滑动 2:触发垂直滑动
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceInfo: app.globalData.deviceInfo
    })

    var msgList = []
    for (var i = 0; i < 30; i++) {
      var msg = {}
      msg.userName = '' + '用户' + (i + 1)
      msg.msgText = '内容'
      msg.idx = i + 1 + ''
      msgList.push(msg)
    }
    this.setData({
      msgList: msgList
    })
  },
  onShow: function() {
    var s = this
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
        s.getUserOperatableOrders(1, function (operatableOrderList) {
          console.log(operatableOrderList)
        })
        s.getUserOperatabledOrders(1, function(operatabledOrderList) {
          console.log(operatabledOrderList)
        })
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  getUserOperatableOrders: function (curPage, callback) {

    var operatableOrderList = this.data.operatableOrderList    
    var addressInfo = this.data.addressInfo
    var s = this
    // 获取当前用户所有可操作订单列表
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/userorder/get/operateringorders?page.currentPage='+curPage + '&lng='+addressInfo.lng + '&lat='+addressInfo.lat + '&lengthofnear=0',
      method: 'POST',
      header: app.globalData.header,
      success: function (res) {
        if (i > 1) {
          operatableOrderList.concat(res['data']['data'])
        } else {
          operatableOrderList = res['data']['data']
        }
        s.setData({
          operatableOrderList: operatableOrderList
        })
        if (res['data']['hasMore']) {
          s.getUserOperatableOrders(++i)
          return
        }
        if (typeof (callback) == 'function') {
          callback(operatableOrderList)
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  getUserOperatabledOrders: function(curPage, callback) {

    var operatabledOrderList = this.data.operatabledOrderList
    var addressInfo = this.data.addressInfo
    var s = this
    // 获取当前用户所有可操作订单列表
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/userorder/get/operateredorders?page.currentPage=' + curPage + '&lng=' + addressInfo.lng + '&lat=' + addressInfo.lat + '&lengthofnear=0',
      method: 'POST',
      header: app.globalData.header,
      success: function (res) {
        if (i > 1) {
          operatabledOrderList.concat(res['data']['data'])
        } else {
          operatabledOrderList = res['data']['data']
        }
        s.setData({
          operatabledOrderList: operatabledOrderList
        })
        if (res['data']['hasMore']) {
          s.getUserOperatabledOrders(++i)
          return
        }
        if (typeof (callback) == 'function') {
          callback(operatabledOrderList)
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  bindDelTap: function (e) {
    app.adjustCOpacity(this)
    var s = this
    var orderid = e.currentTarget.dataset.orderid
    wx.showModal({
      title: '通知',
      content: '确定取消订单吗？',
      success: function(rt) {
        if (rt.confirm) {
          // 取消订单操作
          wx.request({
            url: 'https://www.dingdonhuishou.com/AHS/api/userorder/cancel/order?id=' + orderid,
            method: 'POST',
            header: app.globalData.header,
            success: function(res) {
              if (res['data']['isSuccess'] == 'TRUE') {

                s.deleteItem(e)
                wx.showToast({
                  title: '订单已取消',
                  icon: 'none'
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
      }
    })
  },
  bindConfirmTap: function (e) {
    // 如果订单正在进行，该按钮不可操作
    if (tag == 'operatable') {
      return
    }
    // 订单已完成,确认收货
    app.adjustDOpacity(this)
    

  },
  bindContactTap: function(e) {
    app.adjustEOpacity(this)
  },
  clickOperatableOrder: function(e) {
    var view = this.data.view
    view.aColor = "#19c4aa"
    view.bColor = "#3e3e3e"
    app.adjustAOpacity(this)
    this.setData({
      view: view,
      tag: 'operatable'
    })
    
  },
  clickOperatabledOrder: function(e) {
    var view = this.data.view
    view.bColor = "#19c4aa"
    view.aColor = "#3e3e3e"
    app.adjustBOpacity(this)
    this.setData({
      view: view,
      tag: 'operatabled'
    })
  },
  ontouchstart: function (e) {
    
    if (this.showState === 1) {
      this.touchStartState = 1
      this.showState = 0
      this.moveX = 0
      this.translateXItem(this.lastShowId, 0, 200)
      this.lastShowId = ""
      return
    }
    this.firstTouchX = e.touches[0].clientX
    this.firstTouchY = e.touches[0].clientY
    if (this.firstTouchX > this.swipeCheckX) {
      this.swipeCheckState = 1
    }
    this.lastMoveTime = e.timeStamp
  },

  ontouchmove: function (e) {

    if (this.swipeCheckState === 0) {
      return
    }
    //当开始触摸时有菜单显示时，不处理滑动操作
    if (this.touchStartState === 1) {
      return
    }
    var moveX = e.touches[0].clientX - this.firstTouchX
    var moveY = e.touches[0].clientY - this.firstTouchY
    //已触发垂直滑动，由scroll-view处理滑动操作
    if (this.swipeDirection === 2) {
      return
    }
    //未触发滑动方向
    if (this.swipeDirection === 0) {
      console.log(Math.abs(moveY))
      //触发垂直操作
      if (Math.abs(moveY) > 4) {
        this.swipeDirection = 2

        return
      }
      //触发水平操作
      if (Math.abs(moveX) > 4) {
        this.swipeDirection = 1
        this.setData({ scrollY: false })
      }
      else {
        return
      }

    }
    //禁用垂直滚动
    // if (this.data.scrollY) {
    //   this.setData({scrollY:false})
    // }

    this.lastMoveTime = e.timeStamp
    //处理边界情况
    if (moveX > 0) {
      moveX = 0
    }
    //检测最大左滑距离
    if (moveX < -this.maxMoveLeft) {
      moveX = -this.maxMoveLeft
    }
    this.moveX = moveX
    this.translateXItem(e.currentTarget.id, moveX, 0)
  },
  ontouchend: function (e) {
    
    this.swipeCheckState = 0
    var swipeDirection = this.swipeDirection
    this.swipeDirection = 0
    if (this.touchStartState === 1) {
      this.touchStartState = 0
      this.setData({ scrollY: true })
      return
    }
    //垂直滚动，忽略
    if (swipeDirection !== 1) {
      return
    }
    if (this.moveX === 0) {
      this.showState = 0
      //不显示菜单状态下,激活垂直滚动
      this.setData({ scrollY: true })
      return
    }
    if (this.moveX === this.correctMoveLeft) {
      this.showState = 1
      this.lastShowId = e.currentTarget.id
      return
    }
    if (this.moveX < -this.thresholdMoveLeft) {
      this.moveX = -this.correctMoveLeft
      this.showState = 1
      this.lastShowId = e.currentTarget.id
    }
    else {
      this.moveX = 0
      this.showState = 0
      //不显示菜单,激活垂直滚动
      this.setData({ scrollY: true })
    }
    this.translateXItem(e.currentTarget.id, this.moveX, 500)
    //this.translateXItem(e.currentTarget.id, 0, 0)
  },
  getItemIndex: function (id) {
    var msgList = this.data.msgList
    for (var i = 0; i < msgList.length; i++) {
      if (msgList[i].idx === id) {
        return i
      }
    }
    return -1
  },
  deleteItem: function (e) {
    var animation = wx.createAnimation({ duration: 200 })
    animation.height(0).opacity(0).step()
    this.animationWrapItem(e.currentTarget.id, animation)
    var s = this
    setTimeout(function () {
      var index = s.getItemIndex(e.currentTarget.id)
      s.data.msgList.splice(index, 1)
      s.setData({ msgList: s.data.msgList })
    }, 200)
    this.showState = 0
    this.setData({ scrollY: true })
  },
  // markItem: function (e) {
  //   var ary = this.data.msgList
  //   var index = this.getItemIndex(e.currentTarget.id)
  //   var s = this
  //   ary.unshift(ary[index])
  //   ary.splice(index + 1, 1)
  //   this.setData({ msgList: ary })
  //   setTimeout(function () {
  //     var animation = wx.createAnimation({ duration: 200 })
  //     animation.height(0).opacity(0).step()
  //     s.translateXItem(e.currentTarget.id, 0, 200)
  //   }, 200)
  //   this.showState = 0
  // },
  translateXItem: function (id, x, duration) {
    var animation = wx.createAnimation({ duration: duration })
    animation.translateX(x).step()
    this.animationItem(id, animation)
  },
  animationItem: function (id, animation) {
    var index = this.getItemIndex(id)
    var param = {}
    var indexString = 'msgList[' + index + '].animation'
    param[indexString] = animation.export()
    this.setData(param)
  },
  animationWrapItem: function (id, animation) {
    var index = this.getItemIndex(id)
    var param = {}
    var indexString = 'msgList[' + index + '].wrapAnimation'
    param[indexString] = animation.export()
    this.setData(param)
  },
})