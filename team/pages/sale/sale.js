// pages/sale/sale.js
var app = getApp();
import { request1 } from '../../components/public.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:['未出售','已关闭','已选择','不可选','全场'],
    currentDay:'',
    currentTime:'',
    list1:'',
    time:'',
    checked:false,
    sysDate:'',
    options:'',
    array:[],
    listData:'',
    totalmoney:'',
    code:'',
    price:'',
    number:'',
    blockId:'',
    list:'',
    array1:'',
    checked1:true,
    time2:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name,
    });
    if(options.name == 'AJ Club室内篮球场') {
      wx.setNavigationBarTitle({
        title: options.name
      }); 
    }
    var that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    that.data.options = options;
    that.setData({
      name1:options.name
    })
    var arr= [];
    for (let i = 0; i < 8; i++) {
      arr.push(this.dealTime(i))
    };
    arr[0].date = '今';
    that.setData({
      aweek:arr
    });
    that.setData({
      currentTime: arr[0].currentTime,
    });
    that.data.currentTime = arr[0].currentTime;
    that.obtainCode(options);
    that.storeInformation(options);
  },
  onShow:function(){
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    if (currPage.data.addresschose) {
      wx.showToast({
        title: '取消订单成功',
        icon:'none'
      })
    }
  },
  onShareAppMessage: function () {
    return {
      path: '/pages/index/index',
      success: function (res) {
      }
    }
  },
  //监听用户下拉动作
  onPullDownRefresh: function () {
    var that = this;
    that.storeInformation(that.data.options);
    wx.stopPullDownRefresh();
  },

  // 查询当前门店下的包场信息
  storeInformation:function(res) {
    var that = this;
    var detailTime = that.data.currentTime.replace('-','年').replace('-','月').slice(0,8);
    that.data.time2 = that.data.currentTime.replace('-', '年').replace('-', '月') + '日';
    var data = {
      shopId: res.shopId,
      ballCourtNumber: res.ballCourtNumber,
      time: that.data.currentTime
    };
    wx.showLoading({
      title: '加载中',
    })
    request1('post', '/basketballCourt/findBlockByShopId', data).then(res => {
      if(res.code == 0) {
        that.data.listData = res.data.list;
        wx.hideLoading()
        let sysDate = res.data.sysDate;
        let date = new Date(sysDate);
        that.data.sysDate = sysDate;
        var list = res.data.list;
        var timeList = res.data.timeList;
        if (timeList.length > 0) {
          that.data.time = timeList[0].time;
        };
        that.data.list1 = timeList;
        var number = [];
        var weekDay = [];
        for(var j in list) {
          var data = list[j].blocks;
          for (var n in data) {
            var basketryName = data[n].basketryName;
            var arrayList = [];
            for (var i in data[n].basketryName) {
              arrayList.push(data[n].basketryName[i])
            };
            var basketryName1 = basketryName.replace('<br>','')
            data[n].basketryName = basketryName1;
            var number1 = n;
            if(number1 % 2 == 0) {
              data[n].situation = true;
            } else {
              data[n].situation = false;
            };
            var time1 = data[n].time + ' ' + data[n].startTime;
            var time2 = time1.replace(/-/g, '/');
            data[n].currenttime = new Date(time2);
            if (data[n].currenttime > date) {
              data[n].options = true;
            } else {
              data[n].options = false;
            };
            data[n].shortTime = data[n].startTime.substring(0,5) + '-' + data[n].stopTime.substring(0,5);  
          }
        };
        if (arrayList && arrayList.length >  4) {
          var name1 = arrayList.splice(0,2)
          var name2 = arrayList.splice(3,6)
        };
        var data = Number(res.data.sysDate);
        var time = new Date(data);
        var date = time.getDate();
        var year = time.getFullYear();
        if (date > 9) {
          date = date;
        } else {
          date = '0' + date
        };
        var month = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1);
        that.dealTime(res.data.sysDate);
        that.setData({
          list:list,
          timeList:timeList,
          week: weekDay,
          number:number,
          time1: detailTime,
          date:date
        });
      } 
    })
  },
  // 选择部份
  msg:function(e){
    var that = this;
    that.data.number++;
    var currdata = e.detail.value;
    var checked1 = true;
    var curarray = [];
    var curmoney = [];
    var blockId = [];
    var array1 = [];
    for (var i = 0; i < currdata.length; i++) {
      var currentdata = currdata[i].split(',').slice(2, 4).join(',').replace(',',' ');
      var currentmoney = Number(currdata[i].split(',').slice(-2)[0]);
      var blockid = Number(currdata[i].split(',').slice(-1)[0]);
      var arrayr = Number(currdata[i].split(',').slice(0)[0]);
      blockId.push(blockid)
      curarray.push(currentdata);
      curmoney.push(currentmoney)
      array1.push(arrayr)
      that.data.array1 = array1;
    };
    var totalmoney = 0;
    that.data.blockId = blockId.join(',');
    for (var i in curmoney) {
      that.data.price = curmoney[i];
      totalmoney += curmoney[i];
    }
    that.data.totalmoney = totalmoney;
    var d = e.detail.value;
    var text = [];
    for(var i = 0; i < d.length; i++) {
      var d = d[i].split(',');
      text = text.concat(d[0]);
    };
    var num = Number(text[0]);
    var num2 = Number(text[1]);
    var num1;
    if(num % 2 == 0) {
      num1 = num + 1;
    } else {
      num1 = num -1;
    };
    that.setData({
      array: curarray,
      num1:num1,
      num:num,
      num2:num2,
      totalmoney: totalmoney,
      checked1: checked1
  })
  },
  click:function(e) {
    var that = this;
    console.log(e)
    that.data.currentTime = e.currentTarget.dataset.time;
    that.setData({
      currentTime: e.currentTarget.dataset.time,
      num:null,
      num1:null
    })
    that.storeInformation(that.data.options)
  },
  // 获取当前时间
  dealTime: function (num) {
    var that = this;
    var data = Number(that.data.sysDate)
    var time = new Date();
    var date = new Date(time.setDate(time.getDate() + num)).getDate();
    var year = time.getFullYear();
    if (date > 9) {
      date = date;
    } else {
      date = '0' + date
    };
    var month = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1);
    var currentTime = year + '-' + month + '-' + date;
    var day = time.getDay();
    var year = time.getFullYear();
    switch (day) {           
      case 0: day = "周日"
        break
      case 1: day = "周一"
        break
      case 2: day = "周二"
        break
      case 3: day = "周三"
        break
      case 4: day = "周四"
        break
      case 5: day = "周五"
        break
      case 6: day = "周六"
        break
    };
    var obj = {
      date: date,
      day: day,
      month: month,
      currentTime: currentTime
    }
    return obj
  },
  // 创建订单信息
  information: function () {
    var that = this;
    var data = {
      id: that.data.options.id,
      type: 2,
      shopId: that.data.options.shopId,
      time: that.data.currentTime,
      blockId: that.data.blockId
    };
    request1('post', '/user/order/createOrderInfo', data).then(res => {
      if(res.code == 0) {
        that.data.list = res.data;
        var publicBlock = res.data.publicBlock;
        var basketballCourtBlock = res.data.basketballCourtBlock[0];
        var availableCoupons = res.data.couponsList.length;
        wx.navigateTo({
          url: '/pages/reservedPacking/reservedPacking?ballCourtNumber=' + publicBlock.ballCourtNumber + '&blockContent=' + publicBlock.blockContent + '&id= ' + publicBlock.id + '&shopId=' + publicBlock.shopId + '&createTime=' + publicBlock.createTime + '&blockName=' + publicBlock.blockName + '&discount=' + publicBlock.discount + '&discountContent=' + publicBlock.discountContent + '&discountId=' + publicBlock.discountId + '&code=' + that.data.code + '&totalmoney=' + that.data.totalmoney + '&createTime=' + basketballCourtBlock.createTime + '&lockingTime=' + basketballCourtBlock.lockingTime + '&discountContent=' + publicBlock.discountContent + '&discount=' + publicBlock.discount + '&name=' + publicBlock.blockName + '&time=' + basketballCourtBlock.time + '&time1=' + that.data.time2 + '&availableCoupons=' + availableCoupons
        })
      } else if (res.code == 91) {
        wx.showToast({
          title: '场地信息已过期，请刷新场地重试',
          icon:'none'
        })
      } else {
        wx.showToast({
          title: '请去进行手机授权',
          icon: 'none'
        })
      }
    }).catch(err => {
    })
  },
  // 获取城市code
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
  model2confirm: function (e) {
    var that =this;
    this.setData({ hiddenModal2: true });
  },
  model2cancel: function (e) {
    this.setData({ hiddenModal2: true })
    wx.navigateBack({
      delta: 1,
    })
  },
  mydata:function() {
     
  }
})