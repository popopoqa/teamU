var app = getApp();
import { request1 } from '../../../components/public.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=195724073,2965601894&fm=26&gp=0.jpg',
    ballCourtTicketDto:{
    },
    userEntryRecord: {
    },
    blockList:[],
    walletRecords:[],
    currentIdx:'',
    balance:'10'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      currentIdx: options.currentTab
    })
    let data = {
      ticketNo: options.ticketNo,
      type: Number(options.currentTab) + 1,
      shopId: options.shopId
    };
    wx.showLoading({
      title: '加载中',
    });
    request1('post', '/user/shop/findTicketDetail', data).then(res => {
      if (res.code == 0) {
        wx.hideLoading()
        that.setData ({
          ballCourtTicketDto: res.data.ballCourtTicketDto ? res.data.ballCourtTicketDto : {},
          userEntryRecord: res.data.userEntryRecord ? res.data.userEntryRecord : {},
          blockList: res.data.blockList ? res.data.blockList : [],
          balance: res.data.balance ? res.data.balance : '',
          walletRecords:res.data.walletRecords ? res.data.walletRecords : []
        })
      } else {
        wx.showToast({
          title: '数据异常',
          icon: 'none',
          duration: 2000 //持续的时间
        })
      }
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
  callphone:function() {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.ballCourtTicketDto.shopPhone
    })
  },
})