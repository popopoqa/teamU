var app = getApp();
import { request1 } from '../../components/public.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img1:'../../image/wx_logo.png',
    num:1,
    code:'',
    id:'',
    ballCourtNumber:'',
    price:'',
    name:'',
    data:'',
    businessCouponsId:'',
    openId:'',
    options:'',
    openIds:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.openId = app.globalData.openId;
    that.data.id = options.id;
    that.data.name = options.name;
    wx.setNavigationBarTitle({
      title: '订单确认',
    });
    that.information(options)
    that.obtainCode(options)
    that.data.options = options;
    wx.getStorage({
      key: 'open',
      success: function (res) {
        that.data.openIds = res.data;
      },
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.information(that.data.options);
    that.obtainCode(that.data.options);
    wx.stopPullDownRefresh();
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
    return {
      path: '/pages/index/index',
      success: function (res) {
      }
    }
  },
  model2confirm: function (e) {
    this.setData({ hiddenModal2: true });
  },
  model2cancel: function (e) {
    this.setData({ hiddenModal2: true })
    wx.navigateBack({
      delta: 1,
    })
  },
  // 创建订单管理
  information:function(e) {
    var that = this;
    var data = {
      id:e.id,
      type:1
    };
    wx.showLoading({
      title: '加载中',
    });
    request1('post', '/user/order/createOrderInfo',data).then(res => {
      if(res.code == 0) {
        var data = res.data.publicTicket;
        // 判断有效日期
        if (data.startCycle == 1) {
          data.startCycle = '周一'
        };
        if (data.startCycle == 2) {
          data.startCycle = '周二'
        };
        if (data.startCycle == 3) {
          data.startCycle = '周三'
        };
        if (data.startCycle == 4) {
          data.startCycle = '周四'
        };
        if (data.startCycle == 5) {
          data.startCycle = '周五'
        };
        if (data.startCycle == 6) {
          data.startCycle = '周六'
        };
        if (data.startCycle == 7) {
          data.startCycle = '周日'
        };
        if (data.stopCycle == 1) {
          data.stopCycle = '周一'
        };
        if (data.stopCycle == 2) {
          data.stopCycle = '周二'
        };
        if (data.startCycle == 3) {
          data.startCycle = '周三'
        };
        if (data.stopCycle == 4) {
          data.stopCycle = '周四'
        };
        if (data.stopCycle == 5) {
          data.stopCycle = '周五'
        };
        if (data.stopCycle == 6) {
          data.stopCycle = '周六'
        };
        if (data.stopCycle == 7) {
          data.stopCycle = '周日'
        };
        if (data.startCycle == '周一' && data.stopCycle == '周日') {
          data.describe = '全周'
        } else {
          data.describe = data.startCycle + '到' + data.stopCycle;
        };
        that.data.ballCourtNumber = data.ballCourtNumber;
        that.data.data = data;
        var price = '';
        if (data.discountPrice !== 0 && data.discountPrice !== null) {
          price = data.discountPrice;
        } else {
          price = data.price
        };

        that.data.price = price;
        // 开始时间
        var beginTime = data.startTime;
        var begin = beginTime.substring(0,5);
        var stopTime = data.stopTime;
        var stop = stopTime.substring(0,5);
        var time = begin + '-' + stop;
        var couponsList = res.data.couponsList.length;
        that.setData({
          price:price,
          time:time,
          describe: data.describe,
          availableCoupons: couponsList
        });
        wx.hideLoading()
      }
    }).catch(err => {
      console.log(err)
    })
  },
  reduce:function() {
    var that = this;
    var num = that.data.num;
    if(num>1) {
      num--;
    }
    that.setData({
      num:num
    })
  },
  // 获取城市编码
  obtainCode:function(res){
    var that = this;
    var data = {
      city:res.city
    };
    request1('post','/user/shop/findByCityName', data).then(res => {
      if(res.count == 1) {
        that.data.code = res.geocodes[0].citycode;
      }
    }).catch(err => {
      console.log(err)
    })
  },
  plus:function() {
    var that = this;
    var num = that.data.num;
    num++;
    that.setData({
      num:num
    })
  },
  // 调用支付接口
  payment:function() {
    var that = this;
    var totalPrice = that.data.num * that.data.price;
    var ballCourtNumber = that.data.ballCourtNumber;
    var name = that.data.name+ '-' + that.data.data.gateName;
    var openIds;
    if (app.globalData.openId) {
      openIds = app.globalData.openId;
    } else {
      openIds = that.data.openIds;
    };
    var data = {
      ballCourtNumber: ballCourtNumber,
      code: that.data.code,
      id: that.data.id,
      body: '购买门票',
      name: name,
      content: "",
      type: 1,
      paymentType: 3,
      unitPrice: Number(that.data.price).toFixed(2),
      totalPrice: Number(totalPrice).toFixed(2),
      discountUnitPrice: Number(that.data.price).toFixed(2),
      discountTotalPrice: Number(totalPrice).toFixed(2),
      discount: that.data.data.discount,
      discountContent: that.data.data.discountContent,
      actualPrice: Number(totalPrice).toFixed(2),
      count: that.data.num,
      startTime: that.data.data.startTime,
      stopTime: that.data.data.stopTime, 
      shopId: that.data.data.shopId,
      appId: 'wx03a11e51a87d8fff',
      openId: openIds
    };
    request1('post', '/user/order/pay', data).then(res => {
      if(res.code == 0) {
        var outTradeNo = res.data.outTradeNo;
        var data = res.data.xcxPay;
        wx.requestPayment({
          timeStamp: data.timeStamp, 
          nonceStr: data.nonceStr,
          package: data.package,
          signType:'MD5',
          paySign:data.paySign,
          success(res) {
            that.experience(outTradeNo)
          },
          fail(res) {
            console.log(res)
          }
        })
      }
    }).catch(err => {
      console.log(err)
    });
  },
  // 获取积分和经验
  experience:function(res) {
    var that = this;
    var data = {
      outTradeNo:res
    };
    request1('post', '/user/order/findOrderStatus', data).then(res => {
      console.log(res)
      if(res.code == 0) {
        wx.redirectTo ({
          url: '../records/records?score=' + res.data.orderBase.score + '&exp=' + res.data.orderBase.exp
        })
      }
    })
  }
})