// pages/info/add.js
var util = require('../../utils/util.js');  
var app = getApp();
var today = util.formatTime(new Date((new Date()).getTime() + (1000 * 60 * 60 * 24 * 1))).split(' ')[0];
var minday = util.formatTime(new Date()).split(' ')[0];
var maxday =  util.formatTime(new Date((new Date()).getTime()+(1000*60*60*24*62))).split(' ')[0];

var departure = new Set();
var destination = new Set();

Page({
  data:{
    sex: ['请选择性别','男','女'],
    type:2,
    gender:0,
    date:today,
    start: minday,
    end:maxday,
    time:'请选择时间',
    types: [{ name: '1', value: '车找人', abled: true }, { name: '2', checked: true, value: '人找车', abled: false}],
    Surpluss:['请选择',1,2,3,4,5,6],
    surplus:0,
    isAgree: false,
    vehicle:'',
    departure:'出发地',
    destination:'目的地',
    goods:0,
    price:'',
    remark:'',
    mode:'1',
    dateText:['','出发日期', '截止日期']
  },
  goodsChange:function(e){
    if(e.detail.value[0] == 1){
      this.setData({ goods:1});
    }else{
      this.setData({ goods: 0 });
    }
  },
  setSex:function(e){
    this.setData({gender:e.detail.value})
  },
  bindDateChange:function(e){
    this.setData({
        date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
      this.setData({
          time: e.detail.value
      })
  },
  selectType:function(e){
    this.setData({type:e.detail.value})
  },
  selectMode: function (e) {
    this.setData({ mode: e.detail.value })
  },
  setsurplus:function(e){
    this.setData({surplus:e.detail.value})
  },
  bindAgreeChange: function (e) {
      this.setData({
          isAgree: !!e.detail.value.length
      });
  },
  formSubmit:function(e){
    var data = e.detail.value;
    var that = this;
    data.goods = this.data.goods;
    console.log(data);
    if (data.phone == '') {
      wx.showModal({
        title: '发布错误',
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
    if(data.name == ''){
      util.isError('请输入姓名', that);
      return false;
    }
    if(data.gender == 0){
      util.isError('请选择性别', that);
      return false;
    }

    if(!(/^1[34578]\d{9}$/.test(data.phone))){
      util.isError('手机号码错误', that);
      return false;
    }
    if(that.data.departure == '出发地'){
      util.isError('请选择出发地', that);
      return false;
    }
    if(that.data.destination == '目的地'){
      util.isError('请选择目的地', that);
      return false;
    }
    if(data.time == '请选择时间'){
      util.isError('请选择出发时间', that);
      return false;
    }
    if(data.surplus == '0'){
      var arr = new Array('','剩余空位','乘车人数');
      util.isError('请选择'+arr[data.type], that);
      return false;
    }

    
    if(!data.isAgree[0]){
      util.isError('请阅读并同意条款',that);
      return false;
    }
    delete data.isAgree;
    data.departure = that.data.departure;
    data.destination = that.data.destination;
    data.departureTopSet = JSON.stringify(departure);
    data.destinationTopSet = JSON.stringify(destination);
    util.req('info/add',data,function(data){
      if(data.status){
        wx.redirectTo({
          url: '/pages/info/index?id=' + data.data.info_id
        });
      }else{
        util.isError(data.errmsg,that);
        return false;
      }
    })
    util.clearError(that);
  },
  sexDeparture:function(){
    var that = this;
    wx.chooseLocation({
      success:function(res){
        departure.latitude = res.latitude;
        departure.longitude = res.longitude;
        that.setData({
          departure:res.address
        })
      },
      fail:function () {
        util.modal('错误', '请检查是否开启手机定位');
      }
    })
  },
  sexDestination:function(){
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        destination.latitude = res.latitude;
        destination.longitude = res.longitude;
        that.setData({
          destination:res.address
        })
      },
      fail: function () {
        util.modal('错误', '请检查是否开启手机定位');
      }
    })
  },
  onShow:function(options){
    app.reflashUser();
    this.setData({
      gender:app.globalData.userInfo.gender,
      name:(app.globalData.userInfo.name == 'null')?app.globalData.userInfo.nickName:app.globalData.userInfo.name,
      phone:app.globalData.userInfo.phone,
      vehicle:app.globalData.userInfo.vehicle
    })
    console.log(app.globalData.userInfo.driver);
    if (app.globalData.userInfo.driver == 1){
      this.setData({'types[0].abled':false});
    }
  }
})