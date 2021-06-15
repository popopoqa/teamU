var app = getApp();
import { request1 } from '../../../components/public.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img1: '../../../image/yhq.png',
    img2: '../../../image/ysy.png',
    navTab: ['全部门票', '个人票', '包场券', '会员卡'],
    currentTab: 0,
    footCode: 0,
    isselected: false,
    latitude: '',
    longitude: '',
    loadData: '',
    loadPhone: '',
    data: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'ytIslogin',
      success: function (res) {
        that.data.loadData = res.data;
      },
    });
    wx.getStorage({
      key: 'data',
      success: function (res) {
        that.data.data = res.data;
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShow: function () {
    var that = this;
    if (app.globalData.userId) {
      that.setData({
        globalData: 'app.globalData.data'
      });
      that.obtain();
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.onLoad()
    wx.stopPullDownRefresh();
  },
  currentTab: function (e) {
    var that = this;
    that.data.footCode = e.currentTarget.dataset.idx;
    that.obtain()
    if (that.data.currentTab == e.currentTarget.dataset.idx) {
      return;
    }
    that.setData({
      currentTab: e.currentTarget.dataset.idx,
    })
  },

  // 获取数据
  obtain: function (res) {
    var that = this;
    var data;
    // 重新写部分
    if (app.globalData.position) {
      var position = app.globalData.position;
      position = position.split(',');
      var lon;
      var lat;
      if (position[0] == 'undefined') {
        lon = false;
      } else {
        lon = position[0];
      };
      if (position[1] == 'undefined') {
        lat = false;
      } else {
        lat = position[1];
      }
    };
    if (that.data.footCode == 0) {
      if (app.globalData.position && lon && lat) {
        data = {
          position: app.globalData.position,
          userId: app.globalData.userId
        }
      } else {
        data = {
          position: app.globalData.longitude + ',' + app.globalData.latitude,
          userId: app.globalData.userId
        }
      }
    } else {
      if (app.globalData.position && lon && lat) {
        data = {
          position: app.globalData.position,
          type: that.data.footCode,
          userId: app.globalData.userId
        }
      } else {
        data = {
          position: app.globalData.longitude + ',' + app.globalData.latitude,
          type: that.data.footCode,
          userId: app.globalData.userId
        }
      }
    };
    wx.showLoading({
      title: '加载中',
    });
    request1('post', '/user/shop/findTicket', data).then(res => {
      if (res.code == 0) {
        var list = res.data.list;
        for (var i in list) {
          var distance = list[i].distance;
          list[i].distance = distance + 'km';
          // 获取入场时间
          var ticketList = list[i].ticketList;
          for (var j in ticketList) {
            var tickets = ticketList[j];
            // 判断有效日期
            if (tickets.startCycle == 1) {
              tickets.startCycle = '周一'
            };
            if (tickets.startCycle == 2) {
              tickets.startCycle = '周二'
            };
            if (tickets.startCycle == 3) {
              tickets.startCycle = '周三'
            };
            if (tickets.startCycle == 4) {
              tickets.startCycle = '周四'
            };
            if (tickets.startCycle == 5) {
              tickets.startCycle = '周五'
            };
            if (tickets.startCycle == 6) {
              tickets.startCycle = '周六'
            };
            if (tickets.startCycle == 7) {
              tickets.startCycle = '周日'
            };
            if (tickets.stopCycle == 1) {
              tickets.stopCycle = '周一'
            };
            if (tickets.stopCycle == 2) {
              tickets.stopCycle = '周二'
            };
            if (tickets.startCycle == 3) {
              tickets.startCycle = '周三'
            };
            if (tickets.stopCycle == 4) {
              tickets.stopCycle = '周四'
            };
            if (tickets.stopCycle == 5) {
              tickets.stopCycle = '周五'
            };
            if (tickets.stopCycle == 6) {
              tickets.stopCycle = '周六'
            };
            if (tickets.stopCycle == 7) {
              tickets.stopCycle = '周日'
            };
            tickets.startTime = tickets.startTime.slice(0, 5);
            tickets.stopTime = tickets.stopTime.slice(0, 5);
            tickets.describe = tickets.startCycle + '到' + tickets.stopCycle + tickets.startTime + '至' + tickets.stopTime;
          }
        };
        that.setData({
          list: list,
          type: that.data.footCode
        });
        wx.hideLoading()
      } else {
        console.log(res)
      }
    }).catch(err => {
      console.log(err)
    })
  }
})