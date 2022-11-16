// pages/login/account/account.js
import {CreateService} from '../../../service/create/create.service';
import {WhyService} from '../../../service/api/why.service';
import {LoginService} from '../../../service/login/login.service';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fg: {}, //表单
  },

  // input的绑定
  textInput(e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail.value;
    this.data.fg[key] = value;
    this.setData({
      fg: this.data.fg
    });
  },
  // 清除input内容
  clearTextInput(e) {
    let key = e.currentTarget.dataset.key;
    this.data.fg[key] = '';
    this.setData({
      fg: this.data.fg
    });
  },

  // 提交表单
  save() {
    const telReg = (/^1[23456789]\d{9}$/);
    if(!this.data.fg['userName']) {
      return CreateService.alertDialog('请输入手机号！');
    }
    if(!this.data.fg['userName'].match(telReg)) {
      return CreateService.alertDialog('请正确填写手机号！');
    }
    if(!this.data.fg['userPwd']) {
      return CreateService.alertDialog('请输入密码！');
    }

    let query = {
      ...this.data.fg,
      callback: ''
    };

    CreateService.showLoading('登录中');

    WhyService.accountLogin(query).then(res => {
      console.log('账户密码登录：', res);
      CreateService.hideLoading();
      if(res.status != 200) {
        switch(res.data) {
          case 'noActive':
            CreateService.alertDialog('账户未被激活！');
            break;
          case 'isFreeze':
            CreateService.alertDialog('账户被冻结！');
            break;
          case 'failure':
            CreateService.alertDialog('手机号或密码错误！');
            break;
          default:
            CreateService.alertDialog(res.data);
        }
      } else {
        LoginService.userInfo = res.data;//存储登录的用户信息
        wx.navigateBack();
      }
    }).catch(err => {
      CreateService.hideLoading();
      CreateService.alertDialog('登录失败！');
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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