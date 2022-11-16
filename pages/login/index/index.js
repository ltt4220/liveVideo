// pages/login/index/index.js
import {
  WhyService
} from '../../../service/api/why.service';
import {
  LoginService
} from '../../../service/login/login.service';
import {
  CreateService
} from '../../../service/create/create.service';
import {
  StorageService
} from '../../../service/storage/storage.service';

const app = getApp();
const co = app.co;
const config = app.config;
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopInfo: {}, //文化馆信息

    weChatInfo: {}, // 微信授权的用户信息
    iv: '',
    encryptedData: '',
    openId: '',
    unionId: '',
  },

  // 微信授权用户信息
  getUserInfo(res) {
    // console.log('授权用户信息', res);
    if (res.detail.userInfo) {
      this.setData({
        iv: res.detail.iv,
        encryptedData: res.detail.encryptedData,
        weChatInfo: res.detail.userInfo || {}
      });
      LoginService.weChatInfo = this.data.weChatInfo; //存储微信授权的用户信息
      this.getDecode();
    } else {
      CreateService.alertDialog('拒绝授权！');
    }
  },
  // 获取openId和unionId
  getDecode() {
    co.checkSession().then(sid => {
      let query = {
        sid: sid,
        iv: this.data.iv,
        encryptedData: this.data.encryptedData
      }
      console.log('111', query);
      co.http.api('/minicom/user/decode', query).then(res => {
        console.log('111', res);
        this.setData({
          openId: res.data.openId,
          unionId: res.data.unionId
        });
        this.weChatLogin();
      }).catch(err => {
        console.log(111, '授权失败！');
        CreateService.alertDialog('授权失败！');
      });
    });
  },
  // 微信登录
  weChatLogin() {
    let query = {
      openId: this.data.openId,
      unionId: this.data.unionId,
      avatarUrl: this.data.weChatInfo.avatarUrl,
      nickName: this.data.weChatInfo.nickName,
      gender: this.data.weChatInfo.gender,
      shopPath: 'sh',
      callback: ''
    };
    // console.log('登录', query);
    CreateService.showLoading('登录中');

    WhyService.weChatLogin(query).then(res => {
      // console.log('登录', res);
      CreateService.hideLoading();
      if (res.status != 200) {
        return CreateService.alertDialog('登录失败！');
      }
      LoginService.openId = this.data.openId;
      LoginService.userInfo = res.userInfo; //存储登录的用户信息
      wx.navigateBack();

    }).catch(err => {
      CreateService.hideLoading();
      CreateService.alertDialog('登录失败！');
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      shopInfo: StorageService.get('SHOP_INFO') || {}
    });
    console.log(this.data.shopInfo);


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    co.getSessionId().then(sid => {
      console.log('sid', sid)
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})