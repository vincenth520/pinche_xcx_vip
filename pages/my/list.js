// pages/my/list.js
var app = getApp();
var util = require('../../utils/util.js');
var page = 1;
var list = new Array();
Page({
  data:{
  tabs: ["全部", "车找人", "人找车"]
  },
  del:function(e){
    var that = this;
    var currentTarget = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '确定删除?',
      success: function(res) {
        if (res.confirm) {
          util.req('info/del',{id:list[currentTarget].id},function(data){
            if(data.status == 1){
              list.splice(currentTarget,1);
              that.setData({list:list});
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
            }else{
                util.isError('删除失败,请重试', that);
                return false;
            }
          })
        }
      }
    })
    return false;
  },
  edit:function(e){
    var currentTarget = e.currentTarget.id;
    console.log('/pages/info/add?id='+list[currentTarget].id);
    wx.navigateTo({
      url: '/pages/info/edit?id='+list[currentTarget].id,
      complete:function(res){
          console.log(res)
      }
    })
  },
  onReachBottom:function(){
    if(!this.data.nomore){
      page++;
      this.getList();
    }
  },
  getList(){
    var that = this;
    if (that.data.nomore){
      return false;
    }
    util.req('info/mylist',{page:page},function(data){
      if(data.data.length == 0){
          if(page == 1){        ;
            that.setData({'isnull':true});
          }
          return false;
        } 
        if(page == data.last_page){
          that.setData({ nomore: true });
        }

        if(page == 1){          
          list = new Array();
        }

        var surp = new Array('','空位','人');
        data.data.forEach(function(item){
          try {
            var start = ((item.departure).split('市')[1]).replace(/([\u4e00-\u9fa5]+[县区]).+/, '$1');
          } catch (e) {
            var start = (item.departure).split(/[县区]/)[0];
          }
          try {
            var over = ((item.destination).split('市')[1]).replace(/([\u4e00-\u9fa5]+[县区]).+/, '$1');
          } catch (e) {
            var over = (item.destination).split(/[县区]/)[0];
          }
          var obj = {
            start: start,
            over: over,
            type:that.data.tabs[item.type],
            tp:item.type,
            time:util.formatTime(new Date(item.leave_time)),
            surplus:item.surplus+surp[item.type],
            see:item.see,
            gender:item.gender,
            url: '/pages/info/index?id=' + item.id,
            tm: util.getDateDiff(Date.parse(new Date(item.leave_time.replace(/-/g, '/')))),
            leave_time: item.leave_time,
            id:item.id
          };
          list.push(obj);
        })
      that.setData({list:list});
    })
  },  
  onPullDownRefresh: function(){
    page = 1;
    this.getList();
    wx.stopPullDownRefresh();
  },
  onShow:function(){
    page = 1;
    this.getList();
  }
})