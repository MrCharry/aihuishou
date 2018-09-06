// pages/orderRecords/index.js
var app = getApp()
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: {
      aColor: "#19c4aa"
    },
    height: 0,
    scrollY: true,
    tag: 'operatable'
  },
  count1: 1,
  count2: 1,
  operatableOrderList: [],
  operatabledOrderList: [],
  waitForComment: [],
  // swipeCheckX: 35, //激活检测滑动的阈值
  // swipeCheckState: 0, //0未激活 1激活
  // maxMoveLeft: 80, //消息列表项最大左滑距离
  // correctMoveLeft: 80, //显示菜单时的左滑距离
  // thresholdMoveLeft: 50, //左滑阈值，超过则显示菜单
  // lastShowId: '', //记录上次显示菜单的消息id
  // moveX: 0, //记录平移距离
  // showState: 0, //0 未显示菜单 1显示菜单
  // touchStartState: 0, // 开始触摸时的状态 0 未显示菜单 1 显示菜单
  // swipeDirection: 0, //是否触发水平滑动 0:未触发 1:触发水平滑动 2:触发垂直滑动

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取当前默认上门回收地址
    var s = this
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/useraddress/getdefault',
      method: 'POST',
      header: app.globalData.header,
      success: function (res) {

        if (res['data']['isSuccess'] == 'TRUE') {
          s.addressInfo = res['data']['data']
          wx.startPullDownRefresh()
        } else {
          console.log(res['data']['content'])
          wx.showModal({
            title: '提示',
            content: '请先设置默认收货地址',
            showCancel: false,
            confirmText: '去设置',
            success: function () {
              wx.navigateTo({
                url: '/pages/addressList/index'
              })
            }
          })
          return
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
    this.setData({
      deviceInfo: app.globalData.deviceInfo
    })
  },
  onShow: function() {
    if (this.addressInfo) {
      wx.startPullDownRefresh()
    }
  },
  getUserOperatableOrders: function (curPage, callback) {

    var s = this
    var addressInfo = s.addressInfo

    // 获取当前用户所有未完成订单列表
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/userorder/get/operateringorders?page.currentPage=' + curPage + '&page.pageNumber=5' + '&lng=' + addressInfo.lng + '&lat=' + addressInfo.lat + '&lengthofnear=0',
      method: 'POST',
      header: app.globalData.header,
      success: function (res) {

        if (res['data']['hasMore']) {
          s.observer1 = true
          ++s.count1
        }
        if (typeof (callback) == 'function') {
          callback(res['data']['data'])
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  getUserOperatabledOrders: function (curPage, callback) {

    var s = this
    var addressInfo = s.addressInfo

    // 获取当前用户所有未完成订单列表
    wx.request({
      url: 'https://www.dingdonhuishou.com/AHS/api/userorder/get/operateredorders?page.currentPage=' + curPage + '&page.pageNumber=5' + '&lng=' + addressInfo.lng + '&lat=' + addressInfo.lat + '&lengthofnear=0',
      method: 'POST',
      header: app.globalData.header,
      success: function (res) {

        // if (n > 1) {
        //   s.operatabledOrderList.concat(res['data']['data'])
        // } else {
        //   s.operatabledOrderList = res['data']['data']
        // }

        if (res['data']['hasMore']) {
          ++s.count2
          s.observer2 = true
          // s.getUserOperatabledOrders(++n)
          // return
        }
        if (typeof (callback) == 'function') {
          // callback(s.operatabledOrderList)
          callback(res['data']['data'])
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
      success: function (rt) {
        if (rt.confirm) {
          // 取消订单操作
          wx.request({
            url: 'https://www.dingdonhuishou.com/AHS/api/userorder/cancel/order?id=' + orderid,
            method: 'POST',
            header: app.globalData.header,
            success: function (res) {
              if (res['data']['isSuccess'] == 'TRUE') {

                s.deleteItem(e)
                wx.showToast({
                  title: '订单已取消',
                  icon: 'none'
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
      }
    })
  },
  bindConfirmTap: function (e) {

    let index = parseInt(e.currentTarget.id)
    let list = this.data.tag == 'operatable' ? this.data.operatableOrderList : this.data.operatabledOrderList
    let btnText = list[index].btnText
    let desc = list[index].desc
    var s = this
    console.log(btnText, desc)

    if (btnText != '确认收款' && btnText != '待评论') {
      wx.showToast({
        title: desc,
        icon: 'none'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: desc,
        success: function (rt) {

          if (btnText == '确认收款') {
            list[index].btnText = '待评论'
            s.waitForComment.push(list[index].id)
            wx.setStorageSync('waitForComment' + app.globalData.userInfo.id, s.waitForComment)
            s.setData({
              operatableOrderList: list
            })
          }

          if (rt.confirm) {
            let order = list[index]
            console.log(order)
            // 进行评论订单操作
            wx.navigateTo({
              url: '/pages/orderComment/index?inpayid=' + order.inpayid + '&orderid=' + order.id + '&operatertime=' + order.operatertime + '&wasteprice=' + order.wasteprice + '&wastename=' + order.wastename + '&wasteweight=' + order.wasteweight + '&pay=' + order.pay,
            })
          }
        }
      })
    }
  },
  bindContactTap: function (e) {
    let index = e.currentTarget.id
    let phonenum = this.data.operatableOrderList[index].phonenum
    wx.makePhoneCall({
      phoneNumber: phonenum
    })
  },
  clickOperatableOrder: function (e) {
    var view = this.data.view
    view.aColor = "#19c4aa"
    view.bColor = "#3e3e3e"
    app.adjustAOpacity(this)
    this.setData({
      view: view,
      tag: 'operatable'
    })
    wx.startPullDownRefresh()

  },
  clickOperatabledOrder: function (e) {
    var view = this.data.view
    view.bColor = "#19c4aa"
    view.aColor = "#3e3e3e"
    app.adjustBOpacity(this)
    this.setData({
      view: view,
      tag: 'operatabled'
    })
    wx.startPullDownRefresh()
  },
  onReachBottom: function (e) {
    var s = this
    if (s.data.tag == 'operatable') {
      // 未完成订单
      console('刷新未完成订单', s.count1, s.observer1)
      if (s.observer1) {
        s.observer1 = false
        // 获取未完成订单
        s.getUserOperatableOrders(s.count1, function (operatableOrderList) {
          s.waitForComment = wx.getStorageSync('waitForComment' + app.globalData.userInfo.id) ? wx.getStorageSync('waitForComment') : []
          console.log('waitForComment', s.waitForComment)
          s.solveOperatableList(operatableOrderList)

        })
      }
    } else {
      // 已完成订单
      console.log('刷新已完成订单', s.count2, s.observer2)
      if (s.observer2) {
        s.observer2 = false
        s.getUserOperatabledOrders(s.count2, function (list) {
          s.solveOperatabledList(list)
        })
      }
    }
  },
  onPullDownRefresh: function (e) {

    wx.showNavigationBarLoading()

    var s = this
    if (s.data.tag == 'operatable') {
      s.count1 = 1
      s.observer1 = false
      // 获取未完成订单
      s.getUserOperatableOrders(1, function (operatableOrderList) {
        s.waitForComment = wx.getStorageSync('waitForComment' + app.globalData.userInfo.id) ? wx.getStorageSync('waitForComment') : []
        console.log('waitForComment', s.waitForComment)
        s.solveOperatableList(operatableOrderList)
      })
    } else {
      s.count2 = 1
      s.observer2 = false
      // 已完成订单
      s.getUserOperatabledOrders(1, function (operatabledOrderList) {
        s.solveOperatabledList(operatabledOrderList)
      })
    }
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },
  solveOperatableList: function (list) {
    var s = this
    for (var i = 0; i < list.length; ++i) {
      // list[i].idx = i + ''
      list[i].createtime = util.formatTime(new Date(list[i].createtime))
      // 判断订单类型
      switch (list[i].recyclingwastestate) {
        case 0: //普通订单
          list[i].icon = '/Resources/images/orderIcon.png'
          break
        case 1: //加急订单
          list[i].icon = '/Resources/images/urgency.png'
          break
        case 2: // 预约订单
          list[i].icon = '/Resources/images/booking.png'
      }
      // 判断可订单状态
      switch (list[i].state) {
        case 1: //用户主动预约商户              
        case 2: //用户主动发布上门回收的请求                
          list[i].btnText = '待接单'
          list[i].desc = '等待商户接单...'
          list[i].finished = false
          list[i].bdcolor = '#2dbea7'
          break
        case 4: //商户抢占用户发布上门回收的请求                
        case 8: //商户接收用户的预约                
          list[i].btnText = '待收货'
          list[i].desc = '您的订单已被接受，请耐心等候商户上门回收！'
          list[i].finished = false
          list[i].bdcolor = '#2dbea7'
          break
        case 32: //商户支付用户费用
          for (var j = 0; j < s.waitForComment.length; ++j) {
            if (list[i].id == s.waitForComment[j]) {
              list[i].btnText = '待评论'
              list[i].finished = true
              list[i].bdcolor = '#2dbea7'
              break
            }
          }
          if (j == s.waitForComment.length) {
            list[i].btnText = '确认收款'
            list[i].finished = false
            list[i].bdcolor = '#2dbea7'
          }
          list[i].desc = '订单已完成，立即评论吗？'
      }
      // s.operatableOrderList.push(list[i])
    }
    if (s.operatableOrderList.length == 0) {
      s.operatableOrderList = list
    } else {
      app.uniqueArr(s.operatableOrderList, list)
    }

    s.setData({
      operatableOrderList: s.operatableOrderList
    })
  },
  solveOperatabledList: function (list) {

    var s = this
    for (var i = 0; i < list.length; ++i) {

      list[i].createtime = util.formatTime(new Date(list[i].createtime))
      // 判断订单类型
      switch (list[i].recyclingwastestate) {
        case 0: //普通订单
          list[i].icon = '/Resources/images/orderIcon.png'
          break
        case 1: //加急订单
          list[i].icon = '/Resources/images/urgency.png'
          break
        case 2: // 预约订单
          list[i].icon = '/Resources/images/booking.png'
      }
      // 判断已完成订单状态
      list[i].finished = true
      switch (list[i].state) {
        case 16: //商户拒绝用户的预约

          list[i].btnText = '已取消'
          list[i].desc = '原因：暂未有商家接受订单！'
          break
        case 64: // 用户取消订单

          list[i].btnText = '已取消'
          list[i].desc = '原因：用户取消订单！'
          break
        case 128: // 商户取消订单

          list[i].btnText = '已取消'
          list[i].desc = '原因：商家取消订单！'
          break
        case 256: //用户评论订单

          list[i].btnText = '已完成'
          list[i].desc = '当前订单已完成！'
      }
      // s.operatabledOrderList.push(list[i])
    }
    if (s.operatabledOrderList.length == 0) {
      s.operatabledOrderList = list
    } else {
      app.uniqueArr(s.operatabledOrderList, list)
    }
    s.setData({
      operatabledOrderList: s.operatabledOrderList
    })
  }
  // ontouchstart: function(e) {

  //   if (this.showState === 1) {
  //     this.touchStartState = 1
  //     this.showState = 0
  //     this.moveX = 0
  //     this.translateXItem(this.lastShowId, 0, 200)
  //     this.lastShowId = ""
  //     return
  //   }
  //   this.firstTouchX = e.touches[0].clientX
  //   this.firstTouchY = e.touches[0].clientY
  //   if (this.firstTouchX > this.swipeCheckX) {
  //     this.swipeCheckState = 1
  //   }
  //   this.lastMoveTime = e.timeStamp
  // },

  // ontouchmove: function(e) {

  //   if (this.swipeCheckState === 0) {
  //     return
  //   }
  //   //当开始触摸时有菜单显示时，不处理滑动操作
  //   if (this.touchStartState === 1) {
  //     return
  //   }
  //   var moveX = e.touches[0].clientX - this.firstTouchX
  //   var moveY = e.touches[0].clientY - this.firstTouchY
  //   //已触发垂直滑动，由scroll-view处理滑动操作
  //   if (this.swipeDirection === 2) {
  //     return
  //   }
  //   //未触发滑动方向
  //   if (this.swipeDirection === 0) {
  //     console.log(Math.abs(moveY))
  //     //触发垂直操作
  //     if (Math.abs(moveY) > 4) {
  //       this.swipeDirection = 2

  //       return
  //     }
  //     //触发水平操作
  //     if (Math.abs(moveX) > 4) {
  //       this.swipeDirection = 1
  //       this.setData({
  //         scrollY: false
  //       })
  //     } else {
  //       return
  //     }

  //   }
  //   //禁用垂直滚动
  //   // if (this.data.scrollY) {
  //   //   this.setData({scrollY:false})
  //   // }

  //   this.lastMoveTime = e.timeStamp
  //   //处理边界情况
  //   if (moveX > 0) {
  //     moveX = 0
  //   }
  //   //检测最大左滑距离
  //   if (moveX < -this.maxMoveLeft) {
  //     moveX = -this.maxMoveLeft
  //   }
  //   this.moveX = moveX
  //   this.translateXItem(e.currentTarget.id, moveX, 0)
  // },
  // ontouchend: function(e) {

  //   this.swipeCheckState = 0
  //   var swipeDirection = this.swipeDirection
  //   this.swipeDirection = 0
  //   if (this.touchStartState === 1) {
  //     this.touchStartState = 0
  //     this.setData({
  //       scrollY: true
  //     })
  //     return
  //   }
  //   //垂直滚动，忽略
  //   if (swipeDirection !== 1) {
  //     return
  //   }
  //   if (this.moveX === 0) {
  //     this.showState = 0
  //     //不显示菜单状态下,激活垂直滚动
  //     this.setData({
  //       scrollY: true
  //     })
  //     return
  //   }
  //   if (this.moveX === this.correctMoveLeft) {
  //     this.showState = 1
  //     this.lastShowId = e.currentTarget.id
  //     return
  //   }
  //   if (this.moveX < -this.thresholdMoveLeft) {
  //     this.moveX = -this.correctMoveLeft
  //     this.showState = 1
  //     this.lastShowId = e.currentTarget.id
  //   } else {
  //     this.moveX = 0
  //     this.showState = 0
  //     //不显示菜单,激活垂直滚动
  //     this.setData({
  //       scrollY: true
  //     })
  //   }
  //   this.translateXItem(e.currentTarget.id, this.moveX, 500)
  //   //this.translateXItem(e.currentTarget.id, 0, 0)
  // },
  // getItemIndex: function(id) {
  //   var list = this.data.tag == 'operatable' ? this.data.operatableOrderList : this.data.operatabledOrderList
  //   for (var i = 0; i < list.length; i++) {
  //     if (list[i].idx === id) {
  //       return i
  //     }
  //   }
  //   return -1
  // },
  // deleteItem: function(e) {
  //   var animation = wx.createAnimation({
  //     duration: 200
  //   })
  //   animation.height(0).opacity(0).step()
  //   this.animationWrapItem(e.currentTarget.id, animation)
  //   var s = this
  //   setTimeout(function() {
  //     var index = s.getItemIndex(e.currentTarget.id)
  //     var list = s.data.tag == 'operatable' ? s.data.operatableOrderList : s.data.operatabledOrderList
  //     list.splice(index, 1)
  //     if (s.data.tag == 'operatable') {
  //       s.setData({
  //         operatableOrderList: list
  //       })
  //     } else {
  //       s.setData({
  //         operatabledOrderList: list
  //       })
  //     }

  //   }, 200)
  //   this.showState = 0
  //   this.setData({
  //     scrollY: true
  //   })
  // },
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
  // translateXItem: function(id, x, duration) {
  //   var animation = wx.createAnimation({
  //     duration: duration
  //   })
  //   animation.translateX(x).step()
  //   this.animationItem(id, animation)
  // },
  // animationItem: function(id, animation) {
  //   var index = this.getItemIndex(id)
  //   var param = {}
  //   var indexString = this.data.tag == 'operatable' ? 'operatableOrderList[' + index + '].animation' : 'operatabledOrderList[' + index + '].animation'
  //   param[indexString] = animation.export()
  //   this.setData(param)
  // },
  // animationWrapItem: function(id, animation) {
  //   var index = this.getItemIndex(id)
  //   var param = {}
  //   var indexString = this.data.tag == 'operatable' ? 'operatableOrderList[' + index + '].wrapAnimation' : 'operatabledOrderList[' + index + '].wrapAnimation'
  //   param[indexString] = animation.export()
  //   this.setData(param)
  // },
})