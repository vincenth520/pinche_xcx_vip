var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    appInfo: {},
    login: false
  },
  onLoad: function (options) {
    var that = this;
    var vdata = {};
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }
        return false;
      }
    })

    that.setData({
      appInfo: util.wxAppinfo
    });

  },
  bindGetUserInfo: function (e) {
    var that = this;
    var userinfo = e.detail;
    wx.login({
      success: function (res) {
        util.req('customer/login', {
          "code": res.code,
          "encryptedData": userinfo.encryptedData,
          "iv": userinfo.iv
        }, function (data) {
          if (data.msg == '账户被禁用') {
            wx.showModal({
              title: '错误',
              content: '账户被禁用,请联系客户处理',
            })
            return false;
          }
          app.setUserInfo(data.data.user);
          app.setSk(data.data.sk);
          wx.reLaunch({
            url: '/pages/index/index',
          })
        })
      }
    })
  }
})