// pages/search/search.js
var app = getApp();
import { request1 } from '../../components/public.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    that.data.city = options.city;
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
  shopName:function(e) {
    var that = this;
    if (e.detail.value.length) {
      var data = {
        name: e.detail.value,
        city: that.data.city
      }
      wx.showLoading({
        title: '加载中',
      })
      request1('post', '/user/shop/findByName', data).then(res => {
        console.log(res)
        if (res.code == 0) {
          that.setData({
            list: res.data.list
          })
        }
        wx.hideLoading()
      }).catch(err => {
        console.log(err)
      })
    } else {
      return false;
    }
  }
})