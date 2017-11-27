// pages/index/ad.js
var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');
Page({
  data: {
  
  },
  onLoad: function (options) {
    var that = this;
    util.getReq('article/' + options.id,[],function(data){
      if(data.status){
        var article = `<h2 style="text-align:center">${data.data.title}</h2>`;
        article += data.data.content;
        WxParse.wxParse('article', 'html', article, that, 5);
      }
    })


  }
})