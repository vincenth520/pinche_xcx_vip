//index.js
//获取应用实例
var app = getApp();

var util = require('../../utils/util.js');  
var tcity = require("../../utils/citys.js");

Page({
  data: {
    sex:['保密','男','女'],    
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    verification:'',
    getCodeText:'获取验证码',
    waitCode:false
  },
   bindChange: function(e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;
    
    if(val[0] != t[0]){
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0 ; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0 ; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys:citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys:countys,
        values: val,
        value:[val[0],0,0],
      })
      
      return;
    }
    if(val[1] != t[1]){
      console.log('city no');
      const countys = [];

      for (let i = 0 ; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }
      
      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys:countys,
        values: val,
        value:[val[0],val[1],0]
      })
      return;
    }
    if(val[2] != t[2]){
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }

  },
   setPhone:function(e){
     this.setData({
       'userInfo.phone': e.detail.value
     })
   },
   getCode: function (e) { //获取验证码
     var that = this;
     if (that.data.waitCode) {
       return false;
     }
    if (!(/^1[34578]\d{9}$/.test(that.data.userInfo.phone))) {
      util.isError('手机号码错误', that);
      return false;
    }
    util.req('getcode', { phone: that.data.userInfo.phone},function(data){
      that.setData({
        'waitCode': true
      });
      that.countdown(60);
    })
  },
   countdown:function(time){
     var that = this;
    var phoneInterval = setInterval(function(){
      that.setData({
        'getCodeText': time+'s'
      });
      time--;
      if(time <= 0){
        clearInterval(phoneInterval);
        that.setData({
          'getCodeText': '发送验证码',
          'waitCode':false
        });
      }
    },1000);
   },
   updatePhone:function(){
     this.setData({ 'existPhone': false});
   },
  closeErr:function(){ //关闭错误
    //util.clearError(this);
  },
  open:function(){
    this.setData({
      condition:!this.data.condition
    })
  },
  selectsex:function(e){
    this.setData({
        'userInfo.gender':e.detail.value
    })
  },
  dateAvatar:function(){
    var that = this;
    wx.chooseImage({
      count: 1, 
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        util.uploadFile(tempFilePaths[0],function(data){
          data = JSON.parse(data);
          console.log(data);
            if (data.status) {
              that.setData({
                'userInfo.avatarUrl': data.data.path
              })
              util.clearError(that);
            } else {
              util.isError(data.errmsg, that);
            }
        });
      }
    })
  },
  formSubmit: function(e) {
    var that = this;
    this.setData({
      'userInfo.province':this.data.province,
      'userInfo.city':this.data.city,
      'userInfo.county':this.data.county,
      'userInfo.nickName':e.detail.value.nickName
    })



    var formData = that.data.userInfo;

    if (that.data.existPhone) {
      delete formData.phone;
    }else{
      if (e.detail.value.verification == '') {
        util.isError('请输入验证码', that);
        return false;
      }
      formData.verification = e.detail.value.verification;
    }
    formData = util.objToArray(formData);

    util.req('customer/editUser', formData, function (data) {
      if (data.status) {
        util.clearError(that);
        app.setUserInfo(data.data.userInfo);
        wx.navigateBack({
          delta: 1
        })
      } else {
        util.isError(data.msg, that);
      }
    })
  },
  onLoad: function () {
    var that = this
    wx.getStorage({
      key: 'userInfo',
      success: function(res){
        if (res.data.phone && res.data.phone != ''){
          that.setData({ 'existPhone': true});
        }
        that.setData({
          userInfo:res.data,
          gender:res.data.gender,
          'province':res.data.province,
          'city':res.data.city,
          'county':res.data.county
        })
      },
      fail: function(res) {
        app.login();
      }
    })
    //console.log(that.userInfo);
    tcity.init(that);

    var cityData = that.data.cityData;

    
    const provinces = [];
    const citys = [];
    const countys = [];

    for(let i=0;i<cityData.length;i++){
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0 ; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0 ; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys':citys,
      'countys':countys
    })
    console.log('初始化完成');
  }
})
