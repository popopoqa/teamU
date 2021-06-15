var app = getApp();
import { request1 } from '../../components/public.js';
var city = require('../../libs/city.js');
var amapFile = require('../../utils/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({ key: 'f82415fbbcfe9ae0bd7a71e9ee0a3fb7' });
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    img1: '../../image/basketballmall2.jpg',
    img2: '../../image/yhq.png',
    img3: '../../image/xcx.png',
    img4: '../../image/hongbao.png',
    num: true,
    isReceive: false,
    isCover: false,
    cityData: {},
    _py: ["hot", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"],
    isAppear: true,
    hidden: true,
    qrCode: '../../image/erweima.png',
    headPortrait: '',
    data: '',
    iselection: false,
    isselected: false,
    latitude: '',
    longitude: '',
    pages: 1,
    stadiumList: [],
    nowSelected: '',
    options: '',
    citySelected: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    that.data.options = app.globalData.curdata;
    wx.setNavigationBarTitle({
      title: '球场'
    });
    wx.getStorage({
      key: 'latitude',
      success: function (res) {
        that.data.latitude = res.data;
      },
    });
    wx.getStorage({
      key: 'longitude',
      success: function (res) {
        that.data.longitude = res.data;
      },
    })
    if (app.globalData.latitude && app.globalData.longitude) {
      that.setData({
        cityData: city.all,
        hotCityData: city.hot,
        lat: app.globalData.latitude,
        lon: app.globalData.longitude
      });
    } else {
      that.setData({
        cityData: city.all,
        hotCityData: city.hot,
        lat: that.data.latitude,
        lon: that.data.longitude
      });
    };
    if (app.globalData.curdata.sessionKey && !app.globalData.phone) {
      that.setData({
        isselected: true
      });
      wx.hideTabBar();
    } else {
      that.setData({
        isselected: false
      })
    };
    myAmapFun.getRegeo({
      success: function (res) {
        if (res[0].regeocodeData.addressComponent.city.length) {
          that.data.citySelected = res[0].regeocodeData.addressComponent.city;
        } else {
          that.data.citySelected = res[0].regeocodeData.addressComponent.province;
        };
        //成功回调
        var obj = {
          fullname: that.data.citySelected,
          lat: res[0].latitude,
          lng: res[0].longitude
        };
        that.data.nowSelected = obj;
        that.setData({
          citySelected: that.data.citySelected,
          city: that.data.citySelected
        });
        that.stadiumlist(that.data.nowSelected);
        that.currentCity(obj)
      },
      fail: function (info) {
        console.log(info)
        wx.navigateTo({
          url: '../allocation/allocation',
        })
      }
    });
    that.query(app.globalData.userId);
  },
  onShow: function () {
  },
  onPullDownRefresh: function () {
    var that = this;
    that.stadiumlist(that.data.nowSelected);
    that.data.pages = 1;
    wx.stopPullDownRefresh()
  },
  // 判断是否有优惠券
  coupon: function () {
    var that = this;
    wx.showLoading({
      title: '加载中'
    });
    request1('post', '/user/shop/findUserCouponsByType').then(res => {
      wx.hideLoading()
      if (res.data.list.length) {
        that.setData({
          isReceive: true
        })
      } else {
        that.setData({
          isReceive: false
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 点击使用优惠券
  confirm: function () {
    var that = this;
    that.setData({
      isReceive: false
    })
  },
  stamp: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var time = Y + '-' + M + '-' + D + ' ' + '23: 01:00';
    that.setData({
      time: time
    })
  },
  openCityList: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.setNavigationBarTitle({
      title: '城市列表'
    });
    that.setData({
      isAppear: !that.data.isAppear
    });
    wx.hideLoading()
  },
  // 选择城市列表
  selectCity: function (e) {
    var that = this;
    var dataset = e.currentTarget.dataset;
    that.data.nowSelected = dataset;
    that.data.city = dataset.fullname;
    that.stadiumlist(that.data.nowSelected);
    that.setData({
      citySelected: dataset.fullname,
      isAppear: !that.data.isAppear,
      location: {
        latitude: dataset.lat,
        longitude: dataset.lng
      }
    });
    if (dataset) {
      that.currentCity(dataset)
    };
    wx.setNavigationBarTitle({
      title: '球场'
    });
    that.data.pages = 1;
  },
  // 当前城市
  currentCity: function (res) {
    var that = this;
    if (res.fullname) {
      that.setData({
        citySelected: res.fullname,
        isAppear: true,
        location: {
          latitude: res.lat,
          longitude: res.lng
        }
      })
    } else {
      that.setData({
        citySelected: res.currentTarget.dataset.fullname,
        isAppear: true,
        location: {
          latitude: res.lat,
          longitude: res.lng
        }
      })
    };
    wx.setNavigationBarTitle({
      title: '球场'
    });
  },
  locationCity: function (e) {
    var that = this;
    var dataset = e.currentTarget.dataset;
    that.stadiumlist(dataset);
    console.log(dataset)
    that.setData({
      citySelected: dataset.fullname,
      isAppear: true,
      location: {
        latitude: dataset.lat,
        longitude: dataset.lng
      }
    });
    wx.setNavigationBarTitle({
      title: '球场'
    });
  },
  //获取文字信息
  getPy: function (e) {
    this.setData({
      hidden: false,
      showPy: e.target.id
    })
  },
  setPy: function (e) {
    console.log(this.data.showPy)
    this.setData({
      hidden: true,
      scrollTopId: this.data.showPy
    })
  },

  //滑动选择城市
  tMove: function (e) {
    var y = e.touches[0].clientY,
      offsettop = e.currentTarget.offsetTop;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      var num = parseInt((y - offsettop) / 12);
      this.setData({
        showPy: this.data._py[num]
      })
    };
  },
  //触发全部开始选择
  tStart: function () {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd: function () {
    console.log(this.data.showPy)
    this.setData({
      hidden: true,
      scrollTopId: this.data.showPy
    })
  },
  // 获取球场列表
  stadiumlist(res) {
    var that = this;
    if (res.result) {
      wx.showLoading({
        title: '加载中',
      });
      var data = {
        sortType: 1,
        city: res.result.ad_info.city,
        lat: res.result.ad_info.location.lat,
        lon: res.result.ad_info.location.lng,
        page: 1
      };
      request1('post', '/user/shop/findShop2', data).then(res => {
        console.log(res)
        if (res.code == 0) {
          wx.hideLoading()
          console.log(res.data)
          var stadiumList = res.data.list;
          for (var i in stadiumList) {
            that.data.stadiumList.push(stadiumList[i])
          }
          console.log(that.data.stadiumList)
          that.setData({
            stadiumList: stadiumList
          })
        };

      }).catch(err => {
        console.log(err)
      })
    } else {
      var data = {
        sortType: 1,
        city: res.fullname,
        lat: res.lat,
        lon: res.lng,
        page: 1
      };
      wx.showLoading({
        title: '加载中',
      });

      request1('post', '/user/shop/findShop2', data).then(res => {
        if (res.code == 0) {
          wx.hideLoading()
          var stadiumList = res.data.list;
          for (var i in stadiumList) {
            that.data.stadiumList.push(stadiumList[i])
          };
          that.setData({
            stadiumList: stadiumList
          })
        }
      }).catch(err => {
        console.log(err)
      })

    }
  },
  stadiumlist1(res, pages) {
    var that = this;
    if (res.result) {
      wx.showLoading({
        title: '加载中',
      });
      var data = {
        sortType: 1,
        city: res.result.ad_info.city,
        lat: res.result.ad_info.location.lat,
        lon: res.result.ad_info.location.lng,
        page: pages
      };
      request1('post', '/user/shop/findShop2', data).then(res => {
        if (res.code == 0) {
          wx.hideLoading()
          console.log(res.data)
          var stadiumList = res.data.list;
          for (var i in stadiumList) {
            that.data.stadiumList.push(stadiumList[i])
          };
          that.setData({
            stadiumList: that.data.stadiumList
          })
        };

      }).catch(err => {
        console.log(err)
      })
    } else {
      var data = {
        sortType: 1,
        city: res.fullname,
        lat: res.lat,
        lon: res.lng,
        page: pages
      };
      wx.showLoading({
        title: '加载中',
      });
      request1('post', '/user/shop/findShop2', data).then(res => {
        if (res.code == 0) {
          wx.hideLoading();
          var stadiumList = res.data.list;
          for (var i in stadiumList) {
            that.data.stadiumList.push(stadiumList[i])
          };
          that.setData({
            stadiumList: that.data.stadiumList
          })
        }
      }).catch(err => {
        console.log(err)
      })

    }
  },
  // 上拉加载
  onReachBottom: function () {
    var that = this;
    var pages = ++that.data.pages;
    wx.showLoading({
      title: '玩命加载中',
    });
    that.stadiumlist1(that.data.nowSelected, pages, that.data.stadiumList);
    that.currentCity(that.data.nowSelected);
    wx.hideLoading()
  },

  // 查询banner
  query: function (res) {
    var that = this;
    if (app.globalData.data) {
      var data = {
        type: 2,
        userId: res
      }
    } else {
      var data = {
        type: 2,
        userId: -1
      };
    }
    request1('post', '/highlights/findBanner', data).then(res => {
      if (res.code == 0) {
        var list = res.data.list;
        for (var i in list) {
          var url = list[i].url;
          list[i].url = url.replace('order/court_detail.html', '../storedetails/storedetails').replace('order/store_detail.html', '../storedetails/storedetails')
        }
        that.setData({
          list: list
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  launchAppError: function () {
  },
  // 是否要遮盖层
  election: function () {
    var that = this;
    that.setData({
      iselection: true
    })
  },
  // 点击取消之后
  after: function () {
    var that = this;
    that.setData({
      iselection: false
    })
  },
  toCollect: function () {
    var that = this;
    that.setData({
      iselection: false
    })
  },
  // 获取用户信息
  getPhoneNumber: function (e) {
    var that = this;
    var options = that.data.options;
    var tempP = app.globalData.longitude + "," + app.globalData.latitude;
    var headImgUrl = options.headImgUrl;
    var city = that.data.citySelected.slice(0, -1);
    var data1 = {
      sessionKey: options.sessionKey,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      unionId: options.unionId,
      nickName: options.nickName,
      city: city, headImgUrl,
      postion: tempP
    };
    wx.showLoading({
      title: '加载中',
    })
    request1('post', '/user/login/xcx', data1).then(res => {
      if (res.code == 0) {
        wx.showTabBar();
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
        });
        wx.hideLoading();
        that.stamp();
        that.coupon();
        that.query(app.globalData.userId);
      } else {
        console.log(res)
      }
    }).catch(err => {
      console.log(err)
      that.setData({
        isselected: false
      })
    })
  }
})