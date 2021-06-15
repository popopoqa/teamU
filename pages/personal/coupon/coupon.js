// pages/personal/coupon/coupon.js
var app = getApp();
import { request1 } from '../../../components/public.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[1,2],
    checked:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.obtain()
  },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    var that = this;
    that.obtain();
    wx.stopPullDownRefresh()
  },
  // 获取已领取的优惠券
  obtain:function() {
    var that = this;
    var data = {
      used:false,
      userId: app.globalData.userId
    }
    wx.showLoading({
      title: '加载中',
    })
    request1('post', '/user/shop/findUserCoupons',data).then(res => {
      if(res.code == 0) {
        that.setData({
          list: res.data.list
        })
        wx.hideLoading()
      }
    }).catch(err=>{
      consoel.log(err)
    })
  },
  confirm:function() {
    wx.showToast({
      title: '优惠券请到app里面领取并使用',
      icon: 'none'
    })
  },
 
  modelcancel:function() {
    wx.navigateBack({
      delta:1
    })
  },
  modelconfirm:function() {
    
  }
})