var app = getApp();
import { request1 } from '../../components/public.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.obtain();
    wx.setNavigationBarTitle({
      title: '优惠券'
    })
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
  revert:function() {
    var that = this;
    wx.showToast({
      title: '请到app里面领取并使用',
      icon: 'none'
    });
  },
  // 获取已领取的优惠券
  obtain: function () {
    var that = this;
    var data = {
      used: false
    };
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
      consoel.log(err)
    })
  },
  recurrence:function() {
    var that = this;
    that.data.option = true;
    that.setData({
      option: that.data.option
    })
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
    }, 2000);
  }
})