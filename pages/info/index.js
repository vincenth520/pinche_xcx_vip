// pages/info/index.js
var util = require('../../utils/util.js');
var app = getApp();
var page = 1;
var comment = new Array();
var isBuzy = false;
Page({
  data: {
    'data.id': 0,
    'back': false,
    'nomore': false,
    'shoucang': false,
    'notme': false,
    'modalFlag': false
  },
  tel: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.data.phone
    })
  },
  tocomment: function () {
    this.setData({ toview: 'comment_list' });
  },
  zan: function (event) {
    var that = this;
    var Commentdata = this.data.comment;
    util.req('comment/zan', {
      'comment_id': Commentdata[event.currentTarget.id].id
    }, function (data) {
      if (data.status) {
        Commentdata[event.currentTarget.id].zan = data.data;
        if (data.msg == '点赞成功') {
          Commentdata[event.currentTarget.id].iszan = true;
        } else {
          Commentdata[event.currentTarget.id].iszan = false;
        }
        that.setData({ comment: Commentdata });
      } else {
        console.log(data.msg);
        wx.showModal({
          title: '提示',
          content: data.msg,
          showCancel: false,
          success: function (res) {
          }
        });
      }
    })
  },
  shoucang: function () {
    var that = this;
    util.req('fav/addfav', { info_id: that.data.data.id }, function (data) {
      if (data.status) {
        that.setData({ 'shoucang': data.data });
        wx.showToast({
          title: data.msg,
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  qxshoucang: function () {
    var that = this;
    util.req('fav/delfav', { id: that.data.shoucang }, function (data) {
      if (data.status) {
        that.setData({ 'shoucang': false });
        wx.showToast({
          title: data.msg,
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  madal: function () {
    console.log(app.globalData.userInfo.phone);
    if (app.globalData.userInfo.phone == null || app.globalData.userInfo.phone == ''){
      wx.showModal({
        title: '错误',
        content: '请先进行个人信息认证',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/my/info'
            })
          }
        }
      })
      return false;
    }
    this.setData({ modalFlag: true });
  },
  modalOk: function () {
    this.setData({ modalFlag: false });
  },
  appointment: function (e) {
    var fId = e.detail.formId;
    var that = this;
    console.log(e.detail.value.surplus);
    if (e.detail.value.name == '') {
      util.isError('请输入姓名', that);
      return false;
    }
    if (e.detail.value.phone == '') {
      util.isError('请输入手机号', that);
      return false;
    }
    if (!(/^1[34578]\d{9}$/.test(e.detail.value.phone))) {
      util.isError('手机号码错误', that);
      return false;
    }
    if (e.detail.value.surplus == 0) {
      util.isError('请选择人数', that);
      return false;
    }
    util.clearError(that);
    util.req('appointment/add', {info_id: this.data.data.id, name: e.detail.value.name, phone: e.detail.value.phone, surplus: e.detail.value.surplus }, function (data) {
      console.log(data);
      if (data.status) {
        that.setData({ modalFlag: false });
        wx.showToast({
          title: '预约成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        that.setData({ modalFlag: false });
        util.isError(data.msg, that);
        return false;
      }
    })
  },
  setsurplus: function (e) {
    this.setData({ surplus: e.detail.value })
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ height: res.windowHeight });
      }
    })

    that.setData({
      'userInfo.gender': app.globalData.userInfo.gender,
      'userInfo.name': (app.globalData.userInfo.name == '') ? app.globalData.userInfo.nickName : app.globalData.userInfo.name,
      'userInfo.phone': app.globalData.userInfo.phone
    })

    util.req('fav/isfav', { info_id: options.id }, function (data) {
      if (data.data != 0) {
        that.setData({ 'shoucang': data.data });
      }
    })

    util.req('info/index', { id: options.id }, function (data) {
      var reg = new RegExp("null", "g");
      data.data.remark = (data.data.remark + '').replace(reg, "");
      that.setData({ data: data.data });
      if (data.data.user_id == app.globalData.userInfo.id) {
        var notme = false;
      } else {
        var notme = true;
      }
      var Surpluss = new Array('请选择人数');
      for (var i = 1; i <= data.data.surplus; i++) {
        Surpluss.push(i);
      }
      var time = data.data.leave_time;
      if (data.data.mode == '2') {
        var time = data.data.leave_time.split(' ')[1];
        var day = new Date();
        var now = util.dateFtt('hh:mm:ss', new Date());
        if (time < now) {
          time = util.dateFtt('yyyy-MM-dd ', new Date(day.getTime() + 24 * 60 * 60 * 1000)) + time;
        } else {
          time = util.dateFtt('yyyy-MM-dd ', new Date()) + time;
        }
      }
      that.setData({
        'data.tm': time,
        'data.price': (data.data.price == null) ? '面议' : data.data.price,
        'data.gender': data.data.gender,
        'notme': notme,
        'Surpluss': Surpluss,
        'surplus': 0
      });
    })
    page = 1;
    this.getCount(options.id);
    this.getComment(options.id);
    if (getCurrentPages().length == 1) {
      that.setData({ 'back': true });
    }
  },
  previmg: function (e) {
    var that = this;
    wx.previewImage({
      current: that.data.comment[e.target.dataset.iid].img[e.target.dataset.id],
      urls: that.data.comment[e.target.dataset.iid].img,
    })
  },
  getComment: function (id) {
    var that = this;
    if (that.data.nomore || isBuzy) {
      return false;
    }
    isBuzy = true;
    util.req('comment/get', { id: id, type: 'info', page: page }, function (data) {
      if (page == 1) {
          comment = new Array();
      }
      isBuzy = false;
      data.data.forEach(function (item) {
        comment.push({
          id: item.id,
          avatarUrl: item.avatarUrl,
          content: item.content,
          fid: item.fid,
          nickName: item.nickName,
          img: JSON.parse(item.img),
          zan: item.zan,
          reply: item.reply,
          time: util.getDateBiff(Date.parse(new Date(item.updated_at)))
        })
      })
        
        if (page >= data.last_page){
          that.setData({ 'nomore': true });
        }
        that.setData({ comment: comment });
    })
  },
  toIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  onShareAppMessage: function () {
    return {
      title: '拼车详情',
      path: 'pages/info/index?id=' + this.data.data.id
    }
  },
  getCount: function (id) {
    var that = this;
    util.req('comment/get_count', { id: id, type: 'info' }, function (data) {  //获取评论总数
      if (data.status == 1) {
        that.setData({ comnum: data.data });
      }
    })
  },
  onShow: function () {
    page = 1;
    comment = new Array();
    console.log('页面重新打开');
    this.setData({'nomore':false});
    if (this.data.data) {
      this.getCount(this.data.data.id);
      this.getComment(this.data.data.id);
    }
  },
  tobottom: function () {
    if (!this.data.nomore) {
      page++;
      this.getComment(this.data.data.id);
    }
  },
  opendepartureTopSet: function () {
    var that = this;
    var res = JSON.parse(that.data.data.departureTopSet);
    wx.openLocation({
      latitude: res.latitude, // 纬度，范围为-90~90，负数表示南纬  
      longitude: res.longitude, // 经度，范围为-180~180，负数表示西经  
      scale: 28, // 缩放比例  
      name: that.data.data.departure            
    })
  },
  opendestinationTopSet: function () {
    var that = this;
    var res = JSON.parse(that.data.data.destinationTopSet);
    wx.openLocation({
      latitude: res.latitude, // 纬度，范围为-90~90，负数表示南纬  
      longitude: res.longitude, // 经度，范围为-180~180，负数表示西经  
      scale: 28, // 缩放比例   
      name: that.data.data.destination  
    })
  } 
})