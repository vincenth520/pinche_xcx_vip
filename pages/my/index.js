//index.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');

Page({
  onShow: function () {
    var that = this;
    that.setData({
      userInfo:app.globalData.userInfo
    });

    util.req('info/mycount',{sk:app.globalData.sk},function(data){
      that.setData({infoCount:data.data});
    })

    util.req('appointment/mycount', { sk: app.globalData.sk }, function (data) {
      that.setData({ appointmentCount: data.data });
    })

    if (app.globalData.userInfo.driver == 1){
      var driverMessage = '已认证';
    } else if (app.globalData.userInfo.driver == -1) {
      var driverMessage = '认证失败';
    } else if (app.globalData.userInfo.driver == 2) {
      var driverMessage = '等待认证';
    }else{
      var driverMessage = '';
    }
    this.setData({ driverMessage: driverMessage});
  },
  data:{
    driverMessage:''
  }

})
