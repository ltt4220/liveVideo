// pages/login/sms/sms.js
import {CreateService} from '../../../service/create/create.service';
import {ChinaService} from '../../../service/api/china.service';
import {LoginService} from '../../../service/login/login.service';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fg: {}, //表单
    countDown: {
      status: false, //倒计时状态： true正在倒计时 | false不在倒计时
      time: 60, //倒计时时间
      total: 60,//倒计时总时间
    }
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

  // 获取短信验证码
  sendAuthCode() {
    const telReg = (/^1[23456789]\d{9}$/);
    if(!this.data.fg['mobileNo']) {
      return CreateService.alertDialog('请输入手机号！');
    }
    if(!this.data.fg['mobileNo'].match(telReg)) {
      return CreateService.alertDialog('请正确填写手机号！');
    }
    this.vcodeCountDown();
    let query = {
      mobileNo: this.data.fg['mobileNo']
    };
    console.log(query);
    ChinaService.loginSendCode(query).then(res => {
      console.log('短信验证码', res);
      if(res.status != 1) {
        return CreateService.alertDialog('获取验证码失败！');
      }
    }).catch(err => {
      CreateService.alertDialog('验证码发送失败，请稍后重试！');
    });
  },

  // 提交表单
  save() {
    const telReg = (/^1[23456789]\d{9}$/);
    const codeReg = (/^\d{6}$/);
    if(!this.data.fg['mobileNo']) {
      return CreateService.alertDialog('请输入手机号！');
    }
    if(!this.data.fg['mobileNo'].match(telReg)) {
      return CreateService.alertDialog('请正确填写手机号！');
    }
    if(!this.data.fg['code']) {
      return CreateService.alertDialog('请输入手机验证码！');
    }
    if(!this.data.fg['code'].match(codeReg)) {
      return CreateService.alertDialog('请正确填写手机验证码！');
    }
    let query = {
      ...this.data.fg
    };
    console.log(query);
    CreateService.showLoading('登录中');

    ChinaService.codeLogin(query).then(res => {
      console.log('登录', res);
      CreateService.hideLoading();

      if(res.status != 1) {
        return CreateService.alertDialog('登录失败');
      }
      if(res.data.status != 'success') {
        return CreateService.alertDialog(res.data.errorMsg);
      }
      const userInfo = {
        userId: res.data.userId
      }

      LoginService.userInfo = userInfo;//存储登录的用户信息
      wx.navigateBack();

    }).catch(err => {
      CreateService.hideLoading();
      CreateService.alertDialog('登录失败！');
    });
  },

  // 倒计时
  vcodeCountDown() {
    this.setData({
      'countDown.status': true,
      'countDown.time': this.data.countDown.total
    });
    let timer = setInterval(() => {
      this.setData({
        'countDown.time': this.data.countDown.time - 1
      });
      if(this.data.countDown.time <= 0) {
        clearInterval(timer);
        this.setData({
          'countDown.status': false,
          'countDown.time': this.data.countDown.total
        });
      }
    }, 1000)
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