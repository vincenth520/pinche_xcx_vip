// pages/driver/authentication.js

var app = getApp();
var util = require('../../utils/util.js');
var tcity = require("../../utils/citys.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    driver: {},
    sex: ['','男', '女'],
    condition: false,
    thisStep:1,
    isDriver: 0,
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.reflashUser();
    var that = this;
    console.log(app.globalData.userInfo.driver);
    that.setData({
      isDriver: app.globalData.userInfo.driver
    });
    if (app.globalData.userInfo.driver == 0) {
      that.setData({
        driver: {
          name: '',
          gender: 1,
          idnumber: '',
          province: '',
          city: '',
          county: '',
          firstgetdate: '',
          platenumber: '',
          vehicle: '',
          color: '',
          owner: '',
          cargetdate: '',
          driverlicense: '',
          drivinglicense: '',
          idcard1: '',
          idcard2: ''
        }
      })
    } else if (app.globalData.userInfo.driver == -1) {
      this.setData({ 'thisStep': 6 });
      util.getReq('driver/get_authentication', [], function (data){
        that.setData({
          driver: data.data,
          county: data.data.county,
          province: data.data.province,
          city: data.data.city,
        });
      })
    } else if (app.globalData.userInfo.driver == 1) {
      this.setData({ 'thisStep': 5 });
    }  else {
      this.setData({ 'thisStep': 4 });
    }  

    tcity.init(that);

    var cityData = that.data.cityData;


    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys
    })
    console.log('初始化完成');  
  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  //填写身份信息
  tofirst: function () {
    console.log(this.data);
    this.setData({ 'thisStep': 1 });
  },
  tosecond: function () {
    this.setData({ 'thisStep': 2 });
  },
  //填写车辆信息
  second:function(e){
    console.log(e.detail.value);
    var driverData = e.detail.value;
    driverData.province = this.data.province;
    driverData.city = this.data.city;
    driverData.county = this.data.county;
    if (driverData.name == ''){
      util.modal('提示','请输入姓名');
      return false;
    }
    if (driverData.idnumber == '') {
      util.modal('提示', '请输入身份证号');
      return false;
    }
    if (driverData.province == '' || driverData.city == '' || driverData.county == '') {
      util.modal('提示', '请选择城市');
      return false;
    }
    if (driverData.firstgetdate == '') {
      util.modal('提示', '请选择驾照领取日期');
      return false;
    }
    this.setData({
      'driver.name': driverData.name,
      'driver.idnumber': driverData.idnumber,
      'driver.county': driverData.county,
      'driver.city': driverData.city,
      'driver.province': driverData.province,
      'driver.firstgetdate': driverData.firstgetdate,
    });
    this.setData({'thisStep':2});
  },
  //上传证件
  thrid: function (e) {
    console.log(e.detail.value);
    var driverData = e.detail.value;
    if (driverData.platenumber == '') {
      util.modal('提示', '请输入车牌号');
      return false;
    }
    if (driverData.vehicle == '') {
      util.modal('提示', '请输入车型');
      return false;
    }
    if (driverData.color == '') {
      util.modal('提示', '请选择颜色');
      return false;
    }
    if (driverData.owner == '') {
      util.modal('提示', '请输入车辆所有人');
      return false;
    }
    if (driverData.cargetdate == '') {
      util.modal('提示', '请输入车辆注册日期');
      return false;
    }
    this.setData({
      'driver.platenumber': driverData.platenumber,
      'driver.vehicle': driverData.vehicle,
      'driver.color': driverData.color,
      'driver.owner': driverData.owner,
      'driver.cargetdate': driverData.cargetdate
    });
    console.log(this.data);
    this.setData({ 'thisStep': 3 });

  },
  commit:function(){
    var that = this;
    if (this.data.driver.driverlicense == '') {
      util.modal('提示', '请上传驾照照片');
      return false;
    }
    if (this.data.driver.drivinglicense == '') {
      util.modal('提示', '请上传行驶证照片');
      return false;
    }
    if (this.data.driver.idcard1 == '') {
      util.modal('提示', '请上传身份证照片正面');
      return false;
    }
    if (this.data.driver.idcard2 == '') {
      util.modal('提示', '请上传身份证照片反面');
      return false;
    }
    var formData = util.objToArray(this.data.driver);
    util.req('driver/authentication', formData,function(data){
      if(data.status){
        app.reflashUser();
        that.setData({ 'thisStep': 4 });
      }else{
        try{
          console.log(data.errors)
          var message = data.errors[Object.keys(data.errors)[0]][0];
        } catch (err) {
          var message = '请检查您的输入';
        }
        util.modal('提示', message);
        return false;
      }
    })
  },
  close:function(){
    wx.navigateBack({
      delta: 2
    })
  },
  selectsex: function (e) {
    this.setData({ 'driver.gender': e.detail.value });
  },
  bindDateChange:function(e){
    this.setData({ 'driver.firstgetdate': e.detail.value});
  },
  changecargetdate: function (e) {
    this.setData({ 'driver.cargetdate': e.detail.value });
  },
  chooseDriverLicense:function(e){
    var that = this;
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        util.uploadFile(res.tempFilePaths[0], function (data) {
          data = JSON.parse(data);
          if (data.status) {
            that.setData({              
              'driver.driverlicense': data.data.path
            });
            util.clearError(that);
          } else {
            util.isError(data.errmsg, that);
          }
        });
      }
    })
  },
  chooseDrivingLicense: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        util.uploadFile(res.tempFilePaths[0], function (data) {
          data = JSON.parse(data);
          if (data.status) {
            that.setData({
              'driver.drivinglicense': data.data.path
            });
            util.clearError(that);
          } else {
            util.isError(data.errmsg, that);
          }
        });
      }
    })
  },
  chooseidcard1: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        util.uploadFile(res.tempFilePaths[0], function (data) {
          data = JSON.parse(data);
          if (data.status) {
            that.setData({
              'driver.idcard1': data.data.path
            });
            util.clearError(that);
          } else {
            util.isError(data.errmsg, that);
          }
        });
      }
    })
  },
  chooseidcard2: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        util.uploadFile(res.tempFilePaths[0], function (data) {
          data = JSON.parse(data);
          if (data.status) {
            that.setData({
              'driver.idcard2': data.data.path
            });
            util.clearError(that);
          } else {
            util.isError(data.errmsg, that);
          }
        });
      }
    })
  },
  bindChange: function (e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0],
      })

      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }

  }
})