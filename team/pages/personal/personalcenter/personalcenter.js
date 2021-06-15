var app = getApp();
import { request1 } from '../../../components/public.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isselected: false,
    userId: '',
    data: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      url: 'pages/personal/personalcenter/personalcenter',
    })
    wx.setNavigationBarTitle({
      title: '个人中心',
    });
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    };
    wx.getStorage({
      key: 'ytIslogin',
      success: function (res) {
        that.data.data = res.data;
      },
    });
  },
  onShow: function () {
    var that = this;
    if (app.globalData.userId) {
      that.setData({
        globalData: 'app.globalData.data'
      });
      that.msg();
    };
  },
  // 页面下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.onLoad();
    wx.stopPullDownRefresh();
  },
  msg: function () {
    var that = this;
    var data = {
      coverUserId: app.globalData.userId
    };
    wx.showLoading({
      title: '加载中',
    })
    request1('post', '/user/userInfo', data).then(res => {
      if (res.code == 0) {
        var list = res.data;
        var configLV = list.configLV;
        var percent = ((configLV.startExp / configLV.stopExp) * 100).toFixed(2);
        that.setData({
          configLV: configLV,
          user: list.user,
          userAchievementList: list.userAchievementList,
          percent: percent
        });
        wx.hideLoading()
      }
    }).catch(err => {
      console.log(err)
    })
  },
  model: function () {
    wx.showToast({
      title: '请去app内查看',
      icon: 'none'
    })
  }
})
