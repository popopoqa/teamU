var app = getApp();
import { request1 } from '../../components/public.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    isShow:true,
    options:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.options = options;
    that.couponList(options)
  },

  onPullDownRefresh: function () {
    var that = this;
    that.couponList(that.data.options);
    wx.stopPullDownRefresh();
  },
  // 获取优惠券列表
  couponList:function(res) {
    var that = this;
    var data = {
      shopId: res.shopId
    };
    wx.showLoading({
      title: '加载中',
    })
    request1('post', '/user/shop/findCoupons', data).then(res => {
      console.log(res)
      if(res.code == 0) {
        that.setData({
          list:res.data.list
        })
      }
      wx.hideLoading()
    }).catch(err =>{
      console.log(err)
    })
  },
  // 领取优惠券
  getCoupons:function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id)
    var data = {
      couponsId:id
    };
    request1('post', '/user/shop/receiveCoupons', data).then(res => {
      if(res.code == 0) {
        console.log(res)
        that.setData ({
          isShow:false
        })
      }
    }).catch(err=>{
      console.log(err)
    })
  }
})