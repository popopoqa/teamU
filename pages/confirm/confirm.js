var app = getApp();
import { request1 } from '../../components/public.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img1: '../../image/wx_logo.png',
    isShow:false,
    data:'请选择',
    isShown:false,
    message:'',
    record:'',
    num:0,
    num2:0,
    issend:false,
    id:'',
    unitPrice:'',
    list:'',
    code:'',
    name:'',
    options:'',
    openIds:'',
    record:false,
    balance:0,
    type:'',
    invest:false,
    pack:false,
    savingCard:'',
    nums:0,
    amount:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '订单确认',
    });
    that.recharge(options);
    that.obtainCode(options);
    that.data.options = options;
    wx.getStorage({
      key: 'open',
      success: function (res) {
        that.data.openIds = res.data;
      },
    })
  },
  onShareAppMessage: function () {
    return {
      path: '/pages/index/index',
      success: function (res) {
      }
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.recharge(that.data.options);
    that.obtainCode(that.data.options);
    wx.stopPullDownRefresh();
  },
  // 点击满减
  opt:function() {
    var that = this;
    that.setData({
      isShown: !that.data.isShown,
      issend: !that.data.issend
    })
  },
  // 获取门店信息
  recharge: function (res) {
    var that = this;
    // 充值卡
    var data = {
      userId: app.globalData.userId,
      id: res.id,
      type: res.type,
      shopId:res.shopId
    }
    wx.showLoading({
      title: '加载中',
    });
    request1('post', '/user/order/createOrderInfo', data).then(res => {
      if(res.code == 0) {
        var availableCoupons = res.data.couponsList.length;
        var data = res.data;
        if (data.publicVip) {
          that.data.list = data.publicVip;
          data.publicVip.name = data.publicVip.vipName;
          data.publicVip.content = data.publicVip.vipContent;
        } else {
          that.data.list = data.publicSavingsCard;
        };
        that.data.savingCard = data.publicSavingsCard;
        that.data.message = data.publicSavingsCardActivity;
        if(res.data.vip) {
          that.data.balance = Number(res.data.vip.balance);
        };
        if (!data.publicVip) {
          that.data.invest = true;
          that.data.pack = false;
        } else {
          that.data.pack = true;
          that.data.invest = false;
        };
        var publicVipDetails;
        if (data.publicVip) {
          if (data.publicVip.publicVipDetails) {
            publicVipDetails = data.publicVip.publicVipDetails;
          } else {
            publicVipDetails = [];
          }
        } else {
          publicVipDetails = [];
        }
        that.setData({
          publicVip: data.publicVip,
          balance: that.data.balance,
          publicSavingsCardActivity: data.publicSavingsCardActivity,
          publicSavingsCard: data.publicSavingsCard,
          availableCoupons: availableCoupons,
          publicVipDetails: publicVipDetails,
          invest: that.data.invest,
          pack: that.data.pack
        })
      }
      wx.hideLoading();
    })
  },
  radioChange2: function (res) {
    var that = this;
    that.setData({
      total:0,
      actual:0
    })
    if(res.detail.value == '充值') {
      that.data.invest = true;
      that.data.pack = false;
      that.setData ({
        _index:true
      })
    } else if (res.detail.value == '包年'){
      that.data.pack = true;
      that.data.invest = false;
    };
    that.setData({
      invest: that.data.invest,
      pack: that.data.pack
    })
  },
  // 获取城市编码
  obtainCode: function (res) {
    var that = this;
    var data = {
      city: res.city
    };
    request1('post', '/user/shop/findByCityName', data).then(res => {
      if (res.count == 1) {
        that.data.code = res.geocodes[0].citycode;
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 调用支付接口
  payment: function (e) {
    var that = this;
    var list = that.data.list;
    var discoutMoney = e.currentTarget.dataset.value;
    // 获取总价
    var totalPrice = that.data.unitPrice;
    if (totalPrice) {
      if (discoutMoney) {
        totalPrice = that.data.unitPrice - discoutMoney;
      } else {
        totalPrice = that.data.unitPrice;
      }
    } else {
      totalPrice = 0;
      wx.showToast({
        title: '请选择充值金额',
        icon: 'none'
      })
    };
    // 获取单价
    var unitPrice = that.data.unitPrice;
    if (unitPrice) {
      unitPrice = unitPrice;
    } else {
      unitPrice = 0;
    };
    var openIds;
    if (app.globalData.openId) {
      openIds = app.globalData.openId;
    } else {
      openIds = that.data.openIds;
    }
    var data = {
      shopId: list.shopId,
      code: that.data.code,
      id: list.id,
      body: '购买门票',
      name: list.name,
      content: list.content,
      type: that.data.type,
      paymentType:3,
      rechargeAmount:Number(unitPrice).toFixed(2),
      count: that.data.nums,
      openId: openIds
    };
    request1('post', '/user/order/pay2', data).then(res => {
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
            that.experience(outTradeNo)
          },
          fail(res) {
            console.log(res)
          }
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
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
  },
  radioChange:function(res) {
    let that = this;
    that.data.nums = 1;
    let val = res.detail.value.split(',');
    let actual = Number(val[0]);
    let present = Number(val[1]);
    that.data.unitPrice = actual;
    that.data.type = 4;
    let total;
    if(that.data.balance > 0) {
      total = actual + present + that.data.balance ;
    } else {
      total = actual + present;
    };
    that.data.list = that.data.savingCard;
    that.setData({
      total: total,
      actual: actual,
      nums:that.data.nums
    })
  },
  radioChange1:function(res) {
    let that = this;
    that.data.nums = 1;
    let index = res.detail.value;
    let value = res.detail.value.split(',');
    for (let i in value) {
      value[i] = Number(value[i])
    };
    if (value[1]) {
      that.data.unitPrice = value[1];
    } else {
      that.data.unitPrice = value[2];
    };
    that.data.amount = value[2];
    if (value[3] == 1) {
      that.data.type = 5;
    } else if (value[3] == 2) {
      that.data.type = 6;
    } else if (value[3] == 3) {
      that.data.type = 7;
    } else if (value[3] == 4) {
      that.data.type = 3;
    };
    that.setData({
      _index: value[0],
      actual: that.data.unitPrice,
      total: that.data.amount,
      nums: that.data.nums
    })
  },
  reduce:function() {
    var that = this;
    if(that.data.nums > 1) {
      that.data.nums--;
    } else {
      that.data.nums = 0;
    };
    var unitPrice1 = that.data.unitPrice;
    unitPrice1 = unitPrice1 * that.data.nums;
    var amountPrice = that.data.amount;
    amountPrice = amountPrice * that.data.nums;
    if (!that.data.unitPrice) {
      wx.showToast({
        title: '请选择会员卡类型',
        icon: 'none'
      })
      that.data.nums = 0;
    }
    that.setData({
      nums: that.data.nums,
      actual: unitPrice1.toFixed(2),
      total: amountPrice
    })
  },
  plus:function() {
    var that = this;
    that.data.nums++;
    var unitPrice2 = that.data.unitPrice;
    unitPrice2 = unitPrice2 * that.data.nums;
    var amountPrice = that.data.amount;
    amountPrice = amountPrice * that.data.nums;
    if (!that.data.unitPrice) {
      wx.showToast({
        title: '请选择会员卡类型',
        icon: 'none'
      })
      that.data.nums = 0;
    };
    that.setData({
      nums: that.data.nums,
      actual: unitPrice2.toFixed(2),
      total: amountPrice
    })
  }
})