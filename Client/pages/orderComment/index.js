const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    list: [
      [{
        id: 0,
        bgcolor: '#fff',
        // name: 'goodservice',
        value: '服务良好'
      },
      {
        id: 1,
        bgcolor: '#fff',
        // name: 'misconduct',
        value: '行为不当'
      },
      {
        id: 2,
        bgcolor: '#fff',
        // name: 'expired',
        value: '上门时间过长'
      }],
      [{
        id: 3,
        bgcolor: '#fff',
        // name: 'reasonableprice',
        value: '价格公道'
      },
      {
        id: 4,
        bgcolor: '#fff',
        // name: 'lessweight',
        value: '缺斤少两'
      },
      {
        id: 5,
        bgcolor: '#fff',
        // name: 'irregularcoat',
        value: '着装不规范'
      }],
      [{
        id: 6,
        bgcolor: '#fff',
        // name: 'wrongprice',
        value: '价格不对'
      },
      {
        id: 7,
        bgcolor: '#fff',
        // name: 'badservice',
        value: '服务态度差'
      },
      {
        id: 8,
        bgcolor: '#fff',
        // name: 'efficient',
        value: '办事效率高'
      }],
    ]
  },
  selectedOpts: [],

  onLoad: function (opt) {
    
    var starIcon = []
    for (var i = 0; i < 5; ++i) {
      starIcon[i] = '/Resources/images/star_empty.png'
    }
    opt.operatertime = util.formatTime(new Date(parseInt(opt.operatertime)))
    opt.pay = parseFloat(opt.pay).toFixed(2)
    this.orderid = opt.orderid
    this.setData({
      starIcon: starIcon,
      deviceInfo: app.globalData.deviceInfo,
      order: opt
    })
  },
  bindStarTap: function (e) {
    var starIcon = this.data.starIcon
    var index = e.currentTarget.id
    for (var i = 0; i < 5; ++i) {
      if (i <= index) {
        starIcon[i] = '/Resources/images/star_fill.png'
      } else {
        starIcon[i] = '/Resources/images/star_empty.png'
      }
    }
    var starText = ''
    var star = parseInt(index) + 1
    // 判断服务等级
    switch (star) {
      case 1:
        starText = '非常差'
        break
      case 2:
        starText = '差'
        break
      case 3:
        starText = '一般'
        break
      case 4:
        starText = '好'
        break
      case 5:
        starText = '非常好'
    }
    this.setData({
      starIcon: starIcon,
      star: star,
      starText: starText
    })
  },
  bindSelectTap: function (e) {
    var list = this.data.list
    let index = parseInt(e.currentTarget.id)

    for (var i = 0; i < list.length; ++i) {
      for (var j = 0; j < list[i].length; ++j) {
        if (i * 3 + j == index) {
          if (list[i][j].bgcolor == '#fff') {
            list[i][j].bgcolor = '#43dac0'
            this.selectedOpts.push({ 'x': i, 'y': j })
          }else if (list[i][j].bgcolor == '#43dac0') {
            list[i][j].bgcolor = '#fff'
            for (var k=0; k<this.selectedOpts.length; ++k) {
              if (this.selectedOpts[k].x==i && this.selectedOpts[k].y==j) {
                this.selectedOpts.splice(k, 1)
              }
            }
          }
        }
      }
    }
    this.setData({
      list: list
    })
  },
  bindTextareaInput: function (e) {
    this.setData({
      detailcomment: e.detail.value
    })
  },
  bindCommentTap: function (e) {

    let star = this.data.star
    let starText = this.data.starText
    let detailcomment = this.data.detailcomment ? this.data.detailcomment : ''
    var comments = ''
    let list = this.data.list
    let s = this
    // 判断输入是否完成
    if (star == undefined) {
      wx.showToast({
        title: '请给本次的服务打分！',
        icon: 'none'
      })
      return

    }
    if (this.selectedOpts.length == 0) {
      wx.showToast({
        title: '请至少选择一个评价标签',
        icon: 'none'
      })
      return
    }
    for (var i = 0; i < this.selectedOpts.length; ++i) {
      comments += list[this.selectedOpts[i].x][this.selectedOpts[i].y].value + ','
    }
    console.log(comments, detailcomment, starText)
    wx.showToast({
      title: '发布中...',
      icon: 'loading',
      success: function () {
        setTimeout(function () {
          // 评价订单
          wx.request({
            url: 'https://www.dingdonhuishou.com/AHS/api/userorder/comment',
            data: {
              orderid: s.orderid,
              starnum: star,
              comment: comments,
              detailcomment: detailcomment
            },
            method: 'POST',
            header: app.globalData.header,
            success: function (res) {
              if (res['data']['isSuccess'] == 'TRUE') {
                wx.showToast({
                  title: res['data']['content'],
                  icon: 'none',
                  success: function () {
                    wx.getStorage({
                      key: 'waitForComment'+app.globalData.userInfo.id,
                      success: function(res) {
                        var waitForComment = res['data']
                        for (var i=0; i<waitForComment.length; ++i) {
                          if (s.orderid == waitForComment[i]) {
                            waitForComment.splice(i, 1)
                          }
                        }
                        wx.setStorage({
                          key: 'waitForComment' + app.globalData.userInfo.id,
                          data: waitForComment
                        })
                      },
                    })
                    setTimeout(function () {
                      wx.navigateBack()
                    }, 1500)
                  }
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
        }, 1500)
      }
    })
  }
})