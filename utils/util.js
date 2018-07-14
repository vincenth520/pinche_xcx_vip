function formatTime(date) {  
  var year = date.getFullYear()  
  var month = date.getMonth() + 1  
  var day = date.getDate()  
  
  var hour = date.getHours()  
  var minute = date.getMinutes()  
  var second = date.getSeconds()  
  
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')  
}  
  
function formatNumber(n) {  
  n = n.toString()  
  return n[1] ? n : '0' + n  
}  

//配置的服务器域名  
var rootDocment = 'https://pinche.codems.cn/api/';
//授权登录页的小程序信息
var wxAppinfo = {
  'name' : '同城拼车',
  'logo': 'https://wx.qlogo.cn/mmhead/Q3auHgzwzM7rybV80m98DWUxoty9weLdTwiccIb0JOcfiaX4dK4Fsic5A/0'
};
function dateFtt(fmt, date) { //author: meizz   
  var o = {
    "M+": date.getMonth() + 1,                 //月份   
    "d+": date.getDate(),                    //日   
    "h+": date.getHours(),                   //小时   
    "m+": date.getMinutes(),                 //分   
    "s+": date.getSeconds(),                 //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds()             //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
} function dateFtt(fmt,date)   
{ //author: meizz   
  var o = {   
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 

function dateFtt(fmt, date) {  
  var o = {
    "M+": date.getMonth() + 1,                 //月份   
    "d+": date.getDate(),                    //日   
    "h+": date.getHours(),                   //小时   
    "m+": date.getMinutes(),                 //分   
    "s+": date.getSeconds(),                 //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds()             //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
} 

function req(url, data, cb) {
    wx.getStorage({
      key: 'sk',
      success: function (res) {
        if (!data) {
          data = {};
        }
        data.sk = res.data;
        wx.request({
          url: rootDocment + url,
          data: data,
          method: 'post',
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            //console.log(res.data);
            return typeof cb == "function" && cb(res.data)
          },
          fail: function () {
            return typeof cb == "function" && cb(false)
          }
        })
      },
      fail:function(){
        console.log('没有获取到sk');
        wx.request({
          url: rootDocment + url,
          data: data,
          method: 'post',
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            console.log(res.data);
            return typeof cb == "function" && cb(res.data)
          },
          fail: function () {
            return typeof cb == "function" && cb(false)
          }
        })
      }
    });
      
}  
  
function getReq(url, data, cb) {
  wx.getStorage({
    key: 'sk',
    success: function (res) {
      if(!data){
        data = {};
      }
      data.sk = res.data;
      wx.request({
        url: rootDocment + url,
        data: data,
        method: 'get',
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          //console.log(res.data);
          return typeof cb == "function" && cb(res.data)
        },
        fail: function () {
          return typeof cb == "function" && cb(false)
        }
      }) 
    },
    fail: function () {
      console.log('没有获取到sk');
      wx.request({
        url: rootDocment + url,
        method: 'get',
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          console.log(res.data);
          return typeof cb == "function" && cb(res.data)
        },
        fail: function () {
          return typeof cb == "function" && cb(false)
        }
      }) 
    }
  });
}  

function uploadFile(tempFilePath,cb,data={}){
  var url = rootDocment + 'upload';
  wx.getStorage({
    key: 'sk',
    success: function (res) {
      if (!data) {
        data = {};
      }
      data.sk = res.data;
      wx.uploadFile({
        url: url,
        formData: data,
        filePath: tempFilePath,
        name: 'file',
        success: function (res) {
          return typeof cb == "function" && cb(res.data)
        },
        fail: function () {
          return typeof cb == "function" && cb(false)
        }
      })
    }
  });
  
}
  
// 去前后空格  
function trim(str) {  
  return str.replace(/(^\s*)|(\s*$)/g, "");  
}  
  
// 提示错误信息  
function isError(msg, that) {  
  that.setData({  
    showTopTips: true,  
    errorMsg: msg  
  })  
}  
  
// 清空错误信息  
function clearError(that) {  
  that.setData({  
    showTopTips: false,  
    errorMsg: ""  
  })  
}  

function getDateDiff(dateTimeStamp){
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = dateTimeStamp - now;
	if(diffValue < 0){return;}
	var monthC =diffValue/month;
	var weekC =diffValue/(7*day);
	var dayC =diffValue/day;
	var hourC =diffValue/hour;
	var minC =diffValue/minute;
  var result = '';
	if(monthC>=1){
		result="" + parseInt(monthC) + "月后";
	}
	else if(weekC>=1){
		result="" + parseInt(weekC) + "周后";
	}
	else if(dayC>=1){
		result=""+ parseInt(dayC) +"天后";
	}
	else if(hourC>=1){
		result=""+ parseInt(hourC) +"小时后";
	}
	else if(minC>=1){
		result=""+ parseInt(minC) +"分钟后";
	}else
	result="刚刚";
	return result;
}

function getDateBiff(dateTimeStamp){
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	if(diffValue < 0){return;}
	var monthC =diffValue/month;
	var weekC =diffValue/(7*day);
	var dayC =diffValue/day;
	var hourC =diffValue/hour;
  var minC = diffValue / minute;
  var result = '';
	if(monthC>=1){
		result="" + parseInt(monthC) + "月前";
	}
	else if(weekC>=1){
		result="" + parseInt(weekC) + "周前";
	}
	else if(dayC>=1){
		result=""+ parseInt(dayC) +"天前";
	}
	else if(hourC>=1){
		result=""+ parseInt(hourC) +"小时前";
	}
	else if(minC>=1){
		result=""+ parseInt(minC) +"分钟前";
	}else
	result="刚刚";
	return result;
}

function escape2Html(str) { 
 var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'}; 
 return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];}); 
} 

function objToArray(obj){
  var arr = new Array();
  for (var i in obj) {
    arr[i] = obj[i];
  }
  return arr;
}
function modal(title,text,cb){
  wx.showModal({
    title: title,
    content: text,
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    }
  })
}


module.exports = {  
  formatTime: formatTime,  
  req: req,  
  trim: trim,  
  isError: isError,   
  clearError: clearError,  
  getReq: getReq,
  getDateDiff:getDateDiff,
  escape2Html:escape2Html,
  getDateBiff: getDateBiff,
  uploadFile: uploadFile,
  objToArray: objToArray,
  modal: modal,
  dateFtt: dateFtt,
  wxAppinfo: wxAppinfo
}  