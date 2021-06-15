var app = getApp();
import { request1 } from '../../components/public.js';
var QR = require('../../utils/qrcode.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: true,
    // 二维码
    imagePath: '',
    tip: 'null',
    // 记录每次自动刷新得开始时间
    st: null,
    type: '',
    ticketNo: '',
    options: '',
    userId:'',
    checkeds: '',
    code:'',
    tempFilePath:'',
    phoneNumber:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.type = options.type;
    // 生成二维码
    that.msg(options);
    that.setCanvasSize();
    that.data.options = options;
    wx.getStorage({
      key: 'phone',
      success: function(res) {
        that.data.userId = res.data;
      },
    });
   
  },
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    var that = this;
    that.msg(that.data.options);
    that.setCanvasSize();
    that.setData({
      checked1: false
    });
    wx.stopPullDownRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  // 查看门店详细信息
  msg: function (res) {
    var cardnum = res.ticketNo;
    var that = this;
    var data = {
      ticketNo: res.ticketNo,
      type: res.type,
      shopId: res.shopId
    };
    wx.showLoading({
      title: '加载中',
    });
    request1('post', '/user/shop/findTicketDetail', data).then(res => {
      if (res.code == 0) {
        that.data.phoneNumber = res.data.ballCourtTicketDto.shopPhone;
        if(res.data.used) {
          customer: res.data.used
        }
        var gateBrake = res.data.ballCourtTicketDto.gateBrake;
        var ticketNo = res.data.ballCourtTicketDto.ticketNo;

        if ((gateBrake == true || gateBrake == 'true') && (cardnum != '' || cardnum !== null || cardnum !== 'null')) {
          that.setData({
            gateBrake: true
          });
          that.data.code = res.data.number;
          that.data.checkeds = true;
        }
      
        that.data.ticketNo = res.data.ballCourtTicketDto.ticketNo
        that.setData({
          ballCourtTicketDto: res.data.ballCourtTicketDto
        });
        wx.hideLoading();
        that.autoRefresh();
      }
    }).catch(err => {
      console.log(err)
    })
  },
  checked1: function () {
    var that = this;
    that.data.checkeds = true;
    that.setData({
      checked: true
    })
  },
  checked2: function () {
    var that = this;
    that.data.checkeds = false;
    that.setData({
      checked: false
    })
  },
  // 加密编码
  code: function () {
    let data = {
      number: '',
      missisecond: 60000
    };
    request1('post', '/user/shop/smsNumber', data).then(res => {
      that.refuseQRcode(res.data.number)
    }).catch(err => {

    })
  },
  // 用户查看充值卡消费记录
  lookat: function () {
    let data = {
      vipId: '',
      shopId: ''
    }
    request1('post', '/user/shop/savingsCardWalletRecord', data).then(res => {

    }).catch(err => {
      console.log(err)
    })
  },
  // 获取二维码参数
  refuseQRcode: function () {
    qrcode.clear()
  },
  // 适配不同屏幕大小得canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 400;
      var width = res.windowWidth / scale;
      var height = width;
      size.w = width;
      size.h = height;
    } catch (e) {
      console.log('获取设备信息失败') + e;
    }
    return size;
  },
  // 生成二维码
  createQrCode: function (canvasId, cavW, cavH) {
    let that = this;
    var url;
    if (that.data.checkeds == true) {
      url = that.data.code;
      QR.api.draw(url, canvasId, cavW, cavH);
    } else {
      if (app.globalData.userId) {
        url = app.globalData.userId + ',' + that.data.type + ',' + that.data.ticketNo;
      }
      QR.api.draw(url, canvasId, cavW, cavH);
    }
    setTimeout(() => { this.canvasToTempImage(); }, 100)
  },
  autoRefresh: function () {
    let that = this;
    let size = that.setCanvasSize();
    that.createQrCode("mycanvas2", size.w, size.h)
  },
  // 生成图片
  canvasToTempImage: function () {
    var that = this;
    setTimeout(function () {
      
    })
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas2',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        that.data.tempFilePath = res.tempFilePath;
        that.setData({
          imagePath: tempFilePath
        });
      },
      fail: function (res) {
        let size = that.setCanvasSize();
        that.createQrCode("mycanvas2", size.w, size.h)
      }
    }, this)
  },
  checked1: function () {
    var that = this;
    that.data.checkeds = true;
    that.setData({
      checked1: false
    });
    that.autoRefresh()
  },
  checked2: function () {
    var that = this;
    that.data.checkeds = false;
    that.setData({
      checked1: true
    });
    that.autoRefresh()
  },
  shareCanvas:function() {
    var that = this;
    wx.pageScrollTo({
      scrollTop: 0,
    })
    that.setData({
      shareCanvas: true,
      filePath: that.data.tempFilePath
    })
  },
  del:function() {
    var that = this;
    that.setData({
      shareCanvas:false
    })
  },
  // 将canvas转化为图片保存到本地，然后将图片路径传给image图片的src
  baocun:function() {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res){
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel:false,
          confirmText:'好的',
          confirmColor:'#333',
          success:function(res) {
            if(res.confirm) {
              console.log('用户点击确定')
              that.setData({
                shareCanvas:false
              })
            }
          },fail:function(res) {
            console.log(res)
          }
        })
      }
    })
  },
  callphone:function() {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.phoneNumber,
    })
  }
})