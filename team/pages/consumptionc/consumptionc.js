// pages/consumptionc/consumptionc.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var pages = getCurrentPages();
    var walletRecords = pages[pages.length - 2].data.walletRecords;
    for (var i in walletRecords) {
      var wall = walletRecords[i].recordTime.slice(11);
      walletRecords[i].mintime = wall;
      var record = walletRecords[i].recordTime.slice(0,10).replace('-','年');
      record = record.replace('-','月') + '日';
      walletRecords[i].maxtime = record;
    }
    console.log(walletRecords)
    that.setData({
      walletRecords: walletRecords
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

  }
})