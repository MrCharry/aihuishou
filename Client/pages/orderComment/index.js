const app = getApp()

Page({
  data: {
    items: [{
      name: 'good',
      value: '服务良好',
      checked: true
    },
    {
      name: 'misconduct',
      value: '行为不当'
    },
    {
      name: 'expired',
      value: '上门时间过长'
    }
    ]
  },
  onLoad: function (opt) {
    var starIcon = []
    for (var i = 0; i < 5; ++i) {
      starIcon[i] = '/Resources/images/star_empty.png'
    }
    this.setData({
      starIcon: starIcon,
      orderid: opt.orderid
    })
  },
  bindStarTap: function (e) {
    var starIcon = this.data.starIcon
    var index = e.currentTarget.id
    for (var i = 0; i < 5; ++i) {
      if (i <= index) {
        starIcon[i] = '/Resources/images/star_fill.png'
      } else {
        starIcon[i] = 'Resources/images/star_empty.png'
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
  bindTextareaInput: function (e) {
    this.setData({
      detailcomment: e.detail.value
    })
  },
  bindRadioChange: function (e) {
    this.setData({
      comment: e.detail.value
    })
  },
  bindCommentTap: function (e) {
    let star = this.data.star
    let starText = this.data.starText
    let comment = this.data.comment == undefined ? 'good' : this.data.comment
    let detailcomment = this.data.detailcomment
    let orderid = this.data.orderid
    console.log(star, starText, comment, detailcomment)

    if (star == undefined) {
      wx.showToast({
        title: '请给本次的服务打分！',
        icon: 'none'
      })
      return

    } else if (detailcomment == undefined) {
      wx.showToast({
        title: '评论内容不能为空！',
        icon: 'none'
      })
      return
    }
    wx.showToast({
      title: '发布中...',
      icon: 'loading',
      success: function () {
        setTimeout(function () {
          // 评价订单
          wx.request({
            url: 'https://www.dingdonhuishou.com/AHS/api/userorder/comment',
            data: {
              orderid: orderid,
              starnum: star,
              comment: comment,
              detailcomment: detailcomment
            },
            method: 'POST',
            header: app.globalData.header,
            success: function (res) {
              if (res['data']['isSuccess'] == 'TRUE') {
                wx.showToast({
                  title: res['data']['content'],
                  icon: 'none',
                  success: function() {
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