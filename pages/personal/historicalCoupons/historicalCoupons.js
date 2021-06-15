// pages/personal/coupon/coupon.js
var app = getApp();
import { request1 } from '../../../components/public.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [1, 2]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var data = new Date();
    var year = data.getFullYear();
    var month = data.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    };
    var day = data.getDate();
    if (day < 10) {
      day = '0' + day;
    };
    var time = year + '-' + month + '-' + day + ' ' + '23' + ':' + '01' + ':' + '01';
    that.setData({
      time: time
    });
    that.obtain()
  },

  


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.obtain();
    wx.stopPullDownRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 获取已领取的优惠券
  obtain: function () {
    var that = this;
    var data = {
      used: true
    }
    wx.showLoading({
      title: '加载中',
    })
    request1('post', '/user/shop/findUserCoupons', data).then(res => {
      if (res.code == 0) {
        that.setData({
          list: res.data.list
        });
        wx.hideLoading()
      }
    }).catch(err => {
      console.log(err)
    })
  }
})