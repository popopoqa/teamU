// pages/first/first.js
var app = getApp();
import { request1 } from '../../components/public.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img3: '../../image/xcx.png',
    latitude: '',
    longitude: '',
    storage: '',
    code: '',
    data: '',
    nickName: '',
    userInfo: '',
    disable: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getLocation({
      success: (res) => {
        that.data.latitude = res.latitude;
        that.data.longitude = res.longitude;
        wx.setStorage({
          key: 'latitude',
          data: that.data.latitude,
          success: function (re) {
            app.globalData.latitude = that.data.latitude;
          }
        });
        wx.setStorage({
          key: 'longitude',
          data: that.data.longitude,
          success: function (re) {
            app.globalData.longitude = that.data.longitude;
          }
        });
      }
    });
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
  bindGetUserInfo: function (e) {
    var that = this;
    wx.getUserInfo({
      success: function (r) {
        that.data.nickName = r.rawData;
        wx.login({
          success(res) {
            if (res.code) {
              var data = {
                code: res.code,
                encryptedData: r.encryptedData,
                iv: r.iv
              };
              wx.showLoading({
                title: '加载中',
              })
              request1('post', '/user/login/xcx/getAuthInfo', data).then(res => {
                if (res.code == 0) {
                  if (res.data.userInfo) {
                    app.globalData.position = res.data.userInfo.postion;
                    wx.setStorage({
                      key: 'position1',
                      data: res.data.userInfo.postion,
                      success: function (res) {
                      }
                    });
                    app.globalData.userId = res.data.userInfo.id;
                    wx.setStorage({
                      key: 'userId1',
                      data: res.data.userInfo.id,
                      success: function (res) {
                      }
                    });
                    wx.setStorage({
                      key: 'userId2',
                      data: res.data.userInfo.id,
                      success: function (res) {
                      }
                    });
                    app.globalData.phone = res.data.userInfo.phone;
                    wx.setStorage({
                      key: 'phone1',
                      data: res.data.userInfo.phone,
                      success: function (res) {
                      }
                    })
                  };
                  that.data.data = res.data.authInfo;
                  app.globalData.data = that.data;
                  wx.setStorage({
                    key: 'data',
                    data: that.data,
                    success: function (re) {
                    }
                  });
                  wx.setStorage({
                    key: 'open',
                    data: res.data.authInfo.openid,
                    success: function (re) {
                    }
                  });
                  app.globalData.curdata = {
                    sessionKey: res.data.authInfo.session_key,
                    unionId: res.data.authInfo.unionid,
                    nickName: r.userInfo.nickName,
                    headImgUrl: r.userInfo.avatarUrl
                  };
                  wx.setStorage({
                    key: 'ytIslogin',
                    data: that.data,
                    success: function (re) {
                      wx.switchTab ({
                        url: '../index/index',
                        success: function (e) {
                          let page = getCurrentPages().pop();
                          if (page == undefined || page == null) {
                            return
                          }
                          page.onLoad();
                        }
                      })
                    }
                  });
                  wx.hideLoading();
                  that.setData({
                    disable: true
                  })
                } else {
                  console.log(res)
                }
              }).catch(err => {
                console.log(err)
                that.setData({
                  disable: false
                })
              })
            }
          }
        })
      },
      fail: function (res) {
        wx.navigateTo({
          url: '../index/index',
        })
      }
    })
  }
})




