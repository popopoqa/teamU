// 引用百度jsapi
var app = getApp();
var userId;
wx.getStorage({
  key: 'open',
  success: function (res) {
    app.globalData.openId = res.data;
  }
});
wx.getStorage({
  key: 'phone1',
  success: function (res) {
    app.globalData.phone = res.data;
  }
});
wx.getStorage({
  key: 'position1',
  success: function (res) {
    app.globalData.position = res.data;
  }
});
wx.getStorage({
  key: 'userId1',
  success: function (res) {
    userId = res.data;
    app.globalData.userId = res.data;
  }
});
wx.getStorage({
  key: 'latitude',
  success: function (res) {
    app.globalData.latitude = res.data;

  },
});
wx.getStorage({
  key: 'longitude',
  success: function (res) {
    app.globalData.longitude = res.data;
  },
});
// 公共接口部分
const request1 = (methods, url, data) => {
  var userId1;
  if (userId) {
    userId1 = userId;
  } else {
    userId1 = app.globalData.userId
  };
  if (typeof (userId1) == 'object') {
    userId1 = null;
  };
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.server_name + url,
      method: methods,
      header: {
        'token': userId1,
        'content-type': methods.toUpperCase() == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      data: data,
      complete: msg => {
        if (msg.statusCode != 200) {
          reject(msg);
        } else {
          resolve(msg.data);
        }
      }
    })
  })
}

// 加载中接口
module.exports = {
  request1
}
