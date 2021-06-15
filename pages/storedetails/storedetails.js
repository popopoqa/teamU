var app = getApp();
import { request1 } from '../../components/public.js';
var amapFile = require('../../utils/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({ key: 'f82415fbbcfe9ae0bd7a71e9ee0a3fb7' });
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img1: '../../image/basketballmall2.jpg',
    img2: '../../image/youhuijuan.png',
    img3: '../../image/map_icon.png',
    img4: '../../image/lianxifangshi.png',
    img5: '../../image/card.png',
    img6: '../../image/tickets.png',
    img7: '../../image/baochang.png',
    shopId: '',
    latitude: '',
    longitude: '',
    show: false,
    phoneNumber: '',
    name: '',
    address: '',
    id: '',
    userId: '',
    userInfo: '',
    data: '',
    isLogins: '',
    isselected: false,
    latitude1: '',
    longitude1: '',
    disable: false,
    listArray: {},
    city: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'longitude',
      success: function (res) {
        app.globalData.longitude = res.data;
      },
    });
    var that = this;
    that.data.shopId = options.shopId;
    wx.setNavigationBarTitle({
      title: ''
    });
    that.storeInformation();
    that.setData({
      shopId: options.shopId
    });
    wx.getStorage({
      key: 'ytIslogin',
      success: function (res) {
        that.setData({
          isLogin: false
        })
      },
      fail: function (res) {
        that.setData({
          isLogin: true
        })
      }
    });
    if (app.globalData.phone || app.globalData.phone1) {
      that.setData({
        globalData: 'app.globalData.data',
        isselected: false
      })
    }
    wx.getLocation({
      success: (res) => {
        that.data.latitude1 = res.latitude;
        that.data.longitude1 = res.longitude;
        wx.setStorage({
          key: 'latitude',
          data: that.data.latitude1,
          success: function (re) {
            app.globalData.latitude = that.data.latitude1;
          }
        });
        wx.setStorage({
          key: 'longitude',
          data: that.data.longitude1,
          success: function (re) {
            app.globalData.longitude = that.data.longitude1;
          }
        });
      }
    });
    myAmapFun.getRegeo({
      success: function (res) {
        if (res[0].regeocodeData.addressComponent.city.length) {
          that.data.city = res[0].regeocodeData.addressComponent.city;
        } else {
          that.data.city = res[0].regeocodeData.addressComponent.province;
        }
      }
    })
  },
  onShow: function () {
    var that = this;
  },
  onShareAppMessage: function (res) {
    return {
      path: '/pages/storedetails/storedetails/?shopId=' + that.data.shopId,
      success: function (res) {
        console.log('成功', res)
      }
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.storeInformation();
    wx.stopPullDownRefresh();
  },
  // 获取门店信息
  storeInformation: function () {
    var that = this;
    var data = {
      shopId: that.data.shopId,
      userId: app.globalData.userId
    }
    wx.showLoading({
      title: '加载中'
    });
    request1('post', '/user/shop/findByShopId', data).then(res => {
      if (res.code == 0) {
        that.data.latitude = res.data.shop.lat;
        that.data.longitude = res.data.shop.lon;
        var data = res.data;
        that.data.latitude = data.shop.lat;
        that.data.longitude = data.shop.lon;
        that.data.name = data.shop.shopName;
        that.data.address = data.shop.address;
        that.data.phoneNumber = data.shop.legalPersonPhone;
        var card = data.publicSavingsCards;
        var courtList = data.basketballCourtList;
        var id = '';
        if (card.id) {
          id = card[0].id;
        } else {
          id = courtList[0].id;
        }
        for (var i in card) {
          if (card[i].hourlyPrice == card[i].maxConsume && card[i].hourlyPrice == card[i].minConsume) {
            card[i].status = true;
          }
        };
        // 获取畅打卡信息
        var publicTicketList = '';
        for (var j in data.basketballCourtList) {
          if (data.basketballCourtList[j].publicTicketList) {
            if (data.basketballCourtList[j].publicTicketList.length) {
              publicTicketList = data.basketballCourtList[j].publicTicketList;
            }
          }
        };
        for (var i in publicTicketList) {
          let publicticket = publicTicketList[i];
          if (publicticket.startCycle == 1) {
            publicticket.startCycle = '周一'
          };
          if (publicticket.startCycle == 2) {
            publicticket.startCycle = '周二'
          };
          if (publicticket.startCycle == 3) {
            publicticket.startCycle = '周三'
          };
          if (publicticket.startCycle == 4) {
            publicticket.startCycle = '周四'
          };
          if (publicticket.startCycle == 5) {
            publicticket.startCycle = '周五'
          };
          if (publicticket.startCycle == 6) {
            publicticket.startCycle = '周六'
          };
          if (publicticket.startCycle == 7) {
            publicticket.startCycle = '周日'
          };
          if (publicticket.stopCycle == 1) {
            publicticket.stopCycle = '周一'
          };
          if (publicticket.stopCycle == 2) {
            publicticket.stopCycle = '周二'
          };
          if (publicticket.startCycle == 3) {
            publicticket.startCycle = '周三'
          };
          if (publicticket.stopCycle == 4) {
            publicticket.stopCycle = '周四'
          };
          if (publicticket.stopCycle == 5) {
            publicticket.stopCycle = '周五'
          };
          if (publicticket.stopCycle == 6) {
            publicticket.stopCycle = '周六'
          };
          if (publicticket.stopCycle == 7) {
            publicticket.stopCycle = '周日'
          };
          publicticket.startTime = publicticket.startTime.slice(0, 5);
          publicticket.stopTime = publicticket.stopTime.slice(0, 5);
          if (publicticket.startCycle == '周一' && publicticket.stopCycle == '周日') {
            publicticket.describe = '全周'
          } else {
            publicticket.describe = publicticket.startCycle + '到' + publicticket.stopCycle;
          }
        };
        // 获取包场票
        var publicBlockList = '';
        for (var n in data.basketballCourtList) {
          if (data.basketballCourtList[n].publicBlockList.length) {
            publicBlockList = data.basketballCourtList[n].publicBlockList;
          }
        };
        var publicVips = res.data.publicVips;
        var membership = [];
        for (let i in data.publicVips) {
          if (data.publicVips[i].publicVipDetail) {
            membership.push(data.publicVips[i].publicVipDetail)
          }
        };
        that.setData({
          background: data.basketballCourtList,
          name: data.shop.shopName,
          shop: data.shop,
          publicSavingsCards: card,
          publicTicketList: publicTicketList,
          publicBlockList: publicBlockList,
          minPrice: data.minPrice,
          id: id,
          name1: res.data.basketballCourtList[0].name,
          publicVips: publicVips,
          membership: membership
        })
        // 获取位置
        wx.hideLoading()
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 拨打电话
  callGetPhone: function (event) {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.phoneNumber,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  getmsg() {
    var that = this;
    wx.openLocation({
      latitude: + that.data.latitude,
      longitude: + that.data.longitude,
      name: that.data.name,
      address: that.data.address
    })
  },
  bindGetUserInfo: function (e) {
    var that = this;
    that.data.userInfo = e.detail.userInfo;
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
                  var listArray = {};
                  listArray.sessionKey = res.data.authInfo.session_key;
                  listArray.unionId = res.data.authInfo.unionid;
                  listArray.nickName = r.userInfo.nickName;
                  listArray.headImgUrl = r.userInfo.avatarUrl;
                  that.data.listArray = listArray;
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
                    app.globalData.phone = res.data.userInfo.phone;
                    wx.setStorage({
                      key: 'phone1',
                      data: res.data.userInfo.phone,
                      success: function (res) {
                      }
                    });
                    that.setData({
                      globalData: 'app.globalData.data',
                    })
                  } else {
                    that.setData({
                      isselected: true
                    })
                  };
                  that.data.data = res.data.authInfo;
                  app.globalData.data = that.data;
                  wx.setStorage({
                    key: 'open',
                    data: res.data.authInfo.openid,
                    success: function (re) {
                    }
                  });
                  wx.setStorage({
                    key: 'data',
                    data: that.data,
                    success: function (re) {
                    }
                  });
                  wx.setStorage({
                    key: 'ytIslogin',
                    data: that.data,
                    success: function (res) {
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
        }),
          that.setData({
            isLogin: false,
          })
      },
      fail: function (res) {
        wx.showToast({
          title: '请点击登录',
          duration: 3000,
          icon: 'none'
        })
      }
    })
  },
  // 获取用户信息
  getPhoneNumber: function (e) {
    var that = this;
    var page = getCurrentPages();
    var data = app.globalData.data;
    var tempP = app.globalData.longitude + "," + app.globalData.latitude;
    var likeArrays = that.data.listArray;
    var city = that.data.city.slice(0, -1);
    var headImgUrl = likeArrays.headImgUrl;
    var data1 = {
      sessionKey: likeArrays.sessionKey,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      unionId: likeArrays.unionId,
      nickName: data.userInfo.nickName,
      city: city, headImgUrl,
      postion: tempP
    };
    wx.showLoading({
      title: '加载中',
    })
    request1('post', '/user/login/xcx', data1).then(res => {
      console.log(res)
      if (res.code == 0) {
        that.setData({
          isselected: false,
          globalData: 'app.globalData.data'
        });
        if (res.data.user) {
          that.setData({
            isselected: false
          });
          app.globalData.position = res.data.user.postion;
          wx.setStorage({
            key: 'position1',
            data: res.data.user.postion,
            success: function (res) {
            }
          });
          app.globalData.userId = res.data.user.id;
          wx.setStorage({
            key: 'userId1',
            data: res.data.user.id,
            success: function (res) {
            }
          });
          app.globalData.phone = res.data.user.phone;
          wx.setStorage({
            key: 'phone1',
            data: res.data.user.phone,
            success: function (res) {
            }
          })
        };
        wx.hideLoading();
      } else {
        that.setData({
          isselected: true
        });
        wx.showToast({
          title: '请点击绑定手机号',
          duration: 3000,
          icon: 'none'
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  homePage:function() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  admission:function() {
    wx.switchTab({
      url: '../personal/admissionTicket/admissionTicket'
    })
  }
})