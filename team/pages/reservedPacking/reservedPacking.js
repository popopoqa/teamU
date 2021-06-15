var app = getApp();
import { request1 } from '../../components/public.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:'',
    array: '',
    basketballCourtBlock:'',
    list:[],
    img1:'../../image/wx_logo.png',
    openIds:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.options = options;
    var pages = getCurrentPages();
    var page = pages[pages.length -2].data.list;
    var array = pages[pages.length - 2].data.array1;
    that.data.array = array;
    for(var i in array) {
      page.basketballCourtBlock[i].array = array[i];
    };
    var basketballCourtBlock = that.data.basketballCourtBlock;
    basketballCourtBlock = page.basketballCourtBlock;
    that.data.basketballCourtBlock = page.basketballCourtBlock;
    var listtemp = [];
    for (var i in basketballCourtBlock) {
      listtemp.push(basketballCourtBlock[i].id);
    }
    that.data.list = listtemp;
    var that = this;
    that.setData({
      options:options,
      curtime:options.time1,
      page:page,
      availableCoupons: options.availableCoupons
    });
    // 计算时间
    var countDownNum = 180;
    timer: setInterval(function () {
      countDownNum--;
      var minutes = parseInt(countDownNum / 60);
      var sec = countDownNum - minutes * 60;
      if(minutes > 0) {
        if(sec < 10) {
          sec = '0' + sec;
        } else {
          sec = sec
        };
        that.setData({
          countDownNum: countDownNum,
          minutes: minutes + ':',
          sec:sec
        })
      } else {
        that.setData({
          countDownNum: countDownNum,
          minutes: '',
          sec:sec
        })
      }
      if (countDownNum == 0) {
        clearInterval(that.data.timer);
        that.cancel();
      }
    }, 1000);
    wx.getStorage({
      key: 'open',
      success: function (res) {
        that.data.openIds = res.data;
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  // 支付接口
  // 调用支付接口
  payment: function () {
    var that = this;
    var data = that.data.options;
    var price = Number(data.totalmoney).toFixed(2);
    // 创建json类型的对象
    var blockJson = {};
    var basketballCourtBlock = that.data.basketballCourtBlock;
    var arrayId = [];
    for (var i in basketballCourtBlock) {
      blockJson = basketballCourtBlock[i];
      arrayId.push(blockJson);
    };
    var obj = {};
    obj.block = arrayId;
    var arrayId1 = JSON.stringify(obj);
    var openIds;
    if (app.globalData.openId) {
      openIds = app.globalData.openId;
    } else {
      openIds = that.data.openIds;
    };
    var data = {
      ballCourtNumber: data.ballCourtNumber,
      userId: app.globalData.userId,
      code: data.code,
      id: data.id,
      body: '预定包场',
      name: data.name,
      content: "",
      type: 2,
      paymentType: 3,
      unitPrice: price,
      totalPrice: price,
      discountUnitPrice: price,
      discountTotalPrice: price,
      discount: Number(data.discount).toFixed(2),
      discountContent: data.discountContent,
      actualPrice: price,
      count: basketballCourtBlock.length,
      shopId: data.shopId,
      appId:'wx03a11e51a87d8fff',
      openId: openIds,
      time: data.time,
      block: arrayId1
    };
    wx.showLoading({
      title: '加载中',
    })
    request1('post', '/user/order/pay', data).then(res => {
      if (res.code == 0) {
        var outTradeNo = res.data.outTradeNo;
        var data = res.data.xcxPay;
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: 'MD5',
          paySign: data.paySign,
          success(res) {
            console.log(res)
            that.experience(outTradeNo)
          },
          fail(res) {
            console.log(res)
          }
        })
        wx.hideLoading()
      }
    }).catch(err => {
      console.log(err)
    });
  },
  // 取消订单
  cancel:function() {
    var that = this;
    var list = that.data.list;
    var data = {
      blockId: JSON.stringify(list).slice(1, JSON.stringify(list).length - 1)
    }
    request1('post', '/user/order/unlock', data).then(res => {
      if (res.code == 0) {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.setData({
          addresschose: 1,
        });
        wx.navigateBack({
          delta: 1
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 获取积分和经验
  experience: function (res) {
    var that = this;
    var data = {
      outTradeNo: res
    };
    request1('post', '/user/order/findOrderStatus', data).then(res => {
      if (res.code == 0) {
        wx.navigateTo({
          url: '../records/records?score=' + res.data.orderBase.score + '&exp=' + res.data.orderBase.exp
        })
      }
    })
  }
})