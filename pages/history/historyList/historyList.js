var app = getApp();
import { request1 } from '../../../components/public.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTab: ['个人票', '包场券', '会员卡'],
    currentTab: 0,
    blockDtoList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.historyTicket('1')
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
  currentTab: function (e) {
    let that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.idx,
    })
    that.historyTicket(Number(e.currentTarget.dataset.idx) + 1)
  },
  historyTicket:function (idx) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    });
    let data = {
      type: idx
    }
    request1('post', '/user/shop/findCompletedTicket', data).then(res => {
      if (res.code == 0) {
        wx.hideLoading()
        if(idx == '1') {
          that.setData({
            blockDtoList:  res.data.ticketList
          })
        } else if(idx == '2') {
          that.setData({
            blockDtoList:  res.data.blockDtoList
          })
        } else if(idx == '3') {
          that.setData({
            blockDtoList:  res.data.vipList
          })
        }
      } else {
        wx.showToast({
          title: '数据异常',
          icon: 'none',
          duration: 2000 //持续的时间
        })
      }
    })
  }
})