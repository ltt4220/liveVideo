var WXBizDataCrypt = require('RdWXBizDataCrypt.js');
const app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function dialogAlert(content) {
  wx.showModal({
    title: '提示',
    content: content,
    showCancel: false,
    confirmText: '知道了',
    confirmColor: '#df2d56',
  })
}

//微信登录
function wxLogin(obj,callback) {
  wx.login({//login流程
    success: function (res) {//登录成功
      if (res.code) {

        wx.showToast({ title: '正在登录...', icon: 'loading', duration: 10000 });
        wx.request({
          url: requestUrl + '/wxAppletUser/getSessionKey.do',
          data: {
            appid: obj.appid,
            secret: obj.secret,
            code: res.code
          },
          success: function(res) {
            var pc = new WXBizDataCrypt(obj.appid,res.data.session_key)
            var data = pc.decryptData(obj.encryptedData, obj.iv)
            console.log('解密后 data: ', data)
            wxLoginRequest(data, callback);
          },
          complete: function () {
            wx.hideToast();
          } 
        })
      } else {
        dialogAlert('获取用户登录态失败！');
      }
    }
  });

}

var loginCount = 1;
function wxLoginRequest(obj, callback) {
  
  wx.request({
    url: requestUrl + '/wxAppletUser/wxAppletLogin.do',
    data: {
      avatarUrl: obj.avatarUrl,
      gender: obj.gender,
      openId: obj.openId,
      unionId: obj.unionId,
      nickName: obj.nickName,
      shopPath: obj.shopPath,
    },
    success: function (res) {
      if (res.statusCode == 200 && res.data.status == 200) {

        app.globalData.userId = res.data.userInfo.userId;
        app.globalData.userInfo = res.data.userInfo;
        wx.redirectTo({
          url: `/pages/web-view/web-view?url=${encodeURIComponent(`http://emehenan.ctwenhuayun.cn/wxAppletUser/createUserSession.do?userId=${app.globalData.userId}&callback=${encodeURIComponent(callback)}`)}`
        })
      } else {
        if (loginCount > 2) {
          dialogAlert("登录失败！");
        } else {
          console.log(obj);
          console.log(loginCount);
          loginCount++;
          setTimeout(function(){
            wxLogin(obj, fn);
          },1000)
        }
      }
    },
    fail: function (res) {
      // console.log(res);
      dialogAlert("登录失败！")
    }
  })
}

var requestUrl = 'http://emehenan.ctwenhuayun.cn';
module.exports = {
  wxLogin: wxLogin,
  formatTime: formatTime,
  dialogAlert: dialogAlert,
  appid: 'wx58b167d5bfaca071',
  secret: 'd5df4ae6060234eb5bd6bc59a38a09a9',
  requestUrl: requestUrl,//接口地址
}
