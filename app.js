//app.js
App({
  // 全局变量
  globalData: {
    server_name: 'https://teamyou.cn',
    // server_name: 'https://interface.teamyou',
    // server_name: 'http://192.168.0.110',
    // server_name: 'http://192.168.0.143',
    appid: 'wx03a11e51a87d8fff',
    secret:'1ebc1c100769edb06984a9d14fd56804',
    openId:'',
    userId:'',
    latitude: '',
    longitude: '',
    openId1: '',
    phone: '',
    position:'',
    data:'',
    curdata:''
  },
  // 是否要重新登录
  onLaunch() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索或扫码打开哟~'
            })
          })
        }
      })
    }
  }
});

