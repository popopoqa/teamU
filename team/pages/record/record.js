var app = getApp();
import { request1 } from '../../components/public.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTab:['扫码入场','定位打卡'],
    currentTab:0,
    footCode:0,
    name:'扫码入场'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.entryrecord(that.data.footCode)
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
    var that = this;
    that.entryrecord(that.data.footCode)
    wx.stopPullDownRefresh()
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
  // 获取入场记录
  entryrecord:function(res1) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    request1('post', '/user/shop/findEntryRecord').then(res => {
      if(res.code == 0) {
        if (res1 == 0) {
          that.setData({
            list: res.data.list.reverse()
          })
        } else {
          that.setData ({
            list:''
          })
        }
      }
      wx.hideLoading();
    }).catch(err=>{
      console.log(err)
    })
  },
  currentTab: function (e) {
    var that = this;
    that.data.footCode = e.currentTarget.dataset.idx;
    that.entryrecord(e.currentTarget.dataset.idx);
    if (e.currentTarget.dataset.idx == 0) {
      that.data.name = '扫码入场';
    } else {
      that.data.name = '定位打卡';
    };
    if (that.data.currentTab == e.currentTarget.dataset.idx) {
      return;
    }
    that.setData({
      currentTab: e.currentTarget.dataset.idx,
      name: that.data.name
    })
  }
})