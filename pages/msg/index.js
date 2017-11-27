// pages/msg/index.js
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{},
  msg:function(){
    var that = this;
    util.req('msg/getall', { sk: app.globalData.sk }, function (data) {
      var zan = 0;
      var comment = 0;
      var notice = 0;
      
      var data = { zan: (data.data.zan ? data.data.zan : 0), comment: (data.data.comment ? data.data.comment : 0), notice: (data.data.notice ? data.data.notice : 0) };
      that.setData({ data: data });
  })
  },
  onShow: function () {
    this.msg();
  },
  onPullDownRefresh: function () {
    this.msg();
    wx.stopPullDownRefresh();
  },

})