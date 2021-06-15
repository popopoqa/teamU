var app = getApp();
import { request1} from '../../components/public.js';
var QR = require('../../utils/qrcode.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:'',
    // 二维码
    imagePath:'',
    setInter:'',
    tip:'null',
    // 记录每次自动刷新得开始时间
    st:null,
    vipId:'',
    type:'',
    currTime:'',
    minutes:'',
    sec:'',
    year:'',
    month:'',
    day:'',
    hour:'',
    code:'',
    options:'',
    walletRecords:'',
    sec1: '',
    minutes1: '',
    hour1: '',
    options1:'',
    flag :false,
    timing:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.options1 = options;
    that.data.type = options.type;
    // 生成二维码
    that.msg(options);
    that.setCanvasSize();
    that.data.options = options
  },
  //  页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      checked1: false
    });
    clearTimeout(that.data.timing);
    clearInterval(that.data.setInter);
    var options2 = that.data.options1;
    that.data.type = options2.type;
    that.data.timing = '';
    // 生成二维码
    that.msg(options2);
    that.setCanvasSize();
    wx.stopPullDownRefresh();
  },
  // 查看门店详细信息
  msg:function(res) {
    var cardnum = res.cardNumber;
    var that = this;
    var data = {
      type: res.type,
      shopId: res.shopId,
      ticketNo: res.cardNumber
    };
    wx.showLoading({
      title: '加载中',
    });
    request1('post', '/user/shop/findTicketDetail',data).then(res => {
      if(res.code == 0) {
        var ticket = res.data.ballCourtTicketDto;
        that.data.vipId = ticket.vipId;
        that.data.currTime = res.data.sysDate; 
        var gateBrake = ticket.gateBrake;
        var ticketNo = ticket.ticketNo;
        if ((gateBrake == true || gateBrake == 'true') && (cardnum != '' || cardnum !== null || cardnum !== 'null')) {
          that.setData({
            gateBrake: true
          });
          that.data.checked  = true;
          that.data.code = res.data.number;
        };

        var sysDate = res.data.sysDate;
        var date = new Date(sysDate);
        var year = date.getFullYear();
        var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        var day = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        var hour = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours());
        var hour1 = date.getHours();
        var minutes = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
        var minutes1 = date.getMinutes();
        var sec = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        var sec1 = date.getSeconds();
        that.data.year = year;
        that.data.month = month;
        that.data.day = day;
        that.data.hour = hour;
        that.data.minutes = minutes;
        that.data.sec = sec1;
        that.data.sec1 = sec;
        that.data.minutes1 = minutes1;
        that.data.hour1 = hour1;
        var currentTime;
        if (that.data.hour1  < 10) {
          currentTime = year + '年' + month + '月' + day + '日' + ' ' + hour1 + ':' + minutes + ':' + sec1;
        } else {
          currentTime = year + '年' + month + '月' + day + '日' + ' ' + '0' +  hour1 + ':' + minutes + ':' + sec1
        }
        var list = res.data.ballCourtTicketDto;
        if (list.ticketName == '充值会员卡') {
          list.name = '会员卡'
        };
        var describe;
        if (ticket.time != null) {
          if (new Date(ticket.time.replace(/-/g, "/"))) {
            let sysDate = (new Date(ticket.time.replace(/-/g, "/")))
            let year = sysDate.getFullYear();
            let month = sysDate.getMonth() + 1 < 10 ? ('0' + (sysDate.getMonth() + 1)) : (sysDate.getMonth() + 1);
            let day = sysDate.getDate() < 10 ? ('0' + (sysDate.getDate())) : (sysDate.getDate());
            describe = year + '年' + month + '月' + day + '日';
            that.setData({
              annualCard:true
            })
          } else {
            describe = '已过期'
          }
        } else {
          describe = '未开通'
        };
        let walletRecords = res.data.walletRecords.reverse();
        that.data.walletRecords = walletRecords;
        for (var i in walletRecords) {
          walletRecords[i].content = walletRecords[i].content.replace("<span style='color:red;'>",'').replace('</span>','');
        };
        that.setData({
          currentTime: currentTime,
          message: res.data,
          describe:describe,
          walletRecords: walletRecords,
          minutes: minutes1,
          sec:sec1,
          min:'0',
          ticketNo: ticketNo,
          list: list
        });
        that.timing();
        that.autoRefresh()
      }
      wx.hideLoading()
    }).catch(err => {
      console.log(err)
    })
  },
  checked1:function() {
    var that = this;
    that.data.checked = true;
    that.setData({
      checked1:false
    });
    clearInterval(that.data.setInter);
    that.autoRefresh()
  },
  checked2: function () {
    var that = this;
    that.data.checked = false;
    that.setData({
      checked1: true
    });
    clearInterval(that.data.setInter);
    that.autoRefresh()
  },
  // 获取二维码参数
  refuseQRcode:function() {
    qrcode.clear()
  },
  // 适配不同屏幕大小得canvas
  setCanvasSize:function() {
    var that = this;
    var size = {};
    try  {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 400;
      var width = res.windowWidth / scale;
      var height = width;
      size.w = width;
      size.h = height;
    } catch (e) {
      console.log('获取设备信息失败') + e;
    };
    return size;
  },
  // 生成二维码
  createQrCode:function(canvasId,cavW,cavH) {
    let that = this;
    var data = that.data.year + '-' + that.data.month + '-' + that.data.day + ' ' + that.data.hour + ':' + that.data.minutes + ':' + that.data.sec;
    // 判断分钟秒是否需要添加'0'字符串
    var sec;
    if (that.data.sec < 10) {
      sec = '0' + that.data.sec
    } else {
      sec = that.data.sec;
    };
    var min;
    if (that.data.min < 10) {
      min = '0' + that.data.minutes;
    } else {
      min = that.data.minutes
    };
    var hour;
    if(that.data.hour < 10) {
      hour = '0' + that.data.hour;
    } else {
      hour = that.data.hour
    }
    var currentTime;
    if(that.data.hour1 < 10) {
      if (that.data.minutes1 < 10) {
        that.setData({
          currentTime: that.data.year + '年' + that.data.month + '月' + that.data.day + '日' + ' ' + '0' + that.data.hour1 + ':' + '0'  + that.data.minutes1 + ':' + sec
        });
      } else {
        that.setData({
          currentTime: that.data.year + '年' + that.data.month + '月' + that.data.day + '日' + ' ' + '0' + that.data.hour1 + ':' +  that.data.minutes1 + ':' + sec
        });
      }
    } else {
      if (that.data.minutes1 < 10) {
        that.setData({
          currentTime: that.data.year + '年' + that.data.month + '月' + that.data.day + '日' + ' ' + that.data.hour1 + ':' + '0' + that.data.minutes + ':' + sec
        });
      } else {
        that.setData({
          currentTime: that.data.year + '年' + that.data.month + '月' + that.data.day + '日' + ' ' + that.data.hour1 + ':' + that.data.minutes + ':' + sec
        });
      }
    };
    // var repTime = data.replace(/-/g, '/');
    // var timeTamp = Date.parse(repTime);
    var timestamp = Date.parse(new Date()); 
    var url;
    if (that.data.checked == true) {
      url = that.data.code;
      QR.api.draw(url, canvasId, cavW, cavH); 
    } else {
      url = app.globalData.userId + ',' + that.data.type + ',' + that.data.vipId + ',' + timestamp;
      QR.api.draw(url, canvasId, cavW, cavH);
    }
  },
  // 自动刷新二维码，30秒刷新一次，先生成一次，再30秒后执行一次
  autoRefresh:function() {
    let that = this;
    // 动态设置画布大小
    let size = that.setCanvasSize();
    that.createQrCode("mycanvas", size.w, size.h);
    that.data.setInter = setInterval(function(){
      that.createQrCode("mycanvas",size.w,size.h);
    },10000);
  },
  // 计算时间函数
  timing:function() {
    var that = this;
    var num = that.data.minutes1;
    var  min = '0';
    var hour = that.data.hour1;
    that.data.timing = setTimeout(function () {
      // 判断时间
      if (((num + 1) > 59) && ((that.data.sec + 1) > 59)) {
        that.setData({
          minutes:0,
          min:min,
          sec: 0,
          hour:hour + 1
        })
        that.data.hour1 = that.data.hour1 + 1;
        that.data.minutes1 = 0;
      } else if (((num + 1) > 60) && ((that.data.sec + 1) <= 59)) {
        that.setData({
          minutes: 0,
          min: min,
          sec: that.data.sec + 1,
          hour: hour + 1
        })
      } else {
        if ((that.data.sec + 1) > 59) {
          that.setData({
            minutes: num + 1,
            sec: 0,
            min: min
          })
          that.data.minutes1++;
        } else {
          that.setData({
            sec: that.data.sec + 1,
            min: min
          })
        }
      }
      that.timing()
    }, 1000);
  }
})